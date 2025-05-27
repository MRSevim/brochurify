import { Worker } from "bullmq";
import { connection } from "./redis";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { getScreenSnapshot } from "../serverActions/helpers";
import { uploadToS3 } from "../s3/helpers";
import { makeSnapshotUrl } from "../db/projectHelpers";
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
      const { html, id, userId } = job.data;

      const buffer = await getScreenSnapshot(html);
      const snapshot = await uploadToS3({
        buffer,
        key: makeSnapshotUrl(id),
        contentType: "image/jpeg",
      });

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
    } catch (error: any) {
      console.error(`${error.message}`);
    }
  },
  { connection }
);
snapshotWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed: ${err.message}`);
});
