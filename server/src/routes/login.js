import { mongodb } from '../models/mongodb.js'


export const login = async (req, res) => {
    try {
        const data = req.body;

        if (!data) {
            return res.status(400).json({ code: 400, msg: 'Invalid request: Missing data' });
        }

        const dbName = await mongodb();
        const collection = dbName.collection('users');

        const user = await collection.findOne({ email: data.userid, password: data.password });

        if (user) {
            return res.send({ code: 200, msg: 'User login successful', user: user, redirect: '/home' });
        } else {
            return res.send({ code: 404, msg: 'User not found' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        return res.send({ code: 500, msg: 'Internal server error' });
    }
};