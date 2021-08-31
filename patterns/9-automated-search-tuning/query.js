[
    {
        '$sort': {
            'timestamp': 1
        }
    }, {
        '$group': {
            '_id': '$user_id',
            'events': {
                '$push': {
                    'event_id': '$event_id',
                    'search_value': '$metadata.search_value'
                }
            },
            'isSearchQueryPresent': {
                '$sum': {
                    '$cond': [
                        {
                            '$eq': [
                                '$event_id', 'search_query'
                            ]
                        }, 1, 0
                    ]
                }
            }
        }
    }, {
        '$match': {
            'isSearchQueryPresent': {
                '$gte': 1
            }
        }
    }, {
        '$unset': 'isSearchQueryPresent'
    }, {
        '$set': {
            'searchQuery': {
                '$arrayElemAt': [
                    '$events.search_value', 0
                ]
            }
        }
    }, {
        '$sort': {
            'events': -1
        }
    }
]
