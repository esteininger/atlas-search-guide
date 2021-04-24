# Common Search "Gotchyas"

Be mindful of the below elements as you learn search and implement its' features.

## Flatten

- Every token has it's own place in memory, this is called a term index.
- **Lucene is not designed for nested data structures, it is better for flat data**
    - Nested arrays are common but cause failures, better off if you use $unwind.
    - [https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html](https://www.elastic.co/guide/en/elasticsearch/reference/current/nested.html)
- Nested and Blockjoin operators in Lucene introduce volatility, increase complexity, and are memory intensive because under the hood, it's different lookups happening.
- **The Solution**: Change Stream listener → flatten it via $unwind → $merge into a "lucene collection" → build a Lucene index → $search !
