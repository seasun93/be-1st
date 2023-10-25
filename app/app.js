"use strict";

const express = require('express');
const app = express();
const bodyParser = require('body-parser');

// 파싱설정
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true})); // url을 통해 전달되는 데이터에 한글,공백과 같은 문자가 포함된 경우 인식하지 못하는 문제를 해결하기 위해 설정


module.exports = app;
