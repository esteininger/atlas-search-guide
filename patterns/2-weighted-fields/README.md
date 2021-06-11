# Weighted Fields

Oftentimes, engineers building search applications would like to implement relevance that weights some fields as more important than other fields. Let’s consider a book search application in the code example. In it, we want to prioritize author_name most because it will be the most unique, followed by title because it is often copied or part of a work of analysis of the primary book, and quantity available because users may have the option to reserve a copy of the book in the next shipment.

### Code Example

``` javascript
{
  "$search": {
    "compound": {
      "must": [{
          "text": {
            "query": "Hunter S. Thompson",
            "path": "author_name",

            "score": {
              "boost": {
                "value": 9
              }

            }
          }
        },

        {
          "text": {
            "query": "Fear and Loathing in Las Vegas",
            "path": "title",

            "score": {
              "boost": {
                "value": 5
              }

            }
          }
        }
      ],
      "should": [{
        "range": {
          "value": "0",
          "path": "qty_available",
          "score": {
            "boost": {
              "value": 3
            }

          }
        }
      }],
    }
  }
}
```

## Weighted Fields (single input)

Oftentimes, engineers building search applications would like to implement relevance that weights some fields as more important than other fields. Let’s consider a book search application in the code example. In it, we want to prioritize author_name most because it will be the most unique, followed by title because it is often copied or part of a work of analysis of the primary book, and quantity available because users may have the option to reserve a copy of the book in the next shipment.

### Code Example

``` javascript
let request_term = Hunter S Thompson;

{
  "$search": {
    "compound": {
      "must": [{
          "text": {
            "query": request_term,
            "path": "author_name",

            "score": {
              "boost": {
                "value": 9
              }

            }
          }
        },

        {
          "text": {
            "query": request_term,
            "path": "title",

            "score": {
              "boost": {
                "value": 5
              }

            }
          }
        }
      ]
    }
  }
}
```

### Author(s)

[Marcus Eagan](https://github.com/marcussorealheis)

### References

Docs: [https://docs.atlas.mongodb.com/reference/atlas-search/text/](https://docs.atlas.mongodb.com/reference/atlas-search/text/)
