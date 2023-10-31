"use strict";

const User = require('../models/User');


let Auth = async (req, res, next) => {

    // 인증처리 미들웨어
    // 1. 클라이언트에서 토큰을 가져오기
    let token = req.cookies.x_auth;
    console.log(token)

    if(token){
        console.log('AUTH의 token > ' + token)
        // 2. 토큰을 복호화하여 user를 찾기
        const user = new User(req.body);
        const tokenData = await user.findToken(token);

        console.log(tokenData)

        if(!tokenData) {
            req.loginSuccess = false;
            req.data = {
                success : false,
                msg : '로그인에 실패했습니다.',
            }
        }
        req.loginSuccess = true;
        req.data = tokenData;
        next();
        return
    }
    next();

    // 3. 유저가 있으면 인증 완료

    // 4. 유저가 없으면 인증x
}


module.exports = { Auth };