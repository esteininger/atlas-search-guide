# Creating an Automatic Search Improvement Feedback Loop

The standard way to improve your search queries' relevance is through manual intervention. For example, you can introduce [score boosting](../3-advanced-scoring) to ensure searches where a key is present in some fields weighs higher than others, this is however fixed by nature. The results are dynamic but the logic itself doesn't change.

The following project will showcase how to create a feedback loop that is self-tuning, in order to deliver incrementally more relevant search results to your users. All without complex machine learning models!

## Example

We have a food search application where a user searches for "Romanian Food". Assuming we're logging every users' clickstream data (their step-by-step interaction with our application), we can take a look at this "sequence" and compare it to other results that have yielded a strong CTA (call to action), a successful checkout.

Another user searched for "German Cuisine" and that had a very similar clickstream sequence. Well, we can build a script that analyzes both these users' (and others') clickstreams, identify similarities, and assuming it exceeds a preset `confidence threshold`, we can tell the script to append it to a [synonyms document](../5-synonyms) that contains "German", "Romanian", and other more common cuisines like "Hungarian".

Let's dive into a tutorial on how to build this workflow

## Tutorial

### 1. Log user's clickstream activity

In our app tier, as events are fired, we log them to a `clickstreams` collection, like:

```javascript
[{
		"session_id": "1",
		"event_id": "search_query",
		"metadata": {
			"search_value": "romanian food"
		},
		"timestamp": "1"
	},
	{
		"session_id": "1",
		"event_id": "add_to_cart",
		"product_category":"eastern european cuisine",
		"timestamp": "2"
	},
	{
		"session_id": "1",
		"event_id": "checkout",
		"timestamp": "3"
	},
	{
		"session_id": "1",
		"event_id": "payment_success",
		"timestamp": "4"
	},
	{
		"session_id": "2",
		"event_id": "search_query",
		"metadata": {
			"search_value": "hungarian food"
		},
		"timestamp": "1"
	},
	{
		"session_id": "2",
		"event_id": "add_to_cart",
		"product_category":"eastern european cuisine",
		"timestamp": "2"
	}
]
```


In this simplified list of events we can conclude that `{"session_id":"1"}` searched for "romanian food", which led to a higher conversion rate, `payment_success`, compared to `{"session_id":"2"}`, who searched "hungarian food" and stalled after the `add_to_cart` event.

You can import this data yourself using [sample_data.json](sample_data.json)

Let's prepare the data for our search_tuner script.


### 2. Create a view that groups by session_id, then filters on the presence of searches

By the way, it's no problem that only some documents have a `metadata` field, our `$group` operator can intelligently identify the ones that do vs don't.

``` python

[
    # first we sort by timestamp to get everything in the correct sequence of events,
    # as that is what we'll be using to draw logical correlations
    {
        '$sort': {
            'timestamp': 1
        }
    },
    # next, we'll group by a unique session_id, include all the corresponding events, and begin
    # the filter for determining if a search_query exists
    {
        '$group': {
            '_id': '$session_id',
            'events': {
                '$push': '$$ROOT'
            },
            'isSearchQueryPresent': {
                '$sum': {
                    '$cond': [
                        {
                            '$eq': [
                                '$event_id', 'search_query'
                            ]
                        }, 1, 0
                    ]
                }
            }
        }
    },
    # we hide session_ids where there is no search query
    # then create a new field, an array called searchQuery, which we'll use to parse
    {
        '$match': {
            'isSearchQueryPresent': {
                '$gte': 1
            }
        }
    },
    {
        '$unset': 'isSearchQueryPresent'
    },
    {
        '$set': {
            'searchQuery': '$events.metadata.search_value'
        }
    }
]

```

Let's create the view by building the query, then going into Compass and adding it as a new collection called `group_by_session_id_and_search_query`:

<img src="assets/compass_view_creation.png" alt="compass view screenshot" width="50%"/>

<img src="assets/compass_document_view.png" alt="compass document view screenshot" width="50%"/>


### 3. Build a scheduled job that compares similar clickstreams and pushes the resulting synonyms to the synonyms collection

```javascript
// Provide a success indicator to determine which session we want to
// compare any incomplete sessions with
const successIndicator = "payment_success"

// TODO: Revisit this, do we need it?
// Maybe need to incorporate confidence and boost?

//  what percentage similarity between two sets of click/event streams
//  we'd accept to be determined as similar enough to produce a synonym
//  relationship
const acceptedConfidence = .9

//  boost the confidence score when the following values are present
//  in the eventstream
const eventBoosts = {
  successIndicator: .1
}

/**
 * Enrich sessions with a flattened event list to make comparison easier.
 * Determine if the session is to be considered successful based on the success indicator.
 * @param {*} eventList List of events in a session.
 * @returns {any} Calculated values used to determine if an incomplete session is considered to
 * be related to a successful session.
 */
const enrichEvents = (eventList) => {
  return {
    eventSequence: eventList.map(event => { return event.event_id }).join(';'),
    isSuccessful: eventList.some(event => { return event.event_id === successIndicator })
  }
}

/**
 * De-duplicate common tokens in two strings
 * @param {*} str1
 * @param {*} str2
 * @returns Returns an array with the provided strings with the common tokens removed
 */
const dedupTokens = (str1, str2) => {
  const splitToken = ' '
  const tokens1 = str1.split(splitToken)
  const tokens2 = str2.split(splitToken)
  const dupedTokens = tokens1.filter(token => { return tokens2.includes(token)});
  const dedupedStr1 = tokens1.filter(token => { return !dupedTokens.includes(token)});
  const dedupedStr2 = tokens2.filter(token => { return !dupedTokens.includes(token)});

  return [ dedupedStr1.join(splitToken), dedupedStr2.join(splitToken) ]
}

const findMatchingIndex = (synonyms, results) => {
  let matchIndex = -1
  for(let i = 0; i < results.length; i++) {
    for(const synonym of synonyms) {
      if(results[i].synonyms.includes(synonym)){
        matchIndex = i;
        break;
      }
    }
  }
  return matchIndex;
}
/**
 * Inspect the context of two matching sessions.
 * @param {*} successfulSession
 * @param {*} incompleteSession
 */
const processMatch = (successfulSession, incompleteSession, results) => {
  console.log(`=====\nINSPECTING POTENTIAL MATCH: ${ successfulSession.searchQuery} = ${incompleteSession.searchQuery}`);
  let contextMatch = true;

  // At this point we can assume that the sequence of events is the same, so we can
  // use the same index when comparing events
  for(let i = 0; i < incompleteSession.events.length; i++) {
    // if we have a context, let's compare the kv pairs in the context of
    // the incomplete session with the successful session
    if(incompleteSession.events[i].context){
      const eventWithContext = incompleteSession.events[i]
      const contextKeys = Object.keys(eventWithContext.context)

      try {
        for(const key of contextKeys) {
          if(successfulSession.events[i].context[key] !== eventWithContext.context[key]){
            // context is not the same, not a match, let's get out of here
            contextMatch = false
            break;
          }
         }
      } catch (error) {
        contextMatch = false;
        console.log(`Something happened, probably successful session didn't have a context for an event.`);
      }
    }
  }

  // Update results
  if(contextMatch){
    console.log(`VALIDATED`);
    const synonyms = dedupTokens(successfulSession.searchQuery, incompleteSession.searchQuery, true)
    const existingMatchingResultIndex = findMatchingIndex(synonyms, results)
    if(existingMatchingResultIndex >= 0){
      const synonymSet = new Set([...synonyms, ...results[existingMatchingResultIndex].synonyms])
      results[existingMatchingResultIndex].synonyms = Array.from(synonymSet)
    }
    else{
      const result = {
        "mappingType": "equivalent",
        "synonyms": synonyms
      }
      results.push(result)
    }

  }
  else{
    console.log(`NOT A MATCH`);
  }

  return results;
}

/**
 * Compare the event sequence of incomplete and successful sessions
 * @param {*} successfulSessions
 * @param {*} incompleteSessions
 * @returns
 */
const compareLists = (successfulSessions, incompleteSessions) => {
  let results = []
  for(const successfulSession of successfulSessions) {
    for(const incompleteSession of incompleteSessions) {
      // if the event sequence is the same, let's inspect these sessions
      // to validate that they are a match
      if(successfulSession.enrichments.eventSequence.includes(incompleteSession.enrichments.eventSequence)){
        processMatch(successfulSession, incompleteSession, results)
      }
    }
  }
  return results
}

const processSessions = (sessions) => {
  // console.log(`Processing the following list:`, JSON.stringify(sessions, null, 2));
  // enrich sessions for processing
  const enrichedSessions = sessions.map(session => {
    return { ...session, enrichments: enrichEvents(session.events)}
  })
  // separate successful and incomplete sessions
  const successfulEvents = enrichedSessions.filter(session => { return session.enrichments.isSuccessful})
  const incompleteEvents = enrichedSessions.filter(session => { return !session.enrichments.isSuccessful})

  return compareLists(successfulEvents, incompleteEvents);
}

/**
 * Main Entry Point
 */
const main = () => {
  const results = processSessions(eventsBySession);
  console.log(`Results:`, results);
}

main();

module.exports = processSessions;
```

Run [the script](search_tuner.py) yourself

### 4. Enhance our search query with the newly appended synonyms.

```javascript
[
    {
        '$search': {
            'index': 'synonym-search',
            'text': {
                'query': 'hungarian',
                'path': 'cuisine-type'
            },
            'synonyms': 'similarCuisines'
        }
    }
]
```

See [the synonyms tutorial](../patterns/5-synonyms)

### Credit & Influence

[Isa Torres](https://github.com/isamarietr)
[Asya Kamsky](kamsky.org/stupid-tricks-with-mongodb/aggregating-over-time)
[Roy Kiesler]()
