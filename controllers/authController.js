const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res) => {
    const {name, password} = req.body;
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
        const newUser = await User.create({
            name,
            password: hashedPassword,
        });
        res.status(201).json({
            status: 'success',
            data: {
                user: newUser,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
}
