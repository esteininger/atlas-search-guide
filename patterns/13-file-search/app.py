from flask import Flask, jsonify, request
from config import *
from bson import json_util
import pymongo

conn = pymongo.MongoClient(mongo_uri, ssl_cert_reqs=ssl.CERT_NONE)
app = Flask(__name__)

@app.route('/search', methods=['GET'])
def search_file():
    # value from the api
    query = request.args.get('q', default=None, type=str)

    # query payload
    pipeline = [
        {
            '$search': {
                'index': 'default',
                'text': {
                    'query': query,
                    'path': "parsed_pdf_content"
                }
            }
        }
    ]
    # response
    docs = list(conn[db_name][collection_name].aggregate(agg_pipeline))
    json_result = json_util.dumps({'docs': docs}, json_options=json_util.RELAXED_JSON_OPTIONS)
    return jsonify(json_result)


if __name__ == '__main__':
    app.run(host="localhost", port=5011, debug=True)
