# Faceting

Faceting is set to release very soon in Atlas Search. Until then, we have a stopgap solution which involves using other MongoDB operators.

### Code Examples

Here we are dynamically grouping documents by the date_inserted field, across 5 groups. We are also creating a brand new field, called categorizedByDateInserted.

```javascript
[
    {
        '$facet': {
            'categorizedByDateInserted': [
                {
                    '$bucketAuto': {
                        'groupBy': '$date_inserted',
                        'buckets': 5,
                        'output': {
                            'count': {
                                '$sum': 1
                            },
                            'docs': {
                                '$push': '$$ROOT'
                            }
                        }
                    }
                }
            ]
        }
    }
]
```

Let's say however we'd like to specify the range, we can do that with $bucket via:

```javascript
[
        {
            '$facet': {
                'categorizedByEmployeeCount': [
                    {
                        '$bucket': {
                            'groupBy': '$company.employee_count',
                            'boundaries': [
                                0, 100, 1000, 10000, 100000
                            ],
                            'output': {
                                'count': {
                                    '$sum': 1
                                },
                                'docs': {
                                    '$push': "$$ROOT"
                                }
                            }
                        }
                    }
                ]
            }
        }
    ]
```

### Author(s)

[Ethan Steininger](https://github.com/esteininger)

### References

- [$bucket](https://docs.mongodb.com/manual/reference/operator/aggregation/bucket/)
- [$bucketAuto](https://docs.mongodb.com/manual/reference/operator/aggregation/bucketAuto/)
