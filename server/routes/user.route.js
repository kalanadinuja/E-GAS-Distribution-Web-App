import express from 'express';
import { deleteUser, test, updateUser, getUsers, deleteAllUsers, adminUpdateUser,forgotPassword,resetPassword } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';




const router = express.Router();

router.get('/test', test);
router.put('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)
router.delete('/deleteall/:id',  deleteAllUsers)
router.get('/read', getUsers )
// admin can update any user (no verifyToken needed unless you want to protect with admin token)
router.put('/admin/update/:id', adminUpdateUser);


//  Forgot + Reset password routes
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);


export default router;