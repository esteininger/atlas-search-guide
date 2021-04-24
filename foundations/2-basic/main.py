import pymongo
from config import mongo_uri

conn = pymongo.MongoClient(mongo_uri, ssl_cert_reqs=ssl.CERT_NONE)
# collection
collection = conn['sample_mflix']['movies']

def search_titles(query):
    path = "title"
    agg_pipeline = [
        {
            '$search': {
                'term': {
                    'query': query,
                    'path': path,
                }
            }
        }
    ]
    docs = list(collection.aggregate(agg_pipeline))
    return docs


if __name__ == '__main__':
    results = search_titles("fight club")
    print(results)
