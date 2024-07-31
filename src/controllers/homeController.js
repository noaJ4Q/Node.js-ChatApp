import { io } from "../../index.js";

export class homeController {

  static showPage(req, res) {
    res.status(200).render('home.ejs');
  }

  static showChat(req, res) {
    const { id } = req.params;
    console.log(req.session);
    res.status(200).render('chat.ejs');
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