
class Accounts_API {
    static API_URL() { return "http://localhost:5001/accounts" };
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
    static async Login(data) {
        Accounts_API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: "http://localhost:5001/token",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: (data) => { resolve(data); },
                error: (xhr) => { Accounts_API.setHttpErrorState(xhr); resolve(null); console.log(xhr); }
            });
        });
    }
    static async Logout(idUser) {
        Accounts_API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: Accounts_API.API_URL() + "/logout?userId" + idUser,
                type: "GET",
                complete: data => { resolve({ ETag: data.getResponseHeader('ETag'), data: data.responseJSON }); },
                error: (xhr) => { Accounts_API.setHttpErrorState(xhr); resolve(null); }
            });
        });
    }
}