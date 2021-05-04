# Autocomplete

The autocomplete operator performs a search for a word or phrase that contains a sequence of characters from an incomplete input string. You can use the autocomplete operator with search-as-you-type applications to predict words with increasing accuracy as characters are entered in your application's search field.

[Docs](https://docs.atlas.mongodb.com/reference/atlas-search/autocomplete/)


## Setup

![Setup Index](assets/index.png)

## Knowledge

### Grams:

Max Grams -

Min Grams -

edgeGram -

nGram -

## Code

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

[Link to Notebook](#)


## Author
Reach out to [Ethan Steininger](https://github.com/esteininger) for help
