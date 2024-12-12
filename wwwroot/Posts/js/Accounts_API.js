
class Accounts_API {
    static Root() { return "http://localhost:5002" };
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
                url: Accounts_API.Root() + "/token",
                type: "POST",
                contentType: 'application/json',
                data: JSON.stringify(data),
                success: (data) => { resolve(data); },
                error: (xhr) => { Accounts_API.setHttpErrorState(xhr); resolve(null); console.log(xhr); }
            });
        });
    }
    static async DeleteAccount(userId) {
        Accounts_API.initHttpState();
        console.log("test");
        return new Promise(resolve => {
            $.ajax({
                url: Accounts_API.Root() + "/accounts/deleteuser?userId=" + userId,
                type: "GET",
                contentType: 'application/json',
                success: (data) => { resolve(data); },
                error: (xhr) => { Accounts_API.setHttpErrorState(xhr); resolve(null); console.log(xhr); }
            });
        });
    }
    static async Verify(data) {
        Accounts_API.initHttpState();
        return new Promise(resolve => {
            $.ajax({
                url: Accounts_API.Root() + "/token",
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
                url: Accounts_API.Root() + "/accounts/logout?userId=" + idUser,
                type: "GET",
                contentType: 'application/json',
                success: data => { resolve(data); },
                error: (xhr) => { Accounts_API.setHttpErrorState(xhr); resolve(null); }
            });
        });
    }
}