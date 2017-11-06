// Dev only controller used purely for playing around whilst this software is not in production
import { Request, Response } from "express";
import { SQS } from "aws-sdk";

export default {
  dev: (req: Request, res: Response) => {
    const sqs = new SQS({
      endpoint: "http://localhost:4006",
      region: "ap-southeast-2",
    });

    const message = {
      MessageBody: JSON.stringify({ username: "bla" }),
      QueueUrl: "http://localhost:4006/default",
      DelaySeconds: 0,
    };
    // sqs.sendMessage(message, (err, data) => {
    //   res.json({ err, data });
    // });
    sqs.receiveMessage({ QueueUrl: message.QueueUrl, VisibilityTimeout: 600, MaxNumberOfMessages: 1 }, (error, data) => {
      console.log("Received message: ", error, data);
      res.json({
        error,
        data,
      });
    });
    // sqs.createQueue({ QueueName: "MyFirstQueue" }, (err, data) => {
    //   console.log(err, data);
    // });
    // const sns = new SNS({
    //   endpoint: "http://localhost:4005",
    //   region: "us-east-1",
    // });
    // sns.publish(
    //   {
    //     Message: "What in the world?",
    //     MessageStructure: "json",
    //     TopicArn: "arn:aws:sns:us-east-1:123456789012:testQueue",
    //   },
    //   e => {
    //     res.send("done");
    //     console.log("DONE!", e);
    //   },
    // );
  },
};
