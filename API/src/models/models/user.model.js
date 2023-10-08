const {DataTypes} = require('sequelize')
const { sequelize } = require('../config.db')

exports.User = sequelize.define('User', {
    // Model attributes are defined here
    id_user: {
        type: DataTypes.UUID,
        primaryKey : true,
        allowNull: false
    },
    pseudo: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'User',
})
