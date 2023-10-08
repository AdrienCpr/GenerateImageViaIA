const {DataTypes} = require('sequelize')
const { sequelize } = require('../config.db')

exports.Image = sequelize.define('Image', {
    id_image: {
        type: DataTypes.UUID,
        primaryKey : true,
        allowNull: false
    },
    prompt: {
        type: DataTypes.STRING(),
        allowNull: false,
        unique: true
    },
    jpg: {
        type: DataTypes.BLOB,
        allowNull: false,
    },
}, {
    tableName: 'Image',
})
