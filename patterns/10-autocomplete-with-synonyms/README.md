# Autocomplete With Synonyms

When creating an autocomplete index on a field, the Lucene process [creates a number nGrams](#), depending on the size of the string and type of nGram selected.

The Atlas import of Lucene does synonym comparisons on query time, so in order to maintain performant synonym queries it does not currently support synonym lookups with autocomplete.

## Implementation

Using the `sample_mflix.movies` collection, with a document like:

```json
{
  "fullplot": "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy. Their concept catches on, with underground \"fight clubs\" forming in every town, until an eccentric gets in the way and ignites an out-of-control spiral toward oblivion.",
  "imdb": {
    "rating": 8.9,
    "votes": 1191784,
    "id": 137523
  },
  "year": 1999,
  "plot": "An insomniac office worker, looking for a way to change his life, crosses paths with a devil-may-care soap maker, forming an underground fight club that evolves into something much, much more...",
  "genres": ["Drama"],
  "rated": "R",
  "metacritic": 66,
  "title": "Fight Club",
  "lastupdated": "2015-09-02 00:16:15.833000000",
  "languages": ["English"],
  "writers": ["Chuck Palahniuk (novel)", "Jim Uhls (screenplay)"],
  "type": "movie",
  "tomatoes": {
    "website": "http://www.foxmovies.com/fightclub/",
    "viewer": {
      "rating": 4.2,
      "numReviews": 1086282,
      "meter": 96
    },
    "dvd": {
      "$date": "2000-06-06T00:00:00.000Z"
    },
    "critic": {
      "rating": 7.4,
      "numReviews": 161,
      "meter": 80
    },
    "lastUpdated": {
      "$date": "2015-09-12T17:52:10.000Z"
    },
    "consensus": "Solid acting, amazing direction, and elaborate production design make Fight Club a wild ride.",
    "rotten": 33,
    "production": "20th Century Fox",
    "fresh": 128
  },
  "poster": "https://m.media-amazon.com/images/M/MV5BMjJmYTNkNmItYjYyZC00MGUxLWJhNWMtZDY4Nzc1MDAwMzU5XkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_SX677_AL_.jpg",
  "num_mflix_comments": 417,
  "released": {
    "$date": "1999-10-15T00:00:00.000Z"
  },
  "awards": {
    "wins": 11,
    "nominations": 22,
    "text": "Nominated for 1 Oscar. Another 10 wins & 22 nominations."
  },
  "countries": ["USA", "Germany"],
  "cast": ["Edward Norton", "Brad Pitt", "Helena Bonham Carter", "Meat Loaf"],
  "directors": ["David Fincher"],
  "runtime": 139
}
```

### Create the index

```json
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "title": [
        {
          "type": "document",
          "dynamic": true
        },
        {
          "type": "autocomplete"
        }
      ]
    }
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

### Create a synonym collection

Collection, `synonyms` inside database `sample_mflix`, create an equivalence document:

```json
{
  "mappingType": "equivalent",
  "synonyms": ["fight", "wrestle", "brawl"]
}
```

### Run this query:

```javascript
[{
  '$search': {
    'index': 'autocomplete_synonyms',
    "compound": {
      "should": [{
        "autocomplete": {
          "query": 'insomniac',
          "path": 'title'
        }
      }],
      "should": [{
        "text": {
          "query": 'insomniac',
          "path": 'title',
          'synonyms': 'mySynonyms'
        }
      }]
    }
  }
}]
```
