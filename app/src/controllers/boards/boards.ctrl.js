"use strict";

const Board = require('../../models/Board');


const output = {

}

const process = {
    getPost : async (req, res) => {
        const page = req.params.page;
        const board = new Board(req.body);
        const path = req.originalUrl.split('/');
        const response = await board.getList(path[2], page);
        res.json(response);
    },
    postPost : async (req,res) => {
        const board = new Board(req.body);
        const response = await board.Post();
        res.json(response)
    }
}


module.exports = {
    output,
    process,
}
