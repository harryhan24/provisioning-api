import { SQS } from "aws-sdk";
import config from "../config";
import logger from "../utils/logger";

export const TYPE_ALLOCATION_CREATED = "allocation_created";

class Queue {
  sqs: SQS;
  queueUrl: string;

  constructor(endpoint: string, region: string, queueUrl: string) {
    this.sqs = new SQS({ endpoint, region });
    this.queueUrl = queueUrl;
  }

  sendMessage(type: string, data: {}): Promise<boolean> {
    const self = this;

    return new Promise((resolve, reject) => {
      this.sqs.sendMessage({ MessageBody: JSON.stringify({ type, data }), QueueUrl: self.queueUrl }, (error, data) => {
        if (error) {
          logger.error(`Failed sending queue message: ${error.message}`, { error, message: data });
          reject(new Error("Could not send queue message"));
        }

        resolve(true);
      });
    });
  }
}

export default new Queue(config.aws.sqs.endpoint, config.aws.region, config.aws.sqs.queueUrl);
