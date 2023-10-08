const express = require('express');
const router = express.Router();
const userRepository = require('../models/repostories/user-repository');
const { User } = require("../models/models/user.model");
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const {logger} = require("sequelize/lib/utils/logger");
const guard = require('express-jwt-permissions')({
  requestProperty: 'auth',
});

router.post('/seeder', async (req, res) => {
  try {
    const user = await userRepository.createUser({
      pseudo: 'adrien',
      email: 'adriencompare@gmail.com',
      password: 'password',
    });

    res.status(200).send(user)
  } catch (e) {
    console.log(e);
    res.status(500).send(e.message);
  }
});


router.get('/', async (req, res) => {
  res.send(await userRepository.getUsers());
});

router.post('/',
  body('pseudo').isAlphanumeric()
                      .isLength({ min: 3 })
                      .withMessage('Pseudo must be 3 chars minimum')
                      .custom(async (value, { req }) => {
                          const user = await userRepository.getUserByPseudo(value);
                          if (user) {
                              return Promise.reject('Pseudo already taken')
                          }
                          return true;
                      }),
  body('email').isEmail()
                     .withMessage('Email must be a valid')
                     .custom(async (value, { req }) => {
                          const user = await userRepository.getIdUserByEmail(value);
                          if (user) {
                              return Promise.reject('Email already taken')
                          }
                          return true;
                      }),
  body('password').isLength({ min: 6 })
                        .withMessage('Password must be 3 chars minimum'),

async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).send({ errors: errors.errors });
    }

    let user = req.body
    let token = await userRepository.createUser(user);


    res.status(201).send({ token: `bearer ${token}` })
  } catch (e) {

    res.status(500).send(e.errors);
  }
});

router.put('/:id_user',
    body('pseudo').isAlphanumeric()
        .isLength({ min: 3 })
        .custom(async (value, { req }) => {
            const user = await userRepository.getUserByPseudo(value);
            if (user) {
                return Promise.reject('Pseudo already taken')
            }
            return true;
        }),
    body('email').isEmail()
        .custom(async (value, { req }) => {
            const user = await userRepository.getIdUserByEmail(value);
            if (user) {
                return Promise.reject('Email already taken')
            }
            return true;
        })
    , async (req, res) => {
      try {
        let body = req.body

        let user_update = await userRepository.updateUser(req.params.id_user,body);

        return res.status(200).send(user_update);
      } catch (e) {
        res.status(500).send(e.message);
      }
});

router.delete('/:id_user', async (req, res) => {
  try {
    await userRepository.deleteUser(req.params.id);
    res.status(204).end();
  } catch (e) {
    res.status(500).send(e.message);
  }
});


router.get('/:id_user', async (req, res) => {
  const foundUser = await userRepository.getUserById(req.params.id_user);

  if (!foundUser) {
    res.status(500).send('User not found');
    return;
  }

  res.status(200).send(foundUser);
});

// router.get('/check/password/:id/:password', async (req, res) => {
//   const foundUser = await userRepository.getUserById(req.params.id);
//
//   if (!foundUser) {
//     res.status(500).send('User not found');
//     return;
//   }
//
//   await bcrypt.compare(req.params.password, foundUser.password, (err, data) => {
//     //if error than throw error
//     if (err) throw err
//
//     //if both match than you can do anything
//     if (data) {
//       return res.status(200).end()
//     } else {
//       return res.status(401).end()
//     }
//   })
// });

exports.initializeRoutes = () => router;