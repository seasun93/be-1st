"use strict";

const pool = require('../config/db');

class BoardStorage {
    static async getList(req, path, page){
        //리스트 불러오기
        const listNum = (page * 5) - 5; // offset
        try{
            const pageListSql = `SELECT boardNum, boardTitle, author, view, regDate from ${path} order by boardNum desc LIMIT 5 OFFSET ${listNum}`;
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

    static async updateView (type, id){
        try {
            const selectSql = `SELECT view from ${type} WHERE boardNum = ${id}`;
            const [[selctData]] = await pool.query(selectSql);
            const countView = selctData.view;
            const updateViewSql = `UPDATE ${type} SET view = ${countView + 1} WHERE boardNum = ${id} `;

            const [updateView] = await pool.query(updateViewSql);

            if(!updateView) {
                return {success : false, type: 'viewUpdate' , msg : 'view 업데이트를 실패하였습니다.'}
            }
            return {success : true, type: 'viewUpdate' , msg : 'view 업데이트를 성공하였습니다.'}
        } catch(err) {
            console.log(err)
            return {success : false, type: 'viewUpdate' , msg : 'view 업데이트를 실패하였습니다.'};
        }
    }

    static async viewer(data, type, id){
        //get 요청시 view update 해주기
        try{
            const viewSql = `SELECT boardNum, boardTitle, author, boardContent, view, boardTag from ${type} WHERE boardNum = ${id}`;
            const [view] = await pool.query(viewSql)

            if(!view) {
                return {success : false, data : [], msg : '데이터를 읽어오는데 실패했습니다.'}
            }
            pool.releaseConnection();

            return {success : true, data : view, msg : '데이터 전송 완료'};

        } catch(err){
            console.log(err)
            return {success : false, data : [], msg : '데이터를 읽어오는데 실패했습니다.'}
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

    static async deletePost(type,id){
        try{
            const deleteSql = `DELETE FROM ${type} WHERE boardNum = ${id}`;
            const [deletePost] = await pool.query(deleteSql);

            if(!deletePost){
                return {success : false, data : '', msg: '게시글 삭제를 실패하였습니다.'}
            }
            pool.releaseConnection();
            return {success: true, data : '', msg :'게시글을 삭제하였습니다.'}
        } catch(err) {
            console.log(err)
            return {success : false, data : '', msg: '게시글 삭제를 실패하였습니다.'}
        }
    }
}

module.exports = BoardStorage;