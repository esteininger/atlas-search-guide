# MongoDB Change Streams and Realm 
This section will describe how to extend the application so that it can contribue to an event-driven architecture using MongoDB change streams and Realm Serverless functions and triggers. It will establish a basic configuration for capturing new documents to the `sample_mflix.movies` collection and send them to an AWS Kinesis Data Stream, which will then be available as a source for delivery to various endpoints, such as S3. 

## Realm Setup
1. Login to MongoDB Atlas and click on "Realm" at the top.
2. Create a new Realm application and link it to the cluster with the `sample_mflix.movies` collection.
3. Inside the Realm application, go to **3rd Party Services** in the left hand navigation. Click "Add a Service" and select "AWS". Give it the name of "kinesis" and provide your AWS Access Key ID and Secret Access Key for an account that is allowed to put documents in AWS Kinesis Data Streams. 
4. Inside the Realm configuration for the "kinesis service", add a new rule called "everything" and under Actions, choose "kinesis" for API and the asterisk for action to include all actions. Then click Save.
5. On the left hand side, click **Functions**. Create a new function called "putMovieInKinesis" and leave the authentication as "Application Authentication". 
6. Click on the Function Editor tab and copy and paste the following code, before hitting Save:

```
exports = function(event){
  const awsService = context.services.get('kinesis');
  const movieDoc = JSON.stringify(event.fullDocument)
  console.log(typeof movieDoc)
  try{
    awsService.kinesis("us-east-2").PutRecord({
      Data: movieDoc, 
      StreamName: "KinesisMovieDataStream",
      PartitionKey:'foo'
    }).then(function(response) {
      return response;
    });
    
    console.log("Successfully put the following document into Kinesis: " + event.fullDocument.title);
  }catch(error){
    console.log(error);
  }
};
```
6. After saving the Function, click on **Triggers** on the left hand side. Select "Add a Trigger" and select a Database trigger with name "KinesisMovieTrigger". Under Trigger Source Details, select the cluster with your movies collection in it, then select `sample_mflix` and `movies` as the database and collection names, respectively. Under Operation Type, check only the "Insert" option and make sure "Full Document" is enabled. At the very bottom under Event Type, select Function and choose the "putMovieInKinesis" function you just created, then hit Save.

## AWS Setup
1. Log into the AWS console and go to the Kinesis Dashboard. 
2. Click on **"Create Data Stream"** and create a data stream with the name "KinesisMovieDataStream" and just 1 open shard, then click "Create Data Stream" at the bottom. 
3. Return to the Kinesis Dashboard, but this time select **"Create delivery stream"**. Give the Delivery Stream the name of "KinesisMovieDeliveryStream". Under the option of Source, select "Kinesis Data Stream" and pick the data stream you just created in Step 3 - "KinesisMovieDataStream". Click the Next button.
4. On the Process records screen, click the Next button again.
5. On the Choose Destination screen, select "Amazon S3" and provide the name of a bucket you own (or create a new one). For S3 prefix, enter `movies`. For S3 error prefix, enter `errors`, then click Next. 
6. On the Configure settings page, change the buffer interval to 60 seconds. At the bottom of a page, copy the IAM role value it creates then click Next. 
7. On the Review settings page, confirm that the settings are accurate and create the Deliver Stream.
8. Go to the AWS IAM dashboard and look up the role you just copied from the Delivery Stream creation process in Step 6. Attach the `AmazonS3FullAccess` policy to the role. 

## Validation

Insert a new document into the `sample_mflix.movies` collection using Compass, Atlas, or the mongo shell. Check the logs in the Realm application to ensure that the trigger fired correctly and without errors, with the log messages showing the full document. Wait a minute, then navigate to the S3 bucket and validate that the document was delivered correctly, partitioned into a movies subfolder and then additional subfolders by date and time. 
