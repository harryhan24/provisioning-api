import winston from "winston";
import CloudWatchTransport from "winston-aws-cloudwatch";

import config from "../config";

const logger = new winston.Logger({
  level: config.log.level,
  transports: [
    new winston.transports.Console({
      timestamp: true,
      colorize: true,
    }),
  ],
});

const cloudWatchConfig = {
  logGroupName: "provisioning-api",
  logStreamName: config.environment,
  createLogGroup: false,
  createLogStream: true,
  awsConfig: config.log.awsConfig,
  formatLog(item) {
    return `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`;
  },
};

if (config.environment !== "development" && config.environment !== "test")
  logger.add(CloudWatchTransport, cloudWatchConfig);

logger.stream = {
  write(message) {
    logger.info(message);
  },
};

module.exports = logger;
