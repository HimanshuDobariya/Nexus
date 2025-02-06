import jwt from jsonwebtoken

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(400).json({
      message: "Not Authorised.",
    });
  }
  
  //decode token to take user info
  try {
    const decodeTokenInfo = jwt.verify(token, process.env.JWT_SECRET);

    if (!decodeTokenInfo)
      return res
        .status(400)
        .json({ success: false, message: "Not Authorised." });

    req.userId = decodeTokenInfo.userId;

    next();
  } catch (error) {
    return res
    .status(500)
    .json({ message: "Server error.", error: error.message });
  }
};

module.exports = verifyToken;