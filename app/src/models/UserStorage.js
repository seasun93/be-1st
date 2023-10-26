"use strict";

const pool = require('../config/db');

class UserStorage {
    //로그인 확인용
    static async Match(userInfo){
        return new Promise((resolve, reject)=>{
            pool.getConnection((err, conn)=>{
                if(err) console.log(err)
                const matchSql = "SELECT * FROM users WHERE userId= ?";
                //아이디 입력
                if(userInfo.id){
                    conn.query(matchSql,[userInfo.id],(err,data)=>{
                        if(err) reject(err);
                        if(!data.legnth){
                            return resolve({success: false, msg : '존재하지 않는 아이디입니다.'});
                        }

                        resolve(data[0])
                    })
                    conn.release();
                }
            })
        })
        .then((result)=>{ return result})
        .catch((error)=>{ return {success : false, msg : '비밀번호를 확인하세요'}})
    }
}

module.exports = UserStorage;