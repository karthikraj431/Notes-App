import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const middleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Just attach the user ID, not the whole user
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

export default middleware;




// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const middleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader)
//       return res.status(401).json({ success: false, message: "Unauthorized" });

//     const token = authHeader.split(' ')[1];
//     if (!token)
//       return res.status(401).json({ success: false, message: "Token missing" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const user = await User.findById(decoded.id);
//     if (!user)
//       return res.status(403).json({ success: false, message: "User not found" });

//     req.user = { id: user._id, name: user.name, email: user.email };
//     next();
//   } catch (error) {
//     console.log(error.message);
//     return res.status(401).json({
//       success: false,
//       message: "Invalid or expired token, please login again",
//     });
//   }
// };

// export default middleware;


// import jwt from 'jsonwebtoken';
// import User from '../models/User.js';

// const middleware = async (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;
//     if (!authHeader) return res.status(401).json({ success: false, message: "Unauthorized" });

//     const token = authHeader.split(' ')[1];
//     const decoded = jwt.verify(token, "secretkey");

//     const user = await User.findById(decoded.id);
//     if (!user) return res.status(403).json({ success: false, message: "User not found" });

//     req.user = { id: user._id, name: user.name, email: user.email };
//     next();
//   } catch (error) {
//     console.log(error.message);
//     return res.status(401).json({ success: false, message: "Invalid or expired token, please login again" });
//   }
// };

// export default middleware;
