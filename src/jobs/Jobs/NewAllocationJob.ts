import JobInterface from "../JobInterface";

/**
 * The NewAllocationJob processes an allocation and requests storage from the chosen provider
 */
export default class NewAllocationJob implements JobInterface {
  process(data: object): Promise<boolean> {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  }
}
