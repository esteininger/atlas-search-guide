# Advanced Scoring (boost results by variable field)


## Explanation

The score.boost key allows developers to apply arithmetic to modify the relevance scores that Lucene natively returns in your query results, but often that can produce irrelevant documents.

Let’s take an example in which a Yelp user is searching for "Vietnamese restaurants in DC” and it’s important to default the sort by “number of reviews”. Using a simple boost (add, subtract, multiply, etc.) can return Italian restaurants if the number of reviews is high enough. That’s why we use log1p, to ensure the boosted variable (review_count) doesn’t overwhelm the relevance of our search results.

## Query Sample:

``` javascript
[{
		"$search": {
			"index": "restaurants",
			"compound": {
				"must": [{
					"text": {
						"query": "vietnamese",
						"path": "cuisine",
						"score": {
							"function": {
								"log1p": {
									"path": {
										"value": "review_count",
										"undefined": 4
									}
								}
							}
						}
					}
				}],
				"should": [{
					"near": {
						"origin": {
							"type": "Point",
							"coordinates": [-74.0392709, 40.7590403]
						},
						"pivot": 1609,
						"path": "address.coord"
					}
				}]
			}}}]
```
