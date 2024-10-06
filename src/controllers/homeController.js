import { store } from '../../index.js';

export class homeController {

  static showPage(req, res) {
    res.status(200).render('userHome.ejs', {
      sidebar: 1,
      user: req.session.user
    });
  }

  static showChat(req, res) {
    const { socketId } = req.params;
    res.status(200).render('userChat.ejs', {
      sidebar: 1,
      receiverID: socketId
    });
  }

  static showGroups(req, res) {
    res.status(200).render('groupHome.ejs', {
      sidebar: 2
    });
  }

  static showGroupChat(req, res) {
    const { groupID } = req.params;
    const group = GROUPS.find(g => g.id === groupID);
    res.status(200).render('groupChat.ejs', {
      sidebar: 2,
      title: group.name, receiverID: group.id
    });
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