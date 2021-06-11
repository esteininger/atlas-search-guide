# Synonyms based search using Custom Analyzers

Currently, we have a ticket open for introducing support for Synonyms in Atlas Search. We also have [this UserVoice request](https://feedback.mongodb.com/forums/924868-atlas-search/suggestions/38696884-synonym-support-for-search) open for introducing this functionality. Meanwhile, it is possible to implement a sort of synonym-based search functionality by leveraging [the Custom Analyzers with the mapping character filter.](https://docs.atlas.mongodb.com/reference/atlas-search/analyzers/custom/#std-label-mapping-ref)

This sample index-definition demonstrates how [the Custom Analyzers with the mapping character filter](https://docs.atlas.mongodb.com/reference/atlas-search/analyzers/custom/#std-label-mapping-ref) can be used to implement a synonyms based search. Specifically, the index below can be used for searching for synonyms for "Peaceful" ("Calm"), "Things" ("Stuff"), "Motorcycle" ("Bike"), "Seagull" ("Gull").

### Code Example - Index Definition

See [createIndex.py](misc/atlas-apis/index-management/createIndex.py) for an example on implementing this with a mapping file.

``` javascript
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "subject": {
        "analyzer": "wordMappingAnalyzer",
        "type": "string"
      }
    }
  },
  "analyzers": [{
    "charFilters": [{
      "mappings": {
        "Motorcycle": "Bike",
        "Peaceful": "Calm",
        "Seagull": "Gull",
        "Things": "Stuff"
      },
      "type": "mapping"
    }],
    "name": "wordMappingAnalyzer",
    "tokenFilters": [],
    "tokenizer": {
      "type": "standard"
    }
  }]
}
```

### Author(s)  


[Harshad Dhavale](https://github.com/harshadpd)

### References  

Docs: [https://docs.atlas.mongodb.com/reference/atlas-search/analyzers/custom/#std-label-mapping-ref](https://docs.atlas.mongodb.com/reference/atlas-search/analyzers/custom/#std-label-mapping-ref)

# Implementing wildcard case-insensitive search with a Custom analyzer

Currently, the [keyword analyzer](https://docs.atlas.mongodb.com/reference/atlas-search/analyzers/keyword/index.html) accepts a string or array of strings as a parameter and indexes them as single terms. Only exact matches on the field are returned. The [example here](https://docs.atlas.mongodb.com/reference/atlas-search/analyzers/keyword/index.html#example) explains this concept. In other words, the keyword analyzer matches only documents in which the search term matches the entire contents of the field exactly.

The challenges to implementing case-insensitive wildcard search are as follows:

-   The ignoreCase cannot work with keyword analyzer, because case insensitive search (implied by ignoreCase) is not equivalent to exact match (that keyword analyzer is used for).

-   One option is to use [autocomplete operator](https://docs.atlas.mongodb.com/reference/atlas-search/autocomplete/), however, [wildcard operator](https://docs.atlas.mongodb.com/reference/atlas-search/wildcard/) does not work with [autocomplete datatype](https://docs.atlas.mongodb.com/reference/atlas-search/index-definitions/#autocomplete) , and also, we can't use the autocomplete type to index fields whose value is an array of strings.


In short, performing a case-insensitive search on a field that has been defined using keyword analyzer is very challenging to accomplish.

However, it is possible to define a [custom analyzer](https://docs.atlas.mongodb.com/reference/atlas-search/analyzers/custom/) and leverage the keyword analyzer and the [lowercase tokenfilter](https://docs.atlas.mongodb.com/reference/atlas-search/analyzers/custom/#lowercase) to achieve wildcard case-insensitive search. Such a custom analyzer will look something like this:

### Code Example - Index Definition

``` javascript
{
  "mappings": {
    "dynamic": false,
    "fields": {
      "masterProduct": {
        "fields": {
          "prodLongDesc": {
            "analyzer": "keywordLowerer",
            "type": "string"
          },
          "productDesc": {
            "analyzer": "keywordLowerer",
            "type": "string"
          }
        },
        "type": "document"
      }
    }
  },
  "analyzers": [{
    "charFilters": [],
    "name": "keywordLowerer",
    "tokenFilters": [{
      "type": "lowercase"
    }],
    "tokenizer": {
      "type": "keyword"
    }
  }]
}
```

### Author(s)  

[Harshad Dhavale](https://github.com/harshadpd)

### References  

Docs: [https://docs.atlas.mongodb.com/reference/atlas-search/analyzers/custom/](https://docs.atlas.mongodb.com/reference/atlas-search/analyzers/custom/)
