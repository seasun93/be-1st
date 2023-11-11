"use strict";

const User = require('../../models/User');

const output = {
    login : (req,res)=>{
        res.json({data : 'hello'})
    },
    register : (req, res)=>{
        res.json({data : 'register 테스트'})
    },
}

const process = {
    login : async (req,res)=>{
        const user = new User(req.body);
        console.log(user)
        const response = await user.login();
        if(!response.data.success) {
            return res.json({loginSuccess : response.data})
        }
        return res.cookie('x_auth', response.accessToken, {
            httpOnly: true,
            maxAge : 10* 60 * 60 * 1000,
        }).status(200).json({loginSuccess : response.data})
    },

    register : async (req,res)=>{
        const user = new User(req.body);
        const response = await user.register();

        res.json(response);
    },

    idCheck : async (req, res)=>{
        const user = new User(req.body);
        const response = await user.idCheck();
        
        res.json(response);
    },

    logout : async (req, res)=>{
        const user = new User(req.body);
        const response = await user.logout();
        if(!response.success) {
            //로그아웃 실패
            return res.json({logoutSuccess : false})
        }
        return res.clearCookie('x_auth').json({logoutSuccess : true})
    },
    
    edit : async (req, res)=>{
        const user = new User(req.body);
        const response = await user.Edit();

        if(!response.success) {
            res.json({success : false, msg : '개인 정보 수정 실패'})
        }
        // token 삭제 했으니 cookie에서도 삭제 하기
        res.clearCookie('x_auth').json({success : true, msg : '정보 수정 완료'})
    },

    auth : (req,res)=>{
        if(!req.loginSuccess){
            return res.json({loginSuccess : false, data : req.data})
        }
        res.cookie('x_auth', req.data.token, {
            httpOnly: true,
            maxAge : 10* 60 * 60 * 1000,
        }).status(200).json({
            loginSuccess : true,
            data : {
                id : req.data.user.id,
                name : req.data.user.name,
                grade : req.data.user.grade,
                isAdmin : req.data.user.grade === 1 ?  true: false,
                isAuth : true,
            }
        })

    },

}

module.exports = {
    output,
    process,
}