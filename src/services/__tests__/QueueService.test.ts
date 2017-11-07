import "jest";
import config from "../../config";

import QueueService from "../QueueService";
import logger from "../../utils/logger";
import { SQS } from "aws-sdk";

jest.mock("aws-sdk", () => ({
  SQS: jest.fn(({ endpoint, region }) => {
    return {
      endpoint,
      region,
      sendMessage: jest.fn(),
    };
  }),
}));

describe("The QueueService -> constructor", () => {
  test("should set up an sqs client and set the queueUrl", () => {
    expect(QueueService.sqs.endpoint).toEqual(config.aws.sqs.endpoint);
    expect(QueueService.queueUrl).toEqual(config.aws.sqs.queueUrl);
  });
});

describe("The QueueService -> sendMessage", () => {
  test("should call the SQS sendMessage with properly formatted parameters", done => {
    QueueService.sqs.sendMessage.mockImplementationOnce(({ MessageBody, QueueUrl }, callback) => {
      expect(QueueUrl).toEqual(config.aws.sqs.queueUrl);
      expect(MessageBody).toEqual('{"type":"some_type","data":{"username":"a"}}');
      callback(null, {});
    });
    QueueService.sendMessage("some_type", { username: "a" }).then(response => {
      expect(response).toBe(true);
      done();
    });
  });

  test("should call the SQS sendMessage and handle errors", done => {
    QueueService.sqs.sendMessage.mockImplementationOnce(({ MessageBody, QueueUrl }, callback) => {
      expect(QueueUrl).toEqual(config.aws.sqs.queueUrl);
      expect(MessageBody).toEqual('{"type":"some_type","data":{"username":"a"}}');
      callback("some_error", {});
    });
    QueueService.sendMessage("some_type", { username: "a" })
      .then(response => {
        expect(1).toBe(2); // WRONG
        done();
      })
      .catch(e => {
        expect(e.message).toEqual("Could not send queue message");
        expect(logger.error).toHaveBeenCalled();
        done();
      });
  });
});
