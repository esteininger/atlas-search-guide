# Common Search "Gotchyas"

Be mindful of the below elements as you review the seach content and articulate the value of search to your customers.

## Flatten

- Every token has it's own place in memory, it's called a term index.
- **Not designed for nested data structures, better for flat data**
    - Still NoSQL, but reccomend a schema. Better off if you unwind. Nested arrays are common but cause failures.
    - [https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html)
- Nested vs Blockjoin operators in Lucene (introduce volatility, increases complexity, memory intensive, different lookups happening)
- **Solution**: Change stream → $merge → flatten → Lucene index
