# Faceting

Group and drill down by category

### Code Examples

Assuming the `sample_mflix.movies` collection, the following index should be created:

```javascript
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "directors": {
        "type": "stringFacet"
      },
      "year": {
        "type": "number"
      },
      "released": {
        "type": "date"
      }
    }
  }
}
```

And the following query:

```javascript
[
 {
   "$searchMeta": {
     "index":"ethan_facet",
     "facet": {
       "operator": {
         "range": {
           "path": "released",
           "gte": ISODate("2000-01-01T00:00:00.000Z"),
           "lte": ISODate("2015-01-31T00:00:00.000Z")
         }
       },
       "facets": {
         "directorsFacet": {
           "type": "string",
           "path": "directors",
           "numBuckets" : 7
         },
         "yearFacet" : {
           "type" : "number",
           "path" : "year",
           "boundaries" : [2000,2005,2010,2015]
         }
       }
     }
   }
 }
]
```

### Author(s)

[Ethan Steininger](https://github.com/esteininger)

### References

- [$bucket](https://docs.mongodb.com/manual/reference/operator/aggregation/bucket/)
- [$bucketAuto](https://docs.mongodb.com/manual/reference/operator/aggregation/bucketAuto/)
