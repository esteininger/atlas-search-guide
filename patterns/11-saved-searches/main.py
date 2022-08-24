import pymongo
import logging

class CommandLogger(pymongo.monitoring.CommandListener):

    def started(self, event):
        print(event)


# Atlas connection string
mongo_uri = 'mongodb+srv://username:password@hostname/test?retryWrites=true&w=majority'

# connection obj
connection = pymongo.MongoClient(mongo_uri, event_listeners=[CommandLogger()])

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



def main():
    r = connection[db][collection].find_one({"title":"Fight Club"})
    print("query:", r)


if __name__ == '__main__':
    main()
