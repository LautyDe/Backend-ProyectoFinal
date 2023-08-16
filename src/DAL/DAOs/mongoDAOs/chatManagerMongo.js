import { chatModel } from "../../mongoDb/models/chat.model.js";

class ChatManager {
  async getAllMessages() {
    const allMessages = await chatModel.find();
    return allMessages;
  }

  async addMessage(objMessage) {
    const message = await chatModel.create(objMessage);
    return message;
  }

  async deleteMessage(id) {
    const message = await chatModel.deleteOne({ _id: id });
    return message;
  }
}

export const chatManager = new ChatManager();
