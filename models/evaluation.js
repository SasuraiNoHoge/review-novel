'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Evaluation = loader.database.define('evaluations', {
  commentId: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    allowNull: false
  },
  userId: {
    type: Sequelize.STRING,
    allowNull: false
  },
  evaluation: {
    type: Sequelize.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  novelId: {
    type: Sequelize.BIGINT,
    allowNull: false
  }
}, {
    freezeTableName: true,
    timestamps: false,
    indexes: [
      {
        fields: ['novelId']
      }
    ]
  });

module.exports = Evaluation;