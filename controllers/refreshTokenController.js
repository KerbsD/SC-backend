const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.status(401).json({ "message" : "Missing refresh token."});
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            const fullname = decoded.fullname;
            const number = foundUser.number;
            const email = foundUser.email;
            const id = foundUser.id;
            const address = foundUser.address;
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles,
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            );
            res.json({ accessToken, roles, fullname, id, number, email, address });
        }
    );
}

module.exports = { handleRefreshToken }