const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const { User } = require('../models/user.model.js');
const jwt = require("jsonwebtoken");

exports.getUsers = async () => await User.findAll();

exports.getUserByPseudo = async (pseudo) => {
  return await User.findOne({
      where: {
            pseudo : pseudo
          }
    });
};

exports.getUserByEmail = async (email) => {
  return await User.findOne({
    where: {
      email : email
    }
  });
};

exports.getUserById = async (id_user) => {
  return await User.findOne({
    where: {
      id_user : id_user
    }
  });
};

exports.getIdUserByEmail = async (email) => {
  let user = await User.findOne({
    where: {
      email : email
    }
  });

  return user?.id_user
};

exports.createUser = async (body) => {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(body.password, salt);

  const user = body;
  user.id_user = uuid.v4();
  user.password = hash;

  const new_user = await User.create(user);

  return jwt.sign({id_user: new_user.id_user},
      process.env.SECRET_KEY, {expiresIn: process.env.JWT_EXPIRES_IN});
};

exports.updateUser = async (id_user,data) => {
  let salt = bcrypt.genSaltSync(10);
  let hash = bcrypt.hashSync(data.password, salt);

  const user_info = await this.getUserById(id_user);

  let user = await User.update({
    pseudo: data.pseudo || user_info.pseudo,
    email: data.email || user_info.email,
    password: hash,
  }, {
    where: {
      id_user : id_user}
    })

  return user;
};

exports.deleteUser = async (id_user) => {
  await User.destroy({
    where: {
      id_user
    }
  });
}