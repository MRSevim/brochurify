import dynamoose from "dynamoose";

const ENV = process.env.ENV || "production";

// Create new DynamoDB instance
const ddb = new dynamoose.aws.ddb.DynamoDB({
  credentials: {
    accessKeyId: "AKID",
    secretAccessKey: "SECRET",
  },
  region: "us-east-1",
});
// Set DynamoDB instance to the Dynamoose DDB instance
dynamoose.aws.ddb.set(ddb);

if (ENV === "development") {
  // Use local DynamoDB
  dynamoose.aws.ddb.local();
} else {
  // Use AWS DynamoDB (default behavior)
}

export default dynamoose;
