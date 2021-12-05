const crypto = require('crypto');
const { connect } = require('getstream');
const bcrypt = require('bcrypt');
const StreamChat = require('stream-chat').StreamChat;
require('dotenv').config();

const api_key = 'rdwn9qbvtft4';
const api_secret = 'nhphqnrt5r9gpzm8xanebpyfzuqyn835ux5yyb72jeqzpgecfauryfpega3m2sh9';
const app_id = '1154731';

const signup = async (req, res) => {
    try {
        const { fullName, userName, password, phoneNumber } = req.body;
        // to create random user id 16 char hexadecimal
        const userId = crypto.randomBytes(16).toString('hex');
        const serverClient = connect(api_key, api_secret, app_id);

        const hashedPassword = await bcrypt.hash(password, 10);

        const token = serverClient.createUserToken(userId);

        res.status(200).json({
            token,
            fullName,
            userName,
            userId,
            hashedPassword,
            phoneNumber,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
};

const login = async (req, res) => {
    try {
        const { userName, password } = req.body;
        const serverClient = connect(api_key, api_secret, app_id);
        const client = StreamChat.getInstance(api_key, api_secret);

        const { users } = await client.queryUsers({ name: userName });

        if (!users.length)
            return res.status(400).json({ message: 'User not found!' });

        const success = await bcrypt.compare(password, users[0].hashedPassword);
        const token = serverClient.createUserToken(users[0].id);

        if (success) {
            res.status(200).json({
                token,
                fullName: users[0].fullName,
                userName,
                userId: users[0].id,
            });
        } else {
            res.status(500).json({ message: 'incorrect password' });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error });
    }
};

module.exports = { signup, login };
