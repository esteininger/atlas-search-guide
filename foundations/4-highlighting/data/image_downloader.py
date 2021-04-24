
# for each, grab image
# store image in S3
#

import logging
import boto3

mongo_uri = ""


def upload_file(file_name, bucket, object_name=None):
    """Upload a file to an S3 bucket

    :param file_name: File to upload
    :param bucket: Bucket to upload to
    :param object_name: S3 object name. If not specified then file_name is used
    :return: True if file was uploaded, else False
    """

    # If S3 object_name was not specified, use file_name
    if object_name is None:
        object_name = file_name

    # Upload the file
    s3_client = boto3.client('s3')
    try:
        response = s3_client.upload_file(file_name, bucket, object_name)
    except ClientError as e:
        logging.error(e)
        return False
    return True


# def lookup_image():



if __name__ == '__main__':
    # connection obj
    conn = pymongo.MongoClient(mongo_uri, ssl_cert_reqs=ssl.CERT_NONE)
    # go through entire list of docs
    for movie in conn['sample_mflix']['movies']:

        title = movie['title']
        year = movie['year']

        # TODO: grab image from external source
        # TODO: upload external source image to S3
        # TODO: store S3 image url in this document
