export default interface JobInterface {
  process(data: object): Promise<boolean>;
};
