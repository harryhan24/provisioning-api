import "./database/init";
import QueueService from "./services/QueueService";

export const handler = () => {
  QueueService.receiveMessages();
};
