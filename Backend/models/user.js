const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

User.associate = (models) => {
  User.hasOne(models.UserProfile, {
    foreignKey: 'userId',
    as: 'userProfile'
  });
  
  User.belongsToMany(models.Book, {
    through: models.Favorite,
    foreignKey: 'userId',
    as: 'favoriteBooks'
  });
};

module.exports = User;