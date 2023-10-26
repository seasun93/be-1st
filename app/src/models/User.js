"use strict";

const UserStorage = require('./UserStorage');

// 재사용이가능한 User 객체 생성
class User {
    constructor(body){
        this.body = body;
    }

    // 로그인
    async login(){
        const body = this.body;
        const data = await UserStorage.Match(body);
        
        if(!data.success) return data;

        return {success : true, msg : '로그인 성공'};
    }
    // 회원가입
    // 로그아웃
    // 마이페이지
}

module.exports = User;