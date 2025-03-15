const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { user, email, number, pwd } = req.body;
    if (!user || !email || !number || !pwd) return res.status(400).json({ 'message': 'Fullname, Email, Mobile Number and Password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({
        $or: [
            { fullname: user }, // Check for duplicate fullname
            { email },    // Check for duplicate email
            { number }    // Check for duplicate number
        ]
    }).exec();
    if (duplicate) return res.sendStatus(409); 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);

        //create and store the new user
        const result = await User.create({
            "fullname": user,
            "password": hashedPwd,
            "email": email,
            "number": number
        });

        console.log(result);

        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };