const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Model/User');

const loginController = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user._id,role: 'user' }, process.env.JWT_KEY, { expiresIn: '1h' });
    res.status(200).json({ token, userId: user._id, role: 'user' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Login failed' });
  }
};

const signupController = async (req, res) => {
  console.log("Received signup data:", req.body);

  let { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: "user",
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully", userId: newUser._id, role: "user" });
  } catch (error) {
    console.error("Error signing up:", error);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};


const profileController =async(req,res)=>{
  const {userId} =req.params;
  const{name ,shopName,phone ,AadharNo ,shopLocation}=req.body;
  if(!name ||!shopName||!phone ||!AadharNo ||!shopLocation){
    return res.status(400).json({message:'All fields are required'});
  }
  try {
    const user =await User.findById(userId);
    if(!user){
      return res.status(400).json({message:'User not found'});
    }
    user.name=name
    user.shopName=shopName
    user.phone=phone
    user.AadharNo=AadharNo
    user.shopLocation=shopLocation

    await user.save();
    res.status(200).json({ message: 'Profile completed successfully' });
  } catch (error) {
    console.error('Error completing profile:', error);
    res.status(500).json({message:'Internal server error'});
  }
}

module.exports = { loginController, signupController,profileController };