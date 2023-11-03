"use strict";

const express = require('express');
const router = express.Router();
const ctrl = require('./users.ctrl');
const { Auth } = require('../../middleware/Auth');

router.get('/login', ctrl.output.login);
router.get('/register', ctrl.output.register);
router.get('/auth', Auth , ctrl.process.auth);

router.post('/login', ctrl.process.login);
router.post('/register', ctrl.process.register);
router.post('/idCheck', ctrl.process.idCheck);
router.post('/logout', ctrl.process.logout);
router.post('/edit', ctrl.process.edit)
module.exports = router;