#!/usr/bin/env bash

# this file was used to import all clinical trial data from clinicaltrials.gov into a local MongoDB instance

set -e
set -x

CONN_STR=${MONGODB_URI:-"mongodb://127.0.0.1:27017/clintrials"}
COLL=${MONGODB_IMPORT_COLL:-"clinical_studies"}

# ADD CURL to get public dataset
curl -o /tmp/AllPublicXML.zip https://clinicaltrials.gov/AllPublicXML.zip
unzip /tmp/AllPublicXML.zip -d /tmp/AllPublicXML

# IMPORT to mongodb
mongo --eval 'db.dropDatabase();' clintrials
# rm /tmp/alltrials || true
NUM_RECORDS=$(find /tmp/AllPublicXML -type f -name "*.xml" -exec xml-to-json --multiline {} + | tee  -a /tmp/alltrials | wc -l)
echo "[$NUM_RECORDS] processed... importing data into MongoDB"
cat /tmp/alltrials | jq .clinical_study | mongoimport --uri $CONN_STR -c $COLL


echo "PATH=\$PATH:/usr/local/bin" >> ~/.bashrc
