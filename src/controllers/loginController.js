import { User } from "../models/User.js";
import { v4 as uuid } from 'uuid';

export class loginController {
  static showPage(req, res) {
    res.status(200).render('login.ejs');
  }

  static login(req, res) {
    const { name, lastName, rememberMe } = req.body;
    req.session.user = 1;

    if (rememberMe) {
      req.session.cookie.maxAge = 60 * 60 * 24 * 1000; // 24 hours      
    } else {
      req.session.cookie.expires = false; // When the browser closes
    }

    res.redirect('/home');
  }
}