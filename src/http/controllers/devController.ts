import { Request, Response } from "express";
import QueueService from "../../services/QueueService";

export default {
  async dev(req: Request, res: Response) {
    const result = await QueueService.receiveMessages();
    return res.send(result);
  },
};
