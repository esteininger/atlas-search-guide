# you can even apply multiple compounds with other search
# operators like autocomplete:
db.collection.aggregate([{'$search': {
    "compound": {
        "must": [{
            "autocomplete": {
                "query": 'Ethan',
                "path": 'firstName'
            }
        }],
        "must": [{
            "autocomplete": {
                "query": 'St',
                "path": 'lastName'
            }
        }]
    }
}
}])

# compound, with autocomplete & score boosting:
db.collection.aggregate([
    {
        '$search': {
            'compound': {
                'should': [
                    {
                        'autocomplete': {
                            'query': 'fight',
                            'path': 'plot',
                            'tokenOrder': 'sequential',
                            'score': {
                                'boost': {
                                    'value': 9
                                }
                            }
                        }
                    }, {
                        'autocomplete': {
                            'query': 'fight',
                            'path': 'fullplot',
                            'tokenOrder': 'sequential',
                            'score': {
                                'boost': {
                                    'value': 5
                                }
                            }
                        }
                    }
                ]
            }
        }
    }
])
