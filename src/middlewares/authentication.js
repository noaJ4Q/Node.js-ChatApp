export const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
}

export const isAuthenticatedLogin = (req, res, next) => {
  if (req.session.user) {
    return res.redirect('/home');
  }
  next();
}