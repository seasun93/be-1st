"use strict";

const User = require('../../models/User');

const output = {
    login : (req,res)=>{
        res.json({data : 'hello'})
    }
}

const process = {
    login : async (req,res)=>{
        const user = new User(req.body);
        const response = await user.login();
        res.json({data : response})
    }
}

module.exports = {
    output,
    process,
}