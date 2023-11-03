const BoardStorage = require('./BoardStorage');

class Board {
    constructor(body){
        this.body = body;
    }

    async getList(){
        const request = this.body;
        const data = BoardStorage.getList(request)
        console.log(request);
    }


}

module.exports = Board;