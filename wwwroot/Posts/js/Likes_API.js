class Likes_API {
    static API_URL() { return "http://localhost:5002/likes" };
    static initHttpState() {
        this.currentHttpError = "";
        this.currentStatus = 0;
        this.error = false;
    }

    static setHttpErrorState(xhr) {
        if (xhr.responseJSON)
            this.currentHttpError = xhr.responseJSON.error_description;
        else
            this.currentHttpError = xhr.statusText == 'error' ? "Service introuvable" : xhr.statusText;
        this.currentStatus = xhr.status;
        this.error = true;
    }
    static async GetLiked(userId, postId) {
        Likes_API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: Likes_API.API_URL() + "/getliked?userId=" + userId + "&postId=" + postId,
                type: "GET",
                success: (data) => { resolve(data); },
                error: (xhr) => { Likes_API.setHttpErrorState(xhr); resolve(null); }
            });
        });
    }

    static async SetLike(userId, postId) {
        Likes_API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: Likes_API.API_URL() + "/setlike?userId=" + userId + "&postId=" + postId,
                type: "GET",
                success: (data) => { resolve(data); },
                error: (xhr) => { Likes_API.setHttpErrorState(xhr); resolve(null); }
            });
        });
    }
    static async GetLikesFromPost(postId) {
        Likes_API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: Likes_API.API_URL() + "/getlikesfrompost?postId=" + postId,
                type: "GET",
                success: (data) => { resolve(data); },
                error: (xhr) => { Likes_API.setHttpErrorState(xhr); resolve(null); }
            });
        });
    }
}