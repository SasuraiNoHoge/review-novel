'use strict';
const express = require('express');
const router = express.Router();
const Novel = require('../models/novel');

/* GET home page. */
router.get('/', (req, res, next) => {
  const title = 'ReviewNovels';
  if (req.user) {
    Novel.findAll({
      where: {
        createdBy: req.user.id
      },
      order: [['"updatedAt"', 'DESC']]
    }).then((novels) => {
      res.render('index', {
        title: title,
        user: req.user,
        novels: novels
      });
    });
  } else {
    res.render('index', { title: title, user: req.user });
  }
});

module.exports = router;