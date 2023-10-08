const uuid = require('uuid');
const {Image} = require("../models/image.model");

exports.createImage = async (fileContent, prompt) => {
    try {
        await Image.create({
            id_image: uuid.v4(),
            prompt: prompt,
            jpg: fileContent
        });
    } catch (e) {
        console.log(e)
    }
};