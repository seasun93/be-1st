"use strict";

const pool = require('../config/db');

class BoardStorage {
    static async getList(req, path, page){
        //리스트 불러오기
        const listNum = (page * 5) - 5; // offset
        try{
            const pageListSql = `SELECT boardNum, boardTitle, author, view, newDate from ${path} order by boardNum desc LIMIT 5 OFFSET ${listNum}`;
            const [list] = await pool.query(pageListSql);
            const allListsql = `SELECT boardNum from ${path};`;
            const [all] = await pool.query(allListsql)
            pool.releaseConnection();
            return {success : true, data : list, length : all.length};
        } catch(err){
            console.log(err)
            return {success : false, msg :'데이터를 읽어오는데 실패했습니다.'}
        }
    }
    static async Post(data, type){
        //board 테이블에 삽입
        //태그 데이터 수정
        const tag = data.Tag.join()
        try {
            const postInsertSql = `INSERT INTO ${type} (boardTitle, author, boardContent, boardTag) VALUES (?, ?, ?, ?);`;
            await pool.query(postInsertSql,[data.title, data.author, data.Content, tag])
            pool.releaseConnection();
            return {success: true, msg : '작성완료'}
        } catch(err) {
            console.log(err)
            return {success : false, msg : '작성실패'};
        }
    }
}

module.exports = BoardStorage;