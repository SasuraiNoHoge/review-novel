'use strict';
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Question = loader.database.define('questions', {
  questionId: {
    type: Sequelize.BIGINT,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  },
  questionName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  novelId: {
    type: Sequelize.BIGINT,
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
      },
      {
        fields: ['updatedAt']
      }
    ]
  });

module.exports = Question;