# Creating an Automatic Search Improvement Feedback Loop

The standard way to improve your search queries' relevance is through manual intervention. For example, you can introduce [score boosting](../3-advanced-scoring) to ensure searches where a key is present in some fields weighs higher than others, this is however fixed by by nature. The results are dynamic but the logic itself doesn't change via the query.

The following project will showcase how to create a feedback loop that is self-tuning in order to deliver incrementally more relevant search results to your users.

## Example

Let's say we have a food search application, where a user searches for "Romanian Food". Assuming we're logging every users' clickstream data (their step-by-step interaction with our application), we can take a look at this "sequence" and compare it to other results that have yielded a strong CTA (call to action), a successful checkout.

Maybe another user searched for "German Cuisine" and that had a very similar clickstream sequence. Well, we can build a script that analyzes both these users' (and others') clickstreams, identify similarities, and assuming it exceeds a preset `confidence threshold`, we can tell the script to append it to a [synonyms document](#) that contains "German", "Romanian", and other more common cuisines like "Hungarian".

Let's dive into a tutorial on how to build this workflow

## Tutorial

### 1. Log user's clickstream activity

As events are fired, log them to the `clickstreams` collection, like:

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
		"timestamp": "2"
	}
]
```



In this overly simplified list of events we can conclude that `{"session_id":"1"}` searched for "romanian food", which led to a higher conversion rate, `payment_success`, compared to `{"session_id":"2"}`, who searched "hungarian food" and stalled after `add_to_cart`.

You can import this data yourself using [sample_data.json](/sample_data.json)

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

![compass view screenshot](/assets/compass_view_creation.png)

### 3. Build a scheduled job that compares similar clickstreams and pushes the resulting synonyms to the synonyms collection

```python
print('hello world')
```

Run [the script](/search_tuner.py) yourself

### 4. Enhance our search query with the newly appended synonyms.

See [the synonyms tutorial](../patterns/synonyms)

### Credit & Influence

[Asya Kamsky](kamsky.org/stupid-tricks-with-mongodb/aggregating-over-time)
[Roy Kiesler]()
