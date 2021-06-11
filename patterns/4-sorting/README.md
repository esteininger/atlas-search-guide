## Sorting using the near operator

As [documented here](https://docs.atlas.mongodb.com/reference/atlas-search/performance/#-sort-aggregation-stage-usage), using a [$sort](https://docs.mongodb.com/manual/reference/operator/aggregation/sort/) aggregation pipeline stage after a [$search](https://docs.atlas.mongodb.com/reference/atlas-search/query-syntax/#std-label-query-syntax-ref) stage can drastically slow down query results. We have [this UserVoice request](https://feedback.mongodb.com/forums/924868-atlas-search/suggestions/41559712-allow-count-and-sort-inside-search) open for improving sort performance with Atlas Search. Meanwhile, we recommend using the Atlas Search [near](https://docs.atlas.mongodb.com/reference/atlas-search/near/#std-label-near-ref) operator to sort documents based on a numeric, date, or geo field. This example demonstrates how the [near](https://docs.atlas.mongodb.com/reference/atlas-search/near/#std-label-near-ref) operator can be used to return documents in a sorted order, and without using a separate [$sort](https://docs.mongodb.com/manual/reference/operator/aggregation/sort/) stage. Specifically, it shows how to perform a descending sort on the field “B”, for the documents where the field “A” contains the string “Adam”. By changing the "origin" the sort order can be changed.

### Code Example

``` javascript
{
  $search: {
    "compound": {
      "must": [{
        "text": {
          "query": "Adam",
          "path": "A"
        }
      }, {
        "range": {
          "gt": 0,
          "lt": 12,
          "path": "B"
        }
      }, {
        "near": {
          "path": "B",
          "origin": 12,
          "pivot": 1
        }
      }]
    }
  }
}
```

### Author(s)  

[Harshad Dhavale](https://github.com/harshadpd)

### References  

Docs: [https://docs.atlas.mongodb.com/reference/atlas-search/near/](https://docs.atlas.mongodb.com/reference/atlas-search/near/)
