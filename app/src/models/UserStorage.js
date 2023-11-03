"use strict";

const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserStorage {
    // 로그인 확인용
    static async Match(userInfo){
        const id = userInfo.id
        const pw = userInfo.pw
        const matchSql = "SELECT * FROM users WHERE userId= ?; ";
        try{
            const [[idCheck]] = await pool.query(matchSql, [id])
            const userData = idCheck
            const hashPw = userData.userPw;
            const user = {
                id : userData.userId,
                name : userData.userNm,
            }

            if(!userData || userData.length === 0) { // data가 없고 length가 0 인 경우 -> 유저가 존재하지 않음
                return {success : false, msg : '존재하지 않는 유저입니다.'}
            } else { // data가 존재하고 length가 1 이상인 경우
                // 비밀번호 복호화
                try{
                    const match = await bcrypt.compare(pw,hashPw)
                    if(match){
                        pool.releaseConnection();
                        return {success : true, data : user}
                    } else  {
                        pool.releaseConnection();
                        return {success : false, msg : "비밀번호를 확인하세요"}
                    }
                } catch(err){
                    console.log('UserStorage match error check-------');
                    console.log(err);
                    console.log('UserStorage match error check-------');
                }
            }
        } catch(err){
            return {success : false, msg : '존재하지 않는 유저입니다.'}
        }
    }

    // 로그아웃
    static async DeleteToken(userInfo){
        const user = userInfo;
        try {
            const deleteTokenSql = "DELETE FROM users_token WHERE userId = ?;";
            await pool.query(deleteTokenSql, [user.id])
            pool.releaseConnection();
            return {success  : true, msg : '토큰삭제 성공'};
        } catch(err) {
            return {success : false, msg : "err"}
        }
    }

    // 토큰발행
    static async getToken(userInfo){
        const user = userInfo.data;

        const accessToken = jwt.sign(user, process.env.JWT_SECRET_KEY,{
            expiresIn : process.env.JWT_EXPIRES_IN
        })

        const refreshToken = jwt.sign(user, process.env.JWT_RE_SECRET_KEY,{
            expiresIn : process.env.JWT_RE_EXPIRES_IN
        })

        let token = {
            aToken : accessToken,
            rToken : refreshToken
        }
        try {
            const selectToken = 'SELECT * FROM users_token WHERE userId = ?;';
            const [sData] = await pool.query(selectToken, [user.id])

            if(sData && sData.length >=1){
                token.rToken = sData[0].userTk
                return token;
            } else {
                const inserToken = 'INSERT INTO users_token(userId, userTk) VALUES (?,?); ';
                await pool.query(inserToken,[user.id, refreshToken]);
                pool.releaseConnection();
                return token
            }
        } catch(err){
            throw Error(err);
        }
    }

    // 토큰을 이용한 유저찾기
    static async FindUser(token){
        const decoded = jwt.decode(token);
        const findUserSql = 'SELECT * FROM users WHERE userId = ?;';
        const [[uData]] = await pool.query(findUserSql, [decoded.id]);
        const user = {
            id : uData.userId,
            name : uData.userNm,
            grade : uData.userGd,
        }
        pool.releaseConnection();
        return user;
    }

    // 토큰 찾기
    static async FindToken(user, token){
        let reToken = {
            aToken : '',
        }
        try {
            // 유효
            const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);
            const expireData = new Date(decoded.exp * 1000)
            const now = new Date();
            const difference = expireData - now; // 남은 밀리초 단위 시간 차이
            const seconds = Math.floor(difference / 1000); // 남은 초 단위 시간 차이
            // console.log('만료까지 남은 시간:', seconds, '초');

            reToken.aToken = token
            return reToken

        } catch (err) {
            // 만료
            // refreshToken 가져오기
            const refreshSql = 'SELECT * FROM users_token WHERE userId = ?;';
            const [[reIssu]] = await pool.query(refreshSql,[user.id]);

            if(!reIssu && reIssu === undefined) {
                // 퀘리 실패 문제
            }
            // refreshToken 유효검사
            const reDecoded = jwt.verify(reIssu.userTk , process.env.JWT_RE_SECRET_KEY);
            const reExpireData = new Date(reDecoded.exp * 1000)
            const reNow = new Date();

            if(reExpireData < reNow) {
                // refreshToken 만료, accessToken 만료
                return {success : false , msg : '인증 실패. 다시 로그인 부탁드립니다.'}
            }
            // refreshToken 유효, accessToken 만료
            // accessToken과 refreshToken 재발급후 accessToken은 다시 보내주고 refreshToken은 db에 update
            const accessToken = jwt.sign(user, process.env.JWT_SECRET_KEY,{
                expiresIn : process.env.JWT_EXPIRES_IN
            })
    
            const refreshToken = jwt.sign(user, process.env.JWT_RE_SECRET_KEY,{
                expiresIn : process.env.JWT_RE_EXPIRES_IN
            })

            reToken.aToken = accessToken;

            const updateSql = 'UPDATE users_token SET userTk = ? WHERE userId = ?;';
            await pool.query(updateSql,[refreshToken, user.id])
            pool.releaseConnection();
            return reToken;
        }
    }

    // 회원가입
    static async Add(userInfo){
        try {
            // 일치하는 유저가 없는 경우 == 유저 등록
            let pw = userInfo.pw;
            let salt = bcrypt.genSaltSync(10);
            let bashPw = bcrypt.hashSync(pw,salt);

            const addSql = "INSERT INTO users(userNm, userId, userPw) VALUES(?,?,?);";
            const [addUser] = await pool.query(addSql,[userInfo.name, userInfo.id, bashPw]);

            if(!addUser) {
                return {success : false, msg : '회원가입 실패'};
            }
            pool.releaseConnection();
            return {success : true}
        } catch(err){
            console.log(err)
        }
    }

    // 아이디 중복확인
    static async Checker(userInfo){
        console.log(userInfo)
        const checkSql = "SELECT * FROM users WHERE userId = ?;";
        const [checkUser] = await pool.query(checkSql, [userInfo.id]);

        if(checkUser.length === 0) {
            return {msg : '사용가능한 아이디입니다.'}
        }
        return {msg : '중복된 아이디 입니다.'}
    }

    //마이페이지
    static async Edit(userInfo){
        const user = userInfo;

        // 바꿀 비밀번호 암호화하기
        let salt = bcrypt.genSaltSync(10);
        let bashPw = bcrypt.hashSync(user.pw,salt);

        
        //UPDATE [테이블] SET [열] = '변경할값' WHERE [조건]
        try {
            const updateUserSql = 'UPDATE users SET userPw = ? , userNm = ? WHERE userId = ?;';
            pool.query(updateUserSql,[bashPw, user.name, user.id]);

            pool.releaseConnection();
            return {success : true}
        } catch(err) {
            // console.log('update err' + err)
            return {success :false};
        }

        // 2. 수정된 경우 token발행 및 cookie 초기
    }
}

module.exports = UserStorage;