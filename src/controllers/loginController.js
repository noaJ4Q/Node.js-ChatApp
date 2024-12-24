import { User } from "../models/User.js";
import { store } from "../../index.js";
import { v4 as uuid } from 'uuid';

export class loginController {
  static showPage(req, res) {
    res.status(200).render('login.ejs');
  }

  static login(req, res) {

    let validUser = true;
    let msg;
    let userInSession;
    // get name and last name
    const { name, lastName, rememberMe } = req.body;
    store.all((err, sessions) => {
      if (err) console.error(err);
      for (const sessionId in sessions) {
        const session = sessions[sessionId];
        if (session.user.name === name && session.user.lastName === lastName) {
          if (session.user.connected) {
            validUser = false;
            msg = "User is already connected";
          }
          else {
            // log with that session
            validUser = true;
            userInSession = session.user;
            console.log("User already exists but is not connected");
          }
        }
      }
      // userInSession = new User(uuid(), name, lastName, "", false);
      if (!validUser) {
        console.log("User already exists but is connected");
        return res.redirect("/");
      }

      if (!userInSession) {
        console.log("User does not exist");
        userInSession = new User(uuid(), name, lastName, "", false);
      }

      req.session.user = userInSession;

      if (rememberMe) {
        req.session.cookie.maxAge = 60 * 60 * 24 * 1000; // 24 hours      
      } else {
        req.session.cookie.expires = false; // When the browser closes
      }

      res.redirect('/home');
    })
  }
}
