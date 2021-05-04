# Build a Full Text Search Engine

Review the basic components of a full-text search engine (including tokenization), and build one.

## Usage

### Analyze

#### Review the first section of the [FTS Engine notebook](https://github.com/esteininger/atlas-search-patterns/blob/master/foundations/1-engine/FTS%20Engine.ipynb). Here is the corresponding master function:

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

``` python
def index():
    index = {}
    # for each movie, run the analyzer function above on title and add it to a set with the movies' ID
    for document in documents:
        for token in analyze(document['title']):
            index[token] = set()
            index[token].add(document['_id']['$oid'])

    return index
```

### Search

``` python
def search(query):
    # tokenize the query     
    analyzed_query = analyze(query)
    # grab movie tokens from the index that match the tokens from the query    
    results = [index().get(token, set()) for token in analyzed_query]

    resulting_documents = []

    # return all movies where the tokenized query matches the tokenized title
    for result in results:
        result_str = ', '.join(result)
        for document in documents:
            if document['_id']['$oid'] == result_str:
                resulting_documents.append(document)
    return resulting_documents
```


## Source

https://bart.degoe.de/building-a-full-text-search-engine-150-lines-of-code/
