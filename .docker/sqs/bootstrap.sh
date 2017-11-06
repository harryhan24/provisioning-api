#!/bin/bash

aws sqs create-queue --queue-name default --endpoint-url $SQS_ENDPOINT_URL