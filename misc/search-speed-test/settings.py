import ssl
import pymongo

url="mongodb+srv://ethan:1RrQIU5UZrp5Gci2@finra-adreg-pov.v7a3k.mongodb.net"
db = pymongo.MongoClient(url, ssl_cert_reqs=ssl.CERT_NONE)
