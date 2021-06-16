<p align="center">
<img src="https://webimages.mongodb.com/_com_assets/cms/integrated?auto=format%2Ccompress&fit=undefined&w=1074" width="200px">
</p>

<p align="center">
<b>Full Text Search <ins>Directly</ins> in your Database</b>
</p>

<!-- start elevator-pitch -->

Build fast, relevant, full-text search capabilities on top of your data in the cloud

This Full Text Search Guide teaches the foundations and enhancements, so you can build large-scale full text search applications without managing indexes, hardware or replication.


**Foundations** - Start with building a full text search application from scratch in under 100 lines of Python code, then continue to apply additional search-native functions like autocomplete, scoring, highlighting and more.

```
Note: there is a [common search mistakes](context/mistakes) section to be mindful of as you continue the foundations.
```

**Patterns & Use Cases** - Combine your knowledge from Foundations and apply it to solve actual business problems. Examples include real world use cases such as relevance score boosting in a restaurant search engine.

**Architecture** - Full Text Search doesn't live in a bubble, the data needs to come in and often out as well. Learn how others integrate technologies such as Kafka and S3 into their Full Text Search stack to scale effortlessly.

**Miscellaneous** - Other content that didn't fit the categories above. This includes examples on using the API to create custom synonym mapping layers, testing search index consistency latency, and more.


## Search Foundations

| #  | Label                              | Description                                                                                                                                                                                                                                                                 
|----|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1  | [Engine](foundations/1-engine)            | Review the basic components of a full-text search engine (including tokenization), and build one.
| 2  | [Basic](foundations/2-basic)            | Run a simple text search.
| 3  | [Fuzzy](foundations/2-basic)            | Handle common typos
| 4  | [Highlighting](foundations/2-basic)            | Add a relevance score and hit highlights to the results
| 5  | [Autocomplete](foundations/3-autocomplete)            | Search as you type
| 6  | Phrase           | Ordered sequence of words
| 7  | Diacritics           | Include multiple languages
| 8  | [Compound](foundations/6-compound)            | Combine two or more operators into a single query (or clause)
| 9  | Explain            | Understand how the mongot (lucene) returns results in order to tune performance.


## Search Patterns & Use Cases

| #  | Label                              | Description                                                                                                                                                                                                                                                                 
|----|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1  | [Multi Tenant // Shard Targeting](patterns/1-multi-tenant)           | Ability to build search applications that limit what an end user can search for based on their tenancy.                                       
| 2  | [Weighted Fields](patterns/2-weighted-fields)           | Implement relevance weights where some fields more important than  other fields.   
| 3  | [Advanced Scoring](patterns/3-advanced-scoring)          |  Ensure the boosted variable doesn’t overwhelm the relevance of our search results.  
| 4  | [Sorting](patterns/4-sorting)           |  Using the Atlas Search near operator to sort documents based on a numeric, date, or geo field.
| 5  | [Custom Analyzer](patterns/5-custom-analyzer)         | Implement a synonym-based search functionality by leveraging the Custom Analyzers with the mapping character filter.
| 6  | [Faceting](#)         | Dynamically cluster search results into categories in order to drill down


## Example Search Architecture

| #  | Label                              | Description                                                                                                                                                                                                                                                                 
|----|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1  | [Event Streaming](architecture/1-event-streaming)           | Using Realm and Kinesis, initiate a workflow where as documents are updated, they're pushed to a Kinesis queue and then pushed to Atlas to be searched.  

## Miscellaneous

| #  | Label                              | Description                                                                                                                                                                                                                                                                 
|----|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1  | [Index Creation API](misc/atlas-apis)           | Using REST to modify Search indexes
| 2  | [Index Speed Test](misc/search-speed-test)           | How long does it take to create an index and return a search result?

## Credits

This project is made possible by the community surrounding it and especially the wonderful people and projects listed in this document.

- [Marcus Eagan](https://github.com/marcussorealheis)
- [Harshad Dhavale](https://github.com/harshadpd) - [Custom Synonyms Mapping File](https://github.com/esteininger/atlas-search-patterns/blob/master/misc/atlas-apis/index-management/createIndex.py)
- [John Misczak](https://github.com/misczak) - [Event Streaming into Search Indexes](https://github.com/esteininger/atlas-search-patterns/tree/master/architecture/1-event-streaming)
- [Roy Kiesler](https://github.com/rkiesler1)
