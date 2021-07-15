# Searching Across Multiple Collections


### Code Examples

1. We'll create a materialized view of two separate collections (movies and subtitles) using `$lookup`:

``` javascript
[
  {
    '$lookup': {
      'from': 'subtitles',
      'localField': 'title',
      'foreignField': 'movie_title',
      'as': 'movie_subtitles'
    }
  }, {
    '$merge': {
      'into': 'movies_with_subtitles',
      'on': 'title',
      'whenMatched': 'update',
      'whenNotMatched': 'insert'
    }
  }
]
```

2. We'll create a search index on the new materialized view collection, `movies_with_subtitles` called `movies_with_subtitles_default_index`.

3. Now, we'll query the newly formed materialized view `movies_with_subtitles` with a movie quote using a wildcard path in order to search the entire collection and all the newly nested fields of subtitles:

``` javascript
[
  {
    '$search': {
      'index': 'movies_with_subtitles_default_index',
      'text': {
        'query': 'Frankly, my dear',
        'path': {
          'wildcard': '*'
        }
      }
    }
  }
]
```

BONUS: If you want the materialized view collection to update as new movies or subtitles are inserted/updated then run the step from #1 within a [change stream](https://docs.mongodb.com/manual/changeStreams/)


### Author(s)  

[Ethan Steininger](https://github.com/esteininger)

### References  

[$lookup](https://docs.mongodb.com/manual/reference/operator/aggregation/lookup/)  
[Materialized View](https://docs.mongodb.com/manual/core/materialized-views/)
