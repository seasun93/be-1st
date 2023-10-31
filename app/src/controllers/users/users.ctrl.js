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
            maxAge : 10* 60 * 60 * 1000,
        }).status(200).json({loginSuccess : response.data})
    },

    register : async (req,res)=>{
        const user = new User(req.body);
        const response = await user.register();

        res.json(response);
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