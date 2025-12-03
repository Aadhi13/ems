const errorHandler = (err, req, res, next) => {
  console.error("Error caught in errorHandler: ", err);
  res.status(500).json({ error: "Internal Server Error" });
};

export default errorHandler;