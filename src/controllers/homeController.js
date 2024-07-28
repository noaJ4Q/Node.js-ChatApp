export class homeController {
  static page(req, res) {
    res.render('home.ejs');
  }

  static logout(req, res) {
    console.log('logout');
    res.redirect('/');
  }
}