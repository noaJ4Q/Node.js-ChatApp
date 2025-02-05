export class PrivateMessage {
  constructor(id, senderId, receiverId, content, date) {
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.date = date;
  }
}