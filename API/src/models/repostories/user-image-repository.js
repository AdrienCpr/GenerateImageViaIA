const uuid = require('uuid');
const {Image} = require("../models/image.model");
const {User_image} = require("../models/user_image.model");

exports.createImageUser = async (id_user, id_image) => {
    try {
        await User_image.create({
            id_user_image: uuid.v4(),
            id_user: id_user,
            id_image: id_image
        });
    } catch (e) {
        console.log(e)
    }
};