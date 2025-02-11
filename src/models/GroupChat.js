export class GroupChat {
  constructor(id, name) {
    this.id = id;
    this.name = name;
    this.users = [];
    this.lastMessage = '';
    this.lastMessageTime = ''
  }
}