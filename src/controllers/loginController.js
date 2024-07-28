export class loginController {
  static page(req, res) {
    res.render('login.ejs');
  }

  static login(req, res) {
    console.log(req.body);
    let { name, lastName, rememberMe } = req.body;
    rememberMe = rememberMe ? true : false;
    console.log(rememberMe);
    res.redirect('/home');
  }
}