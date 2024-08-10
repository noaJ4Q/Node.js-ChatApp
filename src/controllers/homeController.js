import { store } from '../../index.js';

export class homeController {

  static showPage(req, res) {
    res.status(200).render('home.ejs');
  }

  static showChat(req, res) {
    const { sessionID } = req.params;
    const user = JSON.parse(store.sessions[sessionID]).user;
    res.status(200).render('chat.ejs', { user: user });
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