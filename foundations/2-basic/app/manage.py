from flask import Flask, render_template, request, jsonify
import os
import pymongo
import ssl
# relaxed JSON
from bson import json_util
from config import mongo_uri


app = Flask(__name__)

# connection obj
conn = pymongo.MongoClient(mongo_uri, ssl_cert_reqs=ssl.CERT_NONE)
# collection
collection = conn['sample_mflix']['movies']

# endpoint
@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query', default=None, type=str)
    path = request.args.get('path', default='title', type=str)

    agg_pipeline = [
        {
            '$search': {
                'index': 'default',
                'text': {
                    'query': query,
                    'path': path,
                    # fuzzy search
                    # 'fuzzy': {
                    #     'maxEdits': 2,
                    #     'prefixLength': 0
                    # }
                },
                # text highlighting
                'highlight': { "path": path }
            }
        }, {
            '$project': {
                'document': "$$ROOT",
                'highlights': {"$meta": "searchHighlights"},
                # include score
                'score': {
                    '$meta': 'searchScore'
                }
            }
        },
        {
            # skip items without a poster image url
            '$match': {"document.poster": {'$ne': None}}
        },
        {
            '$limit': 15
        },
        {
            '$sort': {'score': -1}
        }
    ]
    docs = list(collection.aggregate(agg_pipeline))
    json_result = json_util.dumps({'docs': docs}, json_options=json_util.RELAXED_JSON_OPTIONS)
    return jsonify(json_result)

# page
@app.route('/')
def index():
    return render_template("index.html")


if __name__ == '__main__':
    app.run(host="localhost", port=5010, debug=True)
