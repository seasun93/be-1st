"use strict";

const express = require('express');
const router = express.Router();
const ctrl = require('./boards.ctrl');

router.get('/board/list/:page', ctrl.process.getPost);
router.get('/board/view/:id', ctrl.process.viewPost);

router.post('/board/post', ctrl.process.postPost);

router.delete('/board/delete/:id', ctrl.process.deletePost);

module.exports = router;