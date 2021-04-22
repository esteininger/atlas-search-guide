# Build a Full Text Search Engine

Review the basic components of a full-text search engine (including tokenization), and build one.

## Usage

### Analyze

```python
def analyze(text):
    tokens = tokenize(text)
    tokens = lowercase_filter(tokens)
    tokens = punctuation_filter(tokens)
    tokens = stopword_filter(tokens)
    tokens = stem_filter(tokens)

    return [token for token in tokens if token]
```

### Index

### Search


## Source

https://bart.degoe.de/building-a-full-text-search-engine-150-lines-of-code/
