import {Router} from 'express';
import {loginUser, logoutUser, registerUser,refreshAccessToken,changeCurrentPassword, getCurrentUser,updateAccountDetails,updateCoverImage,updateUserAvatar} from '../controllers/user.Controller.js';
import upload from '../middelwares/multer.middelware.js';
import verifyJWT from '../middelwares/auth.middelware.js';
const router=Router();

router.route('/register').post(upload.fields([{name:'avatar',maxCount:1},{name:'coverImage',maxCount:1}]),registerUser);

router.route('/login').post(loginUser);


//secure Route
router.route('/refreshToken').post(refreshAccessToken);
router.route('/logout').post(verifyJWT,logoutUser);
router.route('/change-password').post(verifyJWT,changeCurrentPassword)
router.route('/getCurrentUser').get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT, updateUserAvatar)
router.route("/update-coverImage").patch(verifyJWT, updateCoverImage)

export default router;
