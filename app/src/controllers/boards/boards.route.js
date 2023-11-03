"use strict";

const express = require('express');
const router = express.Router();
const ctrl = require('./boards.ctrl');

router.get('/post', ctrl.process.post);

module.exports = router;