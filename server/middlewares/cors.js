const corsMiddleware = (req, res, next) => {
  // res.header("Access-Control-Allow-Origin", "http://localhost:3000/");
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Access-Control-Allow-Credentials, Cross-Origin-Opener-Policy"
  );
  res.header("Access-Control-Allow-Credentials", "true");
  // res.header("Cross-Origin-Opener-Policy", "allow");
  res.header("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, PUT");
  next();
};

export default corsMiddleware;
