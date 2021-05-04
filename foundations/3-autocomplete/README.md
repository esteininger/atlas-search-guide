# Autocomplete

The autocomplete operator performs a search for a word or phrase that contains a sequence of characters from an incomplete input string. You can use the autocomplete operator with search-as-you-type applications to predict words with increasing accuracy as characters are entered in your application's search field.

[Docs](https://docs.atlas.mongodb.com/reference/atlas-search/autocomplete/)

## Knowledge

### Grams:
Max Grams -

Min Grams -

edgeGram -

nGram -

Demonstration of Auto
## Installation

1. Use the package manager [pip](https://pip.pypa.io/en/stable/) to install pymongo and flask.

```bash
pip install pymongo
pip install flask
```

2. Download the [sample_mflix collection](https://docs.atlas.mongodb.com/sample-data/sample-mflix/) from MongoDB Atlas

3. Create a `config.py` file with your `mongo_uri` connection string from Atlas.

4. Setup an autocomplete index:

``` json
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "title": [
        {
          "foldDiacritics": false,
          "maxGrams": 15,
          "minGrams": 2,
          "tokenization": "edgeGram",
          "type": "autocomplete"
        }
      ]
    }
  }
}
```

## Query

``` python
pipeline = [
    {
        '$search': {
            'autocomplete': {
                'query': query,
                'path': path
            }
        }
    }
]
```

## Usage

```bash
python manage.py
```
