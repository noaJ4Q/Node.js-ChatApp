export class loginController {
  static page(req, res) {
    res.render('login.ejs');
  }

  static login(req, res) {
    console.log(req.body);
    const { name, lastName, rememberMe } = req.body;

    req.session.user = { name, lastName };
    if (rememberMe) {
      req.session.cookie.maxAge = 60 * 60 * 24 * 1000; // 24 hours      
    }
    else {
      req.session.cookie.expires = false; // When the browser closes
    }

    res.redirect('/home');
  }
}