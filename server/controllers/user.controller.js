import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';


export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          phonenumber: req.body.phonenumber,
          address: req.body.address,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json({ success: true, ...rest });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

//-----------------------------------------------
export const deleteAllUsers = async (req, res) => {
  try {
      
      const deleteUsers = await User.findByIdAndDelete(req.params.id)
      
      if(!deleteUsers) {
          return res.status(404).json({success:false, message:'User not found!'})
      }
      res.status(200).json({success:true, message:'User Deleted Successfully!', deleteUsers})
  } catch (error) {
      console.log(error);
      return res.status(500).json({success:false, message:'Internal server error'})
  }
}

export const getUsers = async(req, res) => {
  try {
      const user = await User.find()
      if(!user) {
          return res.status(404).json({success:false, message:'user not found!'})
      }
      res.status(200).json({success:true, user})
  } catch (error) {
      console.log(error);
      return res.status(500).json({success:false, message:'Internal Server Error'})
  }
}




// 🔹 Admin: update any user (no self-check)
export const adminUpdateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, phonenumber, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: { username, email, phonenumber, address },
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    res.status(200).json({ success: true, message: 'User updated successfully!', user: updatedUser });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// 👉 Step 1: Forgot Password (send email)
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    // Generate reset token (valid 15 mins)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

    // Create reset link
    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

    // Send email (configure properly in real app)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      text: `Click here to reset your password: ${resetLink}`,
    });

    res.status(200).json({ success: true, message: 'Password reset link sent to email!' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};


// 👉 Step 2: Reset Password
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Hash new password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Update user password
    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.status(200).json({ success: true, message: 'Password reset successfully!' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: 'Invalid or expired token!' });
  }
};



