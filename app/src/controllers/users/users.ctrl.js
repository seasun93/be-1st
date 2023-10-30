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
        const response = await user.login();
        if(!response.data.success) {
            return res.json({loginSuccess : response.data})
        }
        return res.cookie('x_auth', response.accessToken, {
            httpOnly: true,
            maxAge : 30 * 60 * 1000,
        }).status(200).json({loginSuccess : response.data})
    },

    register : async (req,res)=>{
        const user = new User(req.body);
        const response = await user.register();

        res.json(response);
    },
    auth : (req,res)=>{
        if(!req.loginSuccess){
            return res.json({loginSuccess : false, msg : req.msg})
        }
        res.status(200).json({
            id : req.user.userId,
            name : req.user.userNm,
            isAdmin : req.users.userGd === 0 ? false : true,
            isAuth : true,
            grade : req.user.userGd
        })

    },
}

module.exports = {
    output,
    process,
}