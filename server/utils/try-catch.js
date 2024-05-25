// const TryCatch = (fn) => (req, res, next) =>
//   Promise.resolve(fn(req, res, next)).catch(next);

const TryCatch = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    next(err);
  }
};

export default TryCatch;
