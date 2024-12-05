class Likes_API {
    static API_URL() { return "http://localhost:5000/likes" };
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
        Accounts_API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: Accounts_API.API_URL() + "/GetLiked?" + userId + "&" + postId,
                type: "GET",
                complete: data => { resolve({ ETag: data.getResponseHeader('ETag'), data: data.responseJSON }); },
                error: (xhr) => { Accounts_API.setHttpErrorState(xhr); resolve(null); }
            });
        });
    }

    static async SetLike(userId, postId) {
        Accounts_API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: Accounts_API.API_URL() + "/SetLike?userId=" + userId + "&postId=" + postId,
                type: "GET",
                complete: data => { resolve({ ETag: data.getResponseHeader('ETag'), data: data.responseJSON }); },
                error: (xhr) => { Accounts_API.setHttpErrorState(xhr); resolve(null); }
            });
        });
    }
}