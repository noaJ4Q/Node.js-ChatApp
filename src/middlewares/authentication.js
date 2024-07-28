export const isAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    if (req.originalUrl === '/') {
      return next();
    }
    return res.redirect('/');
  }
  if (req.originalUrl === '/') {
    return res.redirect('/home');
  }
  next();
}