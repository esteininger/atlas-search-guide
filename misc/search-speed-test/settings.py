import ssl
import pymongo

url=""
db = pymongo.MongoClient(url, ssl_cert_reqs=ssl.CERT_NONE)
