"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
const CloudWatchTransport = require("winston-aws-cloudwatch");
const config_1 = require("../config");
const logger = new winston.Logger({
    level: config_1.default.log.level,
    transports: [
        new winston.transports.Console({
            timestamp: true,
            colorize: true,
        }),
    ],
});
const cloudWatchConfig = {
    logGroupName: "provisioning-api",
    logStreamName: config_1.default.environment,
    createLogGroup: false,
    createLogStream: true,
    awsConfig: config_1.default.log.awsConfig,
    formatLog(item) {
        return `${item.level}: ${item.message} ${JSON.stringify(item.meta)}`;
    },
};
if (config_1.default.environment !== "development" && config_1.default.environment !== "test")
    logger.add(CloudWatchTransport, cloudWatchConfig);
logger.stream = {
    write(message) {
        logger.info(message);
    },
};
exports.default = logger;
//# sourceMappingURL=logger.js.map