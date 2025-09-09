import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";

export const verifyJWT = async (req, res, next) => {
  try {
    let token = null;

    // ✅ Try from cookies
    if (req.cookies?.accessToken) {
      token = req.cookies.accessToken;
      console.log("🍪 Token from cookies:", token);
    } else {
      // ✅ Try from headers
      const authHeader = req.header("Authorization");
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.replace("Bearer ", "");
        console.log("📌 Token from header:", token);
      }
    }

    // ❌ No token found
    if (!token) {
      console.log("❌ No token found in cookies or headers");
      return next(new ApiError(401, "Unauthorized request"));
    }

    // ✅ Verify token
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("✅ Decoded token:", decodedToken);

    // ✅ Get user from DB
    const user = await User.findById(decodedToken?._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      console.log("❌ User not found for token");
      return next(new ApiError(401, "Invalid Access Token"));
    }

    // ✅ Attach user to request
    req.user = user;
    console.log("✅ User attached:", user.email);

    next();
  } catch (error) {
    console.log("❌ Error in verifyJWT:", error.message);
    next(new ApiError(401, "Invalid or expired token"));
  }
};
