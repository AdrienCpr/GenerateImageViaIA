const {DataTypes} = require('sequelize')
const { sequelize } = require('../config.db')

exports.User_image = sequelize.define('User_image', {
    id_user_image:{
        type: DataTypes.UUID,
        primaryKey : true,
        allowNull: false
    },
}, {
    tableName: 'User_image',
})
