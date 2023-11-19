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
    viewPost : async (req, res)=>{
        const id = req.params.id;
        const board = new Board(req.body);
        const path = req.originalUrl.split('/');
        const response = await board.viewer(path[2], id);
        res.json(response);
    },
    postPost : async (req,res) => {
        const board = new Board(req.body);
        const response = await board.Post();
        res.json(response)
    },
    deletePost : async (req, res)=>{
        const id = req.params.id;
        const path = req.originalUrl.split('/');
        const board = new Board(req.body);
        const response = await board.Delete(path[2], id);
        res.json(response)
    }
}


module.exports = {
    output,
    process,
}
