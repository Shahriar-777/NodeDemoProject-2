import {Router} from 'express';
import {loginUser, logoutUser, registerUser,refreshAccessToken} from '../controllers/user.Controller.js';
import upload from '../middelwares/multer.middelware.js';
import verifyJWT from '../middelwares/auth.middelware.js';
const router=Router();

router.route('/register').post(upload.fields([{name:'avatar',maxCount:1},{name:'coverImage',maxCount:1}]),registerUser);

router.route('/login').post(loginUser);


//secure Route
router.route('/refreshToken').post(refreshAccessToken);
router.route('/logout').post(verifyJWT,logoutUser);



export default router;