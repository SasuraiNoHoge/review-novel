
'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Novel = loader.database.define('novels', {
  novelId: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    allowNull: false
  },
  novelTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  novelText: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  createdBy: {
    type: Sequelize.STRING,
    allowNull: false
  },
  updatedAt: {
    type: Sequelize.DATE,
    allowNull: false
  }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ['createdBy']
      }
    ]
  });

module.exports = Novel;