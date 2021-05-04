# Basic search demo

Basic search using term

## Basic Search

[Notebook Link](https://github.com/esteininger/atlas-search-patterns/blob/master/foundations/2-basic/FTS Basic, Fuzzy & Highlighting.ipynb)

```python
  pipeline = [
    {
        '$search': {
            'text': {
                'query': "fight club",
                'path': "title"
            }
        }
    }
]
```

## Fuzzy

[Notebook Link](https://github.com/esteininger/atlas-search-patterns/blob/master/foundations/2-basic/FTS Basic, Fuzzy & Highlighting.ipynb)

```python
pipeline = [
    {
        '$search': {
            'text': {
                'query': "fight club",
                'path': "title"
            }
        },
        'fuzzy': {
            'maxEdits': 2
        }
    }
]
```

## Highlighting

[Notebook Link](https://github.com/esteininger/atlas-search-patterns/blob/master/foundations/2-basic/FTS Basic, Fuzzy & Highlighting.ipynb)


```python
pipeline = [
    {
        '$search': {
            'text': {
                'query': "fight",
                'path': "title"
            },
            # text highlighting
            'highlight': {"path": "title"}
        }
    }, {
        '$project': {
            'highlights': {"$meta": "searchHighlights"}
        }
    }
]

```

## Author
Reach out to [Ethan Steininger](https://github.com/esteininger) for help
