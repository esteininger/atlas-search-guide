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
