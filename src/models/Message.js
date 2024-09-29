export class Message {
  constructor(id, senderId, receiverId, content, date) {
    this.id = id;
    this.senderId = senderId;
    this.receiverId = receiverId;
    this.content = content;
    this.date = date;
  }
}