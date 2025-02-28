const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserProfile = sequelize.define('UserProfile', {
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
});

UserProfile.associate = (models) => {
  UserProfile.belongsTo(models.User, {
    foreignKey: 'userId',
    as: 'user'
  });
};

module.exports = UserProfile;