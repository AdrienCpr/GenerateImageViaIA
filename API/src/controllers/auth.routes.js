const express = require('express');
const router = express.Router();
const userRepository = require('../models/repostories/user-repository');
// const { User } = require('../models/user.model.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const { body, validationResult } = require('express-validator');


router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Email must be a valid'),
        body('password').isLength({ min: 6 }).withMessage('Password must be 6 chars minimum'),
    ],
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const foundUser = await userRepository.getUserByEmail(req.body.email);

            if (!foundUser) {
                return res.status(400).send({ errors: [{ code: "error", msg: "This email does not belong to any account" }] });
            }

            const isPasswordValid = bcrypt.compareSync(req.body.password, foundUser.password);

            if (isPasswordValid) {
                const token = jwt.sign({ id_user: foundUser.id_user }, process.env.SECRET_KEY, {
                    expiresIn: process.env.JWT_EXPIRES_IN,
                });
                return res.status(200).send({ token });
            } else {
                return res.status(400).send({ errors: [{ code: "error", msg: "Email and password do not match" }] });
            }
        } catch (e) {
            return res.status(500).send("Internal server error");
        }
    }
);

router.get('/refresh/:id_user', async (req, res) => {
    try{
        const id_user = req.params.id_user

        const token = jwt.sign({id_user: id_user},
                                        process.env.SECRET_KEY ,
                                { expiresIn: process.env.JWT_EXPIRES_IN }
                        );

        res.status(200).send({token})
    } catch (e) {
        return res.sendStatus(500)
    }
});

exports.initializeRoutes = () => router;