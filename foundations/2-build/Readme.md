# Basic search demo

Basic search using term

## Usage

```python
  aggregation = [
      {
          '$search': {
              'term': {
                  'query': "fight club",
                  'path': "titles",
              }
          }
      }
  ]
```

## Author
Reach out to [Ethan Steininger](https://github.com/esteininger) for help
