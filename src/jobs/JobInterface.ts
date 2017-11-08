export default interface JobInterface {
  process(receiptHandle: string, data: any): Promise<boolean>;
};
