export class GroupMessage {
  constructor(id, senderId, groupReceiverID, content, date) {
    this.id = id;
    this.senderId = senderId;
    this.groupReceiverID = groupReceiverID;
    this.content = content;
    this.date = date;
  }
}