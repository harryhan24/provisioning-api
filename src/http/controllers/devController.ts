// Dev only controller used purely for playing around whilst this software is not in production
import { Request, Response } from "express";
import { SNS } from "aws-sdk";

export default {
  dev: (req: Request, res: Response) => {
    const sns = new SNS({
      endpoint: "http://localhost:4005",
      region: "us-east-1",
    });

    sns.publish(
      {
        Message: "What in the world?",
        MessageStructure: "json",
        TopicArn: "arn:aws:sns:us-east-1:123456789012:testQueue",
      },
      e => {
        res.send("done");
        console.log("DONE!", e);
      },
    );
  },
};
