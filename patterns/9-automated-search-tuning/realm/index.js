// require('dotenv').config()

const eventsBySession = [
  {
    "session_id": "1",
    "events": [
      {
        "event_id": "search_query",
        "search_value": "romanian food"
      },
      {
        "event_id": "add_to_cart",
        "context": {
          "cuisine": "eastern european cuisine"
        }
      },
      {
        "event_id": "checkout"
      },
      {
        "event_id": "payment_success"
      }
    ],
    "searchQuery": "romanian food"
  }, {
    "session_id": "2",
    "events": [
      {
        "event_id": "search_query",
        "search_value": "hungarian food"
      },
      {
        "event_id": "add_to_cart",
        "context": {
          "cuisine": "eastern european cuisine"
        }
      },
      {
        "event_id": "checkout"
      }
    ],
    "searchQuery": "hungarian food"
  },
  {
    "session_id": "3",
    "events": [
      {
        "event_id": "search_query",
        "search_value": "italian food"
      },
      {
        "event_id": "add_to_cart",
        "context": {
          "cuisine": "western european cuisine"
        }
      }
    ],
    "searchQuery": "sad food"
  }
];

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
