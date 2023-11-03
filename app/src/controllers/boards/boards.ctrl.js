"use strict";

const Board = require('../../models/Board');

const output = {

}

const process = {
    post : (req, res) => {
        const board = new Board();
        const response = board.getList(req.body);
    },
}


module.exports = {
    output,
    process,
}
