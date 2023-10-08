const express = require('express');
const router = express.Router();
const {body, validationResult} = require('express-validator');

const imageRepository = require('../models/repostories/image-repository');
const userImageRepository = require('../models/repostories/user-image-repository');
router.post('/',
    async (req, res) => {
        try {

            console.log(req.body.jpg, req.body.prompt)
            let image = await imageRepository.createImage(req.body.jpg, req.body.prompt)

            await userImageRepository.createImageUser(req.body.id_user, image.id_image)


            res.status(201).end()
        } catch (e) {

            res.status(500).send(e.errors);
        }
    });

exports.initializeRoutes = () => router;