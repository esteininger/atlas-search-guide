import sys; sys.path.insert(0,'..')

import requests
from requests.auth import HTTPDigestAuth
from settings import *
import json

clusterName = 'FINRA-adReg-PoV'

url = f"https://cloud.mongodb.com/api/atlas/v1.0/groups/{groupID}/clusters/{clusterName}/fts/indexes?pretty=true"
headers = {'Content-Type': 'application/json'}
data = {
    "collectionName": "index_mapping",
    "database": "test",
    "name": "index_keyword_map_test",
    "mappings": {
        "dynamic": False,
        "fields": {
            "subject": {
                "analyzer": "wordMappingAnalyzer",
                "type": "string"
            }
        }
    },
    "analyzers": [{
        "charFilters": [{
            "mappings": {
                "Motorcycle": "Bike",
                "Peaceful": "Calm",
                "Seagull": "Gull",
                "Things": "Stuff"
            },
            "type": "mapping"
        }],
        "name": "wordMappingAnalyzer",
        "tokenFilters": [],
        "tokenizer": {
            "type": "standard"
        }
    }]
}

r = requests.post(url, headers=headers, data=json.dumps(data), auth=HTTPDigestAuth(publicKey, privateKey))
print(r.text)
