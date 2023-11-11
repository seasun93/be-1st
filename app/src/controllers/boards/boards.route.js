"use strict";

const express = require('express');
const router = express.Router();
const ctrl = require('./boards.ctrl');

router.get('/board/list/:page', ctrl.process.getPost);

router.post('/board/post', ctrl.process.postPost);

module.exports = router;