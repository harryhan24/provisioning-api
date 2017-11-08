import "jest";
import config from "../../config";

import QueueService from "../QueueService";
import logger from "../../utils/logger";
import { SQS } from "aws-sdk";
import JobFactory from "../../jobs/JobFactory";

jest.mock("../../jobs/JobFactory");

jest.mock("aws-sdk", () => ({
  SQS: jest.fn(({ endpoint, region }) => {
    return {
      endpoint,
      region,
      sendMessage: jest.fn(),
      receiveMessage: jest.fn(),
      deleteMessage: jest.fn(),
    };
  }),
}));

describe("The QueueService -> constructor", () => {
  test("should set up an sqs client and set the queueUrl", () => {
    expect(QueueService.sqs.endpoint).toEqual(config.aws.sqs.endpoint);
    expect(QueueService.queueUrl).toEqual(config.aws.sqs.queueUrl);
  });
});

describe("The QueueService -> sendMessage function", () => {
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

describe("The QueueService -> receiveMessages function", () => {
  test("should handle SQS errors", done => {
    QueueService.sqs.receiveMessage.mockImplementationOnce(({ MaxNumberOfMessages, QueueUrl, VisibilityTimeout }, cb) => {
      expect(MaxNumberOfMessages).toBe(5);
      expect(QueueUrl).toBe(config.aws.sqs.queueUrl);
      expect(VisibilityTimeout).toBe(60);
      cb({ message: "some_error" }, null);
    });

    QueueService.receiveMessages().catch(result => {
      expect(logger.error).toHaveBeenCalledWith("[QueueService] Could not receive messages from the queue: some_error", {
        error: { message: "some_error" },
      });
      expect(result).toBe(false);
      done();
    });
  });

  test("should pass on messages to the actionMessage function", done => {
    QueueService.sqs.receiveMessage.mockImplementationOnce(({ MaxNumberOfMessages, QueueUrl, VisibilityTimeout }, cb) => {
      cb(null, {
        Messages: [{ id: 1 }, { id: 2 }],
      });
    });
    const n = QueueService.actionMessage;
    QueueService.actionMessage = jest.fn();

    QueueService.receiveMessages().then(result => {
      expect(result).toBe(true);
      expect(QueueService.actionMessage).toHaveBeenCalledTimes(2);
      QueueService.actionMessage = n;
      done();
    });
  });

  test("should handle instances where the Messages key is not there", done => {
    QueueService.sqs.receiveMessage.mockImplementationOnce(({ MaxNumberOfMessages, QueueUrl, VisibilityTimeout }, cb) => {
      cb(null, {});
    });
    const n = QueueService.actionMessage;
    QueueService.actionMessage = jest.fn();

    QueueService.receiveMessages().then(result => {
      expect(result).toBe(true);
      expect(QueueService.actionMessage).not.toHaveBeenCalled();
      QueueService.actionMessage = n;
      done();
    });
  });
});

describe("The QueueService -> actionMessage function", () => {
  test("should parse json and handle an error from the job factory", done => {
    const error = new Error("some_error");
    JobFactory.getJobInstance.mockImplementationOnce(() => {
      throw error;
    });

    const message = {};

    const dm = QueueService.deleteMessage;
    QueueService.actionMessage(message).then(response => {
      expect(response).toBe(false);
      expect(logger.error).toHaveBeenCalledWith(`[QueueService] Could not action message: no ReceiptHandle`, {
        message,
      });
      done();
    });
  });

  test("should get the Job instance and call process on it - and process a failure", done => {
    const job = { process: jest.fn() };
    JobFactory.getJobInstance.mockReturnValueOnce(job);
    job.process.mockReturnValueOnce(false);

    const dm = QueueService.deleteMessage;
    QueueService.deleteMessage = jest.fn();
    QueueService.actionMessage({ ReceiptHandle: "a", Body: JSON.stringify({ type: "a", data: "b" }) }).then(res => {
      expect(job.process).toHaveBeenCalledWith("a", "b");
      expect(QueueService.deleteMessage).not.toHaveBeenCalled();
      QueueService.deleteMessage = dm;
      expect(res).toBe(true);
      done();
    });
  });

  test("should get the Job instance and call process on it - and process a success", done => {
    const job = { process: jest.fn() };
    JobFactory.getJobInstance.mockReturnValueOnce(job);
    job.process.mockReturnValueOnce(true);

    QueueService.actionMessage({ ReceiptHandle: "abc", Body: JSON.stringify({ type: "a", data: "b" }) }).then(res => {
      expect(job.process).toHaveBeenCalledWith("abc", "b");
      expect(res).toBe(true);
      done();
    });
  });

  test("should handle an exception from the JobFactory", done => {
    const error = new Error("some_error");
    JobFactory.getJobInstance.mockImplementationOnce(() => {
      throw error;
    });

    const message = { ReceiptHandle: "abc", Body: JSON.stringify({ type: "a", data: "b" }) };
    QueueService.actionMessage(message).then(res => {
      expect(logger.error).toHaveBeenCalledWith(`[QueueService] Could not action message... deleting message from queue`, {
        error,
        message,
      });
      expect(res).toBe(false);
      done();
    });
  });
});

describe("The QueueService -> deleteMessage function", () => {
  test("should handle an SQS error when deleting a message", done => {
    const receiptHandle = "abc";
    const error = new Error("some_error");
    QueueService.sqs.deleteMessage.mockImplementationOnce(({ QueueUrl, ReceiptHandle }, cb) => {
      expect(QueueUrl).toBe(config.aws.sqs.queueUrl);
      expect(ReceiptHandle).toBe(receiptHandle);
      cb(error, null);
    });

    QueueService.deleteMessage(receiptHandle).then(res => {
      expect(res).toBe(false);
      expect(logger.error).toBeCalledWith(`[QueueService] Could not delete message from queue`, {
        error: error.message,
        receiptHandle,
      });
      done();
    });
  });

  test("should handle a success", () => {
    const receiptHandle = "abc";
    const error = new Error("some_error");
    QueueService.sqs.deleteMessage.mockImplementationOnce(({ QueueUrl, ReceiptHandle }, cb) => {
      cb(null, "all good!");
    });

    expect(QueueService.deleteMessage(receiptHandle)).resolves.toBe(true);
  });
});
