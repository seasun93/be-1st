const BoardStorage = require('./BoardStorage');

class Board {
    constructor(body){
        this.body = body;
    }

    // 게시글 리프트
    async getList(path, page){
        const request = this.body;
        const data = await BoardStorage.getList(request, path, page);
        return data;
    } 

    async Post(){
        const request = this.body;
        const type = request.type;
        const data = await BoardStorage.Post(request, type);
        return data;
    }

}

module.exports = Board;