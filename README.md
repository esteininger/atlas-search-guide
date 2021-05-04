# Atlas Full Text Search Assets & Patterns

The purpose of this repository is to teach the foundations of __Atlas Full Text Search__ (which uses Lucene on the backend) in order to then use our knowledge to build search patterns.

Each category in the _Foundations_ section, below has a corresponding topic which is comprised of a Jupyter noteboook and a series of steps within to encourage learn by doing.

Be sure to also review the [common search mistakes](context/mistakes) as you continue the foundations.

## Search Foundations (Review First)

| #  | Label                              | Description                                                                                                                                                                                                                                                                 
|----|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1  | [Engine](foundations/1-engine)            | Review the basic components of a full-text search engine (including tokenization), and build one.
| 2  | [Basic](foundations/2-basic)            | Run a simple text search.
| 3  | [Fuzzy](foundations/2-basic)            | Handle common typos
| 4  | [Highlighting](foundations/2-basic)            | Add a relevance score and hit highlights to the results
| 5  | [Autocomplete](foundations/5-autocomplete)            | Search as you type
| 6  | Phrase           | Ordered sequence of words
| 7  | Diacritics           | Include multiple languages
| 8  | Compound            | Combine two or more operators into a single query (or clause)
| 9  | Explain            | See how the mongot (lucene) returns results to clients.


## Search Patterns & Use Cases

| #  | Label                              | Description                                                                                                                                                                                                                                                                 
|----|------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1  | Multi Tenant           | Ability to build search applications that limit what an end user can search for based on their tenancy.                                       
| 2  | Weighted Fields           | Implement relevance weights where some fields more important than  other fields.   
| 3  | Advanced Scoring          |  Ensure the boosted variable doesn’t overwhelm the relevance of our search results.  
| 4  | Sorting           |  Using the Atlas Search near operator to sort documents based on a numeric, date, or geo field.
| 5  | Custom Analyzer         | Implement a synonym-based search functionality by leveraging the Custom Analyzers with the mapping character filter.
