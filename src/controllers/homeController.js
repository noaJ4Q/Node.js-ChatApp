import { store } from '../../index.js';
import { GROUPS } from '../../index.js';

export const USERS = [];

export class homeController {

  static showPage(req, res) {
    res.status(200).render('userHome.ejs', {
      user: req.session.user
    });
  }

  static showChat(req, res) {
    const { sessionID } = req.params;
    const user = JSON.parse(store.sessions[sessionID]).user;
    user.sessionID = sessionID;
    res.status(200).render('userChat.ejs', {
      title: `${user.name} ${user.lastName}`,
      receiverID: user.sessionID
    });
  }

  static showGroups(req, res) {
    res.status(200).render('groupHome.ejs');
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