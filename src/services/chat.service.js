import { chatManager } from "../DAL/DAOs/mongoDAOs/chatManagerMongo.js";

class ChatService {
  async findAllMessages() {
    const response = await chatManager.getAllMessages();
    return response;
  }

  async addMessage(objMessage) {
    const response = await chatManager.addMessage(objMessage);
    return response;
  }

  async deleteMessage(id) {
    const response = await chatManager.deleteMessage(id);
    return response;
  }
}

export const chatService = new ChatService();
