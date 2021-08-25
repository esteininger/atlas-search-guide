# Creating an Automatic Search Improvement Feedback Loop

The standard way to improve your search queries' relevance is through manual intervention. For example, you can introduce [score boosting](#) to ensure searches where a key is present in some fields weighs higher than others, this is however fixed by by nature. The results are dynamic but the logic itself doesn't change via the query.

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
		"user_id": "1",
		"event_id": "search_query",
		"metadata": {
			"search_value": "romanian food"
		},
		"timestamp": "1"
	},
	{
		"user_id": "1",
		"event_id": "add_to_cart",
		"timestamp": "2"
	},
	{
		"user_id": "1",
		"event_id": "checkout",
		"timestamp": "3"
	},
	{
		"user_id": "1",
		"event_id": "payment_success",
		"timestamp": "4"
	},
	{
		"user_id": "2",
		"event_id": "search_query",
		"metadata": {
			"search_value": "hungarian food"
		},
		"timestamp": "1"
	},
	{
		"user_id": "2",
		"event_id": "add_to_cart",
		"timestamp": "2"
	}
]
```

In this overly simplified list of events we can conclude that `{"user_id":"1"}` searched for "romanian food", which led to a higher conversion rate, `payment_success`, compared to `{"user_id":"2"}`, who searched "hungarian food" and stalled after `add_to_cart`.

So let's prepare the data for our search_tuner script.


### 2. Create a materialized view that groups by user_id and search_value, then filters on the presence of

By the way, it's no problem that only some documents have a `metadata` field, our `$group` operator can intelligently identify the ones that do vs don't.

``` javascript

[
  // first we'll sort by the sequence the events occurred in our UI, after-all it's the logical order we'll be comparing to determine a synonym.
  {
    '$sort': {'$timestamp': -1}
  }
]

```








### 3. Build a scheduled realm trigger that updates this materialized view once a day, then pushes the resulting synonyms to the synonyms collection


### Credit & Influence

[Roy Kiesler](https://github.com/)
