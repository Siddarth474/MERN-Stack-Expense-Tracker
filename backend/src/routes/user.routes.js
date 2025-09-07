import { Router } from "express";
import { 
    changeCurrentPassword,
    getcurrentUser,
    loginUser,
    logoutUser,
    registerUser,
    updateAccountDetails, 
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { 
    loginValidation, 
    registerValidation 
} from "../middlewares/authValidation.middleware.js";

const router = Router();

router.route('/register').post(registerValidation,registerUser);
router.route('/login').post(loginValidation,loginUser);
router.route('/logout').get(verifyJWT, logoutUser);
router.route('/change-password').post(verifyJWT, changeCurrentPassword);
router.route('/').get(verifyJWT, getcurrentUser);
router.route('/update').get(verifyJWT, updateAccountDetails);

export default router