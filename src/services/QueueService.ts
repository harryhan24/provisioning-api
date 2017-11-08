import { SQS } from "aws-sdk";
import config from "../config";
import logger from "../utils/logger";

import JobInterface from "../jobs/JobInterface";
import JobFactory from "../jobs/JobFactory";

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

  async receiveMessages(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.sqs.receiveMessage({ MaxNumberOfMessages: 5, QueueUrl: this.queueUrl, VisibilityTimeout: 60 }, async (error, data) => {
        if (error) {
          logger.error(`[QueueService] Could not receive messages from the queue: ${error.message}`, { error });
          return reject(false);
        }

        logger.silly(`[QueueService] Processing SQS messages`, { data });
        if (data.Messages) {
          await data.Messages.forEach(async (message: SQS.Message) => {
            return await this.actionMessage(message);
          });
        }
        resolve(true);
      });
    });
  }

  async actionMessage(message: SQS.Message): Promise<boolean> {
    const body = JSON.parse(message.Body || "{}");
    if (!message.ReceiptHandle) {
      logger.error(`[QueueService] Could not action message: no ReceiptHandle`, { message });
      return false;
    }

    try {
      const job = JobFactory.getJobInstance(body.type);
      await job.process(message.ReceiptHandle, body.data);
      return true;
    } catch (error) {
      logger.error(`[QueueService] Could not action message... deleting message from queue`, { error, message });
      this.deleteMessage(message.ReceiptHandle);
      return false;
    }
  }

  async deleteMessage(receiptHandle: string): Promise<any> {
    logger.debug(`[QueueService] Deleting queue message with receipt handle: ${receiptHandle}`);
    return new Promise((resolve, reject) => {
      this.sqs.deleteMessage({ QueueUrl: this.queueUrl, ReceiptHandle: receiptHandle }, (error, data) => {
        if (error) {
          logger.error(`[QueueService] Could not delete message from queue`, { receiptHandle, error: error.message });
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }
}

export default new Queue(config.aws.sqs.endpoint, config.aws.region, config.aws.sqs.queueUrl);
