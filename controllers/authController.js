const User = require('../models/userModel');
const bcrypt = require('bcryptjs');

exports.signUp = async (req, res) => {
    const {name, password} = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            name,
            password: hashedPassword,
        });
        req.session.user = newUser;
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

exports.login = async (req, res) => {
    const {name, password} = req.body;
    try {
        const user = await User.findOne({name});
        
        if (!user) {
            return res.status(404).json({
                status: 'fail',
                message: 'User not found',
            });
        }

        const correct = await bcrypt.compare(password, user.password);

        if(correct) {
            req.session.user = user;
            res.status(200).json({
                status: 'success',
                message: 'User logged in',
            });
        } else {
            res.status(400).json({
                status: 'fail',
                message: 'Incorrect credentials',
            });
        }
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
        });
    }
}
