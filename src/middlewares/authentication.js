export const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
}

export const isAuthenticatedLogin = (req, res, next) => {
  if (req.session.user) {
    req.session.user.connected = true;
    return res.redirect('/home');
  }
  next();
}