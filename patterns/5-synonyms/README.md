# Synonym Search

Search has the ability to use a seperate synonyms collection to map words together as either `equivalent` or `explicit`. MongoDB's implementation os synonym search runs the comparison on query time (instead of on index creation like other search libraries) which allows it to auto-update as the documents change.

Equivalent - Links multiple words together

Explicit - Replaces one word with the other

### Code Walkthrough

1. We'll create a new collection called `synonyms` in the `movies` database, then populate it with the following document:

``` javascript
[{
  "mappingType": "equivalent",
  "synonyms": [
    "insomniac",
    "sleepless",
    "wakeful"
  ]
}]
```

2. Let's map the synonyms collection, `synonyms` to the collection we plan on querying, `movies` using a custom JSON index the we'll name `synonym-search` in the Atlas UI:

``` javascript
{
  "mappings": {
    "dynamic": true
  },
  "synonyms": [
    {
      "analyzer": "lucene.standard",
      "name": "mySynonyms",
      "source": {
        "collection": "synonyms"
      }
    }
  ]
}
```

3. Now when we query for `wakeful`, it will also return documents that contain `insomniac` and `sleepless`. :

``` javascript
[
    {
        '$search': {
            'index': 'synonym-search',
            'text': {
                'query': 'wakeful',
                'path': 'plot',
                'synonyms': 'mySynonyms'                
            }
        }
    }
]
```

And a resulting document:

``` javascript
title:"Fight Club"
plot:"An insomniac office worker, looking for a way to change his life, cros..."
```


### Author(s)  


[Ethan Steininger](https://github.com/esteininger)

### References  

Docs: [https://docs.atlas.mongodb.com/reference/atlas-search/synonyms/](https://docs.atlas.mongodb.com/reference/atlas-search/synonyms/)
