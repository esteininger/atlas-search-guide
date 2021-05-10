# Compound

Compound queries grant the ability to add multiple conditions to your search query. Each element is a clause, where you can embed sub-queries.


[Docs](https://docs.atlas.mongodb.com/reference/atlas-search/compound/)

## Knowledge

### Grams

## Installation

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
```
