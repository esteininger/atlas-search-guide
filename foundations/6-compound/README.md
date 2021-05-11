# Compound

Compound queries grant the ability to add multiple conditions to your search query. Each element is a clause, where you can embed sub-queries.

[Docs](https://docs.atlas.mongodb.com/reference/atlas-search/compound/)

## Knowledge

### Grams

## Installation

## Query

```python
pipeline = [{'$search': {
    "compound": {
        "must": [{
            "text": {
                "query": 'Ethan',
                "path": 'firstName'
            }
        }],
        "mustNot": [{
            "text": {
                "query": 'Henry',
                "path": 'lastName'
            }
        }]
    }
}
}]
```

## Usage
