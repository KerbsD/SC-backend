const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body;
    if (!email || !pwd) return res.status(400).json({ 'message': 'Email and password are required.' });

    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.status(401).json({"message":"Email not found."}); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);
    if (match) {
        const id = foundUser._id;
        const roles = Object.values(foundUser.roles).filter(Boolean);
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "fullname": foundUser.fullname,
                    "roles": roles,
                }
            },  
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15s' }
        );
        const refreshToken = jwt.sign(
            { "fullname": foundUser.fullname },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        console.log(roles);

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
        // secure: true, sameSite: 'None',
        // Send authorization roles and access token to user
        res.json({  roles, accessToken, id });

    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin };