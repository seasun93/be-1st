"use strict";

const output = {
    home : (req, res)=>{
        res.json({complete:"hello world"});
    }
}


module.exports = { output }