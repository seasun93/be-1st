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
        console.log(data)
        if(!data.success) return {data : data};
        const token = await UserStorage.getToken(data)
        return {data : data, accessToken : token.aToken};
    }
    
    // 로그아웃
    async logout(){
        const body = this.body;
        const deleteToken = await UserStorage.DeleteToken(body);

        if(!deleteToken.success){
            return {success : false, msg : '로그아웃 실패'}
        }
        return {success : true, msg : '로그아웃 완료'};
    }

    // 회원가입
    async register(){
        const body = this.body;
        try{
            const data = await UserStorage.Add(body);
            return data
        } catch(err) {
            return {success : false, msg : err}
        }
    }

    // 아이디 중복체크
    async idCheck(){
        const body = this.body;
        const data = await UserStorage.Checker(body);
        return data;
    }

    async findToken(token){
        const user = await UserStorage.FindUser(token)
        const reToken = await UserStorage.FindToken(user, token);
        const data = {
            user : user,
            token : reToken.aToken,
        }
        return data

    }
    
    // 마이페이지
    async Edit(){
        const body = this.body;
        // 1. 유저정보 수정하기
        const update = await UserStorage.Edit(body);

        if(!update.success) {
            return {success : false, msg : '유저 업데이트 실패'}
        }
        // 2. 수정된 경우 token 삭제
        const deleteToken = await UserStorage.DeleteToken(body);

        if(!deleteToken.success) {
            return {success : false, msg : '유저 업데이트 완료, token 삭제 실패'}
        }
        return {success : true, msg : '수정완료'}


    }
}

module.exports = User;