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

    async viewer (type, id){
        const request = this.body;
        const updateView = await BoardStorage.updateView(type, id);
        if(updateView.success){
            const data = await BoardStorage.viewer(request, type, id);
            return data;
        }
        return data;
    }

    async Post(){
        const request = this.body;
        const type = request.type;
        const data = await BoardStorage.Post(request, type);
        return data;
    }

    async Delete(type, id){
        const request = this.body;
        const deletePost = await BoardStorage.deletePost(type,id);

        if(deletePost.success) {
            return deletePost;
        }
        return deletePost;
    }

}

module.exports = Board;