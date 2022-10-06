# Index Intersection

Index intersection provides the ability to execute a performant query that spans multiple indexes in your data store. This means you can write ad-hoc, dynamically generated queries, where you don't need to know the query, fields or ordering of fields in advance.

It is very rare however that MongoDB’s query planner selects a plan that involves index intersection. We’ll walk through a scenario in which this becomes a requirement.

[Blog Post on the subject](https://www.mongodb.com/developer/products/atlas/flexible-querying-with-atlas-search/)
