import { store } from '../../index.js';

export class homeController {

  static showPage(req, res) {
    console.log(`Home controller: ${JSON.stringify(store)}`);
    res.status(200).render('home.ejs');
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