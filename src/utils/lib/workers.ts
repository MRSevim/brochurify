import { Worker } from "bullmq";
import { connection } from "./redis";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getScreenSnapshot } from "../serverActions/helpers";
import { uploadToS3 } from "../s3/helpers";
import docClient from "../db/db";
import { Queue } from "bullmq";

export const snapshotQueue = new Queue("snapshot-queue", {
  connection,
});
const TABLE_NAME = process.env.DB_TABLE_NAME;

const snapshotWorker = new Worker(
  "snapshot-queue",
  async (job) => {
    try {
      const { isTemplate, html, id, userId } = job.data;
      console.log("Received job:", job.id);
      const buffer = await getScreenSnapshot(html);
      console.log("Snapshot buffer generated.");

      const snapshot = await uploadToS3({
        buffer,
        key: isTemplate
          ? `templateSnapshots/${id}.jpeg`
          : `${userId}/snapshots/${id}.jpeg`,
        contentType: "image/jpeg",
      });
      console.log("Snapshot uploaded to S3:", snapshot);

      await docClient.send(
        new UpdateCommand({
          TableName: TABLE_NAME!,
          Key: {
            userId,
            id,
          },
          UpdateExpression: "SET #snapshot = :snapshot",
          ExpressionAttributeNames: {
            "#snapshot": "snapshot",
          },
          ExpressionAttributeValues: {
            ":snapshot": snapshot,
          },
        })
      );
      console.log("Snapshot URL saved to DynamoDB.");
    } catch (error: any) {
      console.error(`${error.message}`);
    }
  },
  { connection }
);
snapshotWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});
