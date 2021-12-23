import pymongo
import logging
from pymongo import monitoring


# Atlas connection string
mongo_uri = 'mongodb+srv://ethan:1RrQIU5UZrp5Gci2@dev.v7a3k.mongodb.net/test?retryWrites=true&w=majority'

# connection obj
connection = pymongo.MongoClient(mongo_uri)

# DBs and collections
db = 'sample_mflix'
collection = 'movies'
query_history_collection = 'query_history'

# query that we'll be using
search_query = [
    {
        '$search': {
            'text': {
                'query': "Fight Club",
                'path': 'title'
            }
        }
    }
]
#
# # run the aggregate query AND log it to the history collection
# def aggregate_and_log(query):
#     # log query
#     connection[db][query_history_collection].aggregate(query)
#     # run query
#     return connection[db][collection].aggregate(query)
#
#
# def listen_to_queries():
#     pipeline = [
#         {'$match': {'operationType': 'insert'}}
#     ]
#     history_collection = connection[db][query_history_collection]
#     for document in history_collection.watch(pipeline=pipeline, full_document='updateLookup'):
#         document['fullDocument']['email']

class QueryLogger(monitoring.CommandListener):

    def log(self, event):
        print("an event was logged", event)

monitoring.register(QueryLogger())

def main():
    r = connection[db]["test"].insert_one({"title":"Fight Club"})
    print("query:", list(r))


if __name__ == '__main__':
    main()
