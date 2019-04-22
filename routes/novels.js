'use strict';
const express = require('express');
const router = express.Router();
const authenticationEnsurer = require('./authentication-ensurer');
const Novel = require('../models/novel');
const Question = require('../models/question');
const User = require('../models/user');
const Evaluation = require('../models/evaluation');

router.get('/new', authenticationEnsurer, (req, res, next) => {
  res.render('new', { user: req.user });
});

router.post('/', authenticationEnsurer, (req, res, next) => {
  process.env.HEROKU_URL ? process.env.HEROKU_URL + 'auth/twitter/callback' : 'http://localhost:8000/auth/twitter/callback'

  var novelId = 0;
  const updatedAt = new Date();
  

    Novel.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['"updatedAt"', 'DESC']]
    }).then((nove) => {
      Novel.create({
        novelId: nove.length > 0 ? nove.length + 1 : 1,
        novelTitle: req.body.novelTitle.slice(0, 255) || '（名称未設定）',
        novelText: req.body.novelText,
        createdBy: req.user.id,
        updatedAt: updatedAt
      }).then((novel) => {
        const questionNames = req.body.questions.trim().split('\n').map((s) => s.trim()).filter((s) => s !== "");
        const questions = questionNames.map((q) => { return {
            questionName: q,
            novelId: novel.novelId,
            createdBy: novel.createdBy,
            updatedAt: novel.updatedAt
          };});
          Question.bulkCreate(questions).then(() => {
              res.redirect('/novels/' + novel.novelId);
          });
        }); 
    });
  
  console.log(novelId);
  //console.log(Novel.novelId ? Novel.novelId : 1); // TODO 予定と候補を保存する実装をする
  //undefined
  console.log(req.body.novelTitle.slice(0, 255) || '（名称未設定）');
  console.log(req.body.novelText);
  console.log(req.user.id);
  console.log(updatedAt);
  //console.log(questionNames);


  console.log("hello"); // TODO 予定と候補を保存する実装をする
});

router.get('/:novelId', authenticationEnsurer, (req, res, next) => {
  Novel.findOne({
    include: [
      {
        model: User,
        attributes: ['userId', 'username']
      }],
    where: {
      novelId: req.params.novelId
    },
    order: [['"updatedAt"', 'DESC']]
  }).then((novel) => {
    if (novel) {
      Question.findAll({
        where: { novelId: novel.novelId },
        order: [['"questionId"', 'ASC']]
      }).then((questions) => {
        Evaluation.findAll({
          include: [
            {
              model: User,
              attributes: ['userId', 'username']
            }
          ],
          where: { novelId: novel.novelId },
          order: [[User, 'username', 'ASC'], ['"novelId"', 'ASC']]
        })
      });
    } else {
      const err = new Error('指定されたページは見つかりません');
      err.status = 404;
      next(err);
    }
  });
});

module.exports = router;