import { store } from '../../index.js';
import { GROUPS } from '../../index.js';

export class homeController {

  static showPage(req, res) {
    res.status(200).render('home.ejs');
  }

  static showChat(req, res) {
    const { sessionID } = req.params;
    const user = JSON.parse(store.sessions[sessionID]).user;
    user.sessionID = sessionID;
    res.status(200).render('chat.ejs', {
      title: `${user.name} ${user.lastName}`,
      receiverID: user.sessionID
    });
  }

  static showGroups(req, res) {
    res.status(200).render('groups.ejs');
  }

  static showGroupChat(req, res) {
    const { groupID } = req.params;
    const group = GROUPS.find(g => g.id === groupID);
    res.status(200).render('groupChat.ejs', { title: group.name, receiverID: group.id });
  }

  static logout(req, res) {
    req.session.destroy(err => {
      if (err) {
        console.error(err);
        return res.redirect('/home');
      }
      res.clearCookie('connect.sid');
      res.redirect('/');
    })
  }
}