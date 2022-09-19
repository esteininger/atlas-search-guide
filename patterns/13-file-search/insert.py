import boto3
from tika import parser
import pymongo
from config import *
import sys
import requests
from requests.auth import HTTPDigestAuth
import json


# mongodb connection object
conn = pymongo.MongoClient(mongo_uri, ssl_cert_reqs=ssl.CERT_NONE)

s3_file_name="file.pdf"
bucket_name="demo"


def download_file():
    """Download the file
    :param str s3_file_name: name of s3 file
    :param str bucket_name: bucket name of where the s3 file is stored
    """

    # s3 boto3 client instantiation
    s3_client = boto3.client(
        's3',
        aws_access_key_id=aws_access_key_id,
        aws_secret_access_key=aws_secret_access_key,
        region_name=region_name
    )

    # open in memory
    with open(s3_file_name, 'wb') as file:
        s3_client.download_fileobj(
            bucket_name,
            s3_file_name,
            file
        )
        print("file downloaded")
        # parse the file
        parsed_pdf_content = parser.from_file(s3_file_name)['content']
        print("file contents extracted")
        # insert parsed pdf content into elasticsearch
        insert_into_search_engine(s3_file_name, parsed_pdf_content)
        print("file contents inserted into search engine")


def insert_into_search_engine(s3_file_name, parsed_pdf_content):
    """Download the file
    :param str s3_file_name: name of s3 file
    :param str parsed_pdf_content: extracted contents of PDF file
    """
    doc = {
        "filename": s3_file_name,
        "parsed_pdf_content": parsed_pdf_content
    }
    # insert
    resp = conn[db_name][collection_name].insert_one(doc)
    print('\nAdding document:')
    print(resp)


def create_index():
    """Create the index by calling the http API
    """
    url = f"https://cloud.mongodb.com/api/atlas/v1.0/groups/{group_id}/clusters/{cluster_name}/fts/indexes?pretty=true"
    headers = {'Content-Type': 'application/json'}
    data = {
        "collectionName": collection_name,
        "database": db_name,
        "name": index_name,
        "mappings": {
            "dynamic": True
            }
    }

    r = requests.post(url, headers=headers, data=json.dumps(data), auth=HTTPDigestAuth(pub_key, priv_key))
    print(r.text)


if __name__ == '__main__':
    globals()[sys.argv[1]]()
