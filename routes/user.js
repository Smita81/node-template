import express from 'express';
import verifyToken from '../middleware/verifyToken.js';
import userControllers from '../controllers/userControllers.js';

const router = express.Router();

router.post('/register', userControllers.register);
router.post('/login', userControllers.login);
router.post('/logout', verifyToken, userControllers.logout);

export default router;
