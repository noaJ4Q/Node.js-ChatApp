export class homeController {
  static showPage(req, res) {
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