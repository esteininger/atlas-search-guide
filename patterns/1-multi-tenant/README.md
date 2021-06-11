# Multi-Tenant Search // Shard Targeting

Today, many customers use Atlas to host multi-tenant applications. It follows that customers want to build search applications that limit what an end user can search for based on their tenancy. The simple way to accomplish this functionality in Atlas Search is to implement a compound query with a filter clause that is the tenant ID.

### Code Example

```javascript
{
  "$search": {
    "compound": {
      "filter": [{
        "text": {
          "query": "BCBS-33219",
          "path": "orgID",
        }
      }],
      "should": [{
        "text": {
          "query": "Goldman",
          "path": "lastname",
          "score": {
            "boost": {
              "value": 5
            }

          }
        }
      }],
    }
  }
}
```

### Author(s)

[Marcus Eagan](https://github.com/marcussorealheis)

### References

Docs: [https://docs.atlas.mongodb.com/reference/atlas-search/compound/#filter-example](https://docs.atlas.mongodb.com/reference/atlas-search/compound/#filter-example)

External: [https://medium.com/@hemalr87/mongodb-atlas-search-d7cd2d71a1b8](https://medium.com/@hemalr87/mongodb-atlas-search-d7cd2d71a1b8)
