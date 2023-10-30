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
        if(!data.success) return {data : data};
        const token = await UserStorage.getToken(data)
        return {data : data, accessToken : token.aToken};
    }

    async register(){
        const body = this.body;
        try{
            const data = await UserStorage.Add(body);
            return data
        } catch(err) {
            return {success : false, msg : err}
        }

    }

    async findToken(token){
        const data = await UserStorage.FindToken(token);
        return data

    }
    // 회원가입
    // 로그아웃
    // 마이페이지
}

module.exports = User;