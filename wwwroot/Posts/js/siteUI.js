////// Author: Nicolas Chourot
////// 2024
////////////////////////////// init
const periodicRefreshPeriod = 10;
const waitingGifTrigger = 2000;
const minKeywordLenth = 3;
const keywordsOnchangeDelay = 500;

let categories = [];
let selectedCategory = "";
let currentETag = "";
let periodic_Refresh_paused = false;
let postsPanel;
let itemLayout;
let waiting = null;
let showKeywords = false;
let keywordsOnchangeTimger = null;
let user = null;

Init_UI();
async function Init_UI() {
    checkIfConnected();
    postsPanel = new PageManager('postsScrollPanel', 'postsPanel', 'postSample', renderPosts);
    updateMenu();
    $('#createPost').on("click", async function () {
        showCreatePostForm();
    });
    $('#abort').on("click", async function () {
        showPosts();
    });
    $('#aboutCmd').on("click", function () {
        showAbout();
    });
    $("#showSearch").on('click', function () {
        toogleShowKeywords();
        showPosts();
    });

    installKeywordsOnkeyupEvent();
    await showPosts();
    start_Periodic_Refresh();
}

/////////////////////////// user session ////////////////////////////////////////////////////////////////

async function checkIfConnected() {
    let email = null;
    let password = null;
    console.log(sessionStorage.getItem('Email'));
    if (sessionStorage.getItem('Email') != undefined) {
        email = sessionStorage.getItem('Email');
        if (sessionStorage.getItem('Password') != undefined) {
            password = sessionStorage.getItem('Password');
            console.log(await Accounts_API.Login({"Email": email, "Password": password}));
            console.log({"Email": email, "Password": password});
            user = await Accounts_API.Login({"Email": email, "Password": password}).user;
        }
    }

}

/////////////////////////// Search keywords UI //////////////////////////////////////////////////////////

function installKeywordsOnkeyupEvent() {
    $("#searchKeys").on('keyup', function () {
        clearTimeout(keywordsOnchangeTimger);
        keywordsOnchangeTimger = setTimeout(() => {
            cleanSearchKeywords();
            showPosts(true);
        }, keywordsOnchangeDelay);
    });
    $("#searchKeys").on('search', function () {
        showPosts(true);
    });
}
function cleanSearchKeywords() {
    /* Keep only keywords of 3 characters or more */
    let keywords = $("#searchKeys").val().trim().split(' ');
    let cleanedKeywords = "";
    keywords.forEach(keyword => {
        if (keyword.length >= minKeywordLenth) cleanedKeywords += keyword + " ";
    });
    $("#searchKeys").val(cleanedKeywords.trim());
}
function showSearchIcon() {
    $("#hiddenIcon").hide();
    $("#showSearch").show();
    if (showKeywords) {
        $("#searchKeys").show();
    }
    else
        $("#searchKeys").hide();
}
function hideSearchIcon() {
    $("#hiddenIcon").show();
    $("#showSearch").hide();
    $("#searchKeys").hide();
}
function toogleShowKeywords() {
    showKeywords = !showKeywords;
    if (showKeywords) {
        $("#searchKeys").show();
        $("#searchKeys").focus();
    }
    else {
        $("#searchKeys").hide();
        showPosts(true);
    }
}

/////////////////////////// Views management ////////////////////////////////////////////////////////////

function intialView() {
    $("#createPost").show();
    $("#hiddenIcon").hide();
    $("#hiddenIcon2").hide();
    $('#menu').show();
    $('#commit').hide();
    $('#abort').hide();
    $('#form').hide();
    $('#form').empty();
    $('#aboutContainer').hide();
    $('#errorContainer').hide();
    showSearchIcon();
}
async function showPosts(reset = false) {
    intialView();
    $("#viewTitle").text("Fil de nouvelles");
    periodic_Refresh_paused = false;
    await postsPanel.show(reset);
}
function hidePosts() {
    postsPanel.hide();
    hideSearchIcon();
    $("#createPost").hide();
    $('#menu').hide();
    periodic_Refresh_paused = true;
}
function hideConnection() {
    $("#form").hide();
    $("#form").empty();
    $('#abort').hide();
}

function hideAccountForm() {
    $("#form").hide();
    $("#form").empty();
    $('#abort').hide();
}
function showForm() {
    hidePosts();
    $('#form').show();
    $('#commit').show();
    $('#abort').show();
}
function showError(message, details = "") {
    hidePosts();
    $('#form').hide();
    $('#form').empty();
    $("#hiddenIcon").show();
    $("#hiddenIcon2").show();
    $('#commit').hide();
    $('#abort').show();
    $("#viewTitle").text("Erreur du serveur...");
    $("#errorContainer").show();
    $("#errorContainer").empty();
    $("#errorContainer").append($(`<div>${message}</div>`));
    $("#errorContainer").append($(`<div>${details}</div>`));
}

function showCreatePostForm() {
    showForm();
    $("#viewTitle").text("Ajout de nouvelle");
    renderPostForm();
}
function showEditPostForm(id) {
    showForm();
    $("#viewTitle").text("Modification");
    renderEditPostForm(id);
}
function showDeletePostForm(id) {
    showForm();
    $("#viewTitle").text("Retrait");
    renderDeletePostForm(id);
}
function showAbout() {
    hidePosts();
    $("#hiddenIcon").show();
    $("#hiddenIcon2").show();
    $('#abort').show();
    $("#viewTitle").text("À propos...");
    $("#aboutContainer").show();
}

function showConnection() {
    hidePosts();
    $("#form").show();
    $('#abort').show();
    renderConnectionForm();
}

function showAccountForm() {
    hideConnection();
    hidePosts();
    $("#form").show();
    $('#abort').show();
    renderAccountForm();
}

//////////////////////////// menuRendering rendering //////////////////////////////////////////////////////////

function updateMenu() {
    let menuHtml = `<img src="news-logo-upload.png" class="appLogo" alt="" title="Fil de nouvelles">
            <span id="viewTitle" class="viewTitle">Fil de nouvelles</span>
            <i class="cmdIcon " id="hiddenIcon" title=""></i>
            <i class="cmdIcon " id="hiddenIcon2" title=""></i>
            <i class="cmdIcon fa fa-check" id="commit" title="Procéder"></i>
            <i class="cmdIcon fa fa-search" id="showSearch" title="Recherche par mots-clés"></i>`;
    if (user != null) {
        menuHtml += `<i class="cmdIcon fa fa-plus" id="createPost" title="Ajouter une nouvelle"></i>`;
    }
    menuHtml += `<i class="cmdIcon fa fa-times" id="abort" title="Annuler"></i>
        <div id="menu" class="dropdown ms-auto">
            <div data-bs-toggle="dropdown" aria-expanded="false">
                <i class="cmdIcon fa fa-ellipsis-vertical"></i>
            </div>
            <div class="dropdown-menu noselect" id="DDMenu">
                <div class="dropdown-item menuItemLayout" id="aboutCmd">
                    <i class="menuIcon fa fa-info-circle mx-2"></i> À propos...
                </div>
            </div>
        </div>`;
    $("#header").html(menuHtml);
}


//////////////////////////// profile rendering /////////////////////////////////////////////////////////////

//////////////////////////// profile rendering /////////////////////////////////////////////////////////////

function renderConnectionForm() {
    $("#form").append(`
        <form class="form" id="postForm">
            <input 
                class="form-control Email"
                name="Email"
                id="Email"
                placeholder="Adresse de courriel"
                RequireMessage="Veuillez entrer un email"
                InvalidMessage="votre réponse n'est pas un courriel"
                CustomErrorMessage="Couriel introuvable"
                required
                value=""
            />
            <input 
                type='password'
                class="form-control "
                name="Password" 
                id="Password" 
                placeholder="Mot de passe"
                required
                RequireMessage="Veuillez entrer un titre"
                InvalidMessage="Le mot de passe est invalide"
                value=""
            />
            <div class="fullContent">
                <input type="submit" value="Entrer" id="savePost" class="btn btn-primary">
                <hr>
                <input type="button" value="Nouveau compte" id="createAccount" class="btn btn-primary buttonCyan">
            </div>
        </form>
    `);
    initFormValidation();

    $('#accept').on("click", async function () {
        await Posts_API.Delete(post.Id);
        if (!Posts_API.error) {
            await showPosts();
        }
        else {
            console.log(Posts_API.currentHttpError)
            showError("Une erreur est survenue!");
        }
    });
    $('#cancel').on("click", async function () {
        await showPosts();
    });
    $('#postForm').on("submit", async function (event) {
        event.preventDefault();
        let account = getFormData($("#postForm"));
        console.log(account);
        account = await Accounts_API.Login(account);
        if (!Accounts_API.error) {
            user = account;
            console.log(account);
            sessionStorage.setItem("Email", account.Email);
            sessionStorage.setItem("Password", account.Password);
            updateMenu();
            await showPosts();
        }
    });
}

function renderAccountForm() {
    $("#form").append(`
        <form class="form" id="postForm">
            <input 
                class="form-control Email"
                name="Email"
                id="Email"
                placeholder="Adresse de courriel"
                RequireMessage="Veuillez entrer un email"
                InvalidMessage="votre réponse n'est pas un courriel"
                CustomErrorMessage="Couriel introuvable"
                required
                value=""
            />
            <input 
                type='password'
                class="form-control "
                name="Password" 
                id="Password" 
                placeholder="Mot de passe"
                required
                RequireMessage="Veuillez entrer un titre"
                InvalidMessage="Le mot de passe est invalide"
                value=""
            />
            <div class="fullContent">
                <input type="submit" value="Entrer" id="savePost" class="btn btn-primary">
                <hr>
                <input type="button" value="Nouveau compte" id="createAccount" class="btn btn-primary buttonCyan">
            </div>
        </form>
    `);
}

//////////////////////////// Posts rendering /////////////////////////////////////////////////////////////

//////////////////////////// Posts rendering /////////////////////////////////////////////////////////////

function start_Periodic_Refresh() {
    setInterval(async () => {
        if (!periodic_Refresh_paused) {
            let etag = await Posts_API.HEAD();
            if (currentETag != etag) {
                currentETag = etag;
                await showPosts();
            }
        }
    },
        periodicRefreshPeriod * 1000);
}
async function renderPosts(queryString) {
    let endOfData = false;
    queryString += "&sort=date,desc";
    compileCategories();
    if (selectedCategory != "") queryString += "&category=" + selectedCategory;
    if (showKeywords) {
        let keys = $("#searchKeys").val().replace(/[ ]/g, ',');
        if (keys !== "")
            queryString += "&keywords=" + $("#searchKeys").val().replace(/[ ]/g, ',')
    }
    addWaitingGif();
    let response = await Posts_API.Get(queryString);
    if (!Posts_API.error) {
        currentETag = response.ETag;
        let Posts = response.data;
        if (Posts.length > 0) {
            Posts.forEach(Post => {
                postsPanel.itemsPanel.append(renderPost(Post));
            });
        } else
            endOfData = true;
        linefeeds_to_Html_br(".postText");
        highlightKeywords();
        attach_Posts_UI_Events_Callback();
    } else {
        showError(Posts_API.currentHttpError);
    }
    removeWaitingGif();
    return endOfData;
}
function renderPost(post, loggedUser) {
    let date = convertToFrenchDate(UTC_To_Local(post.Date));
    let crudIcon = "";
    if (user != null) {
        crudIcon =
            `
            <span class="editCmd cmdIconSmall fa fa-pencil" postId="${post.Id}" title="Modifier nouvelle"></span>
            <span class="deleteCmd cmdIconSmall fa fa-trash" postId="${post.Id}" title="Effacer nouvelle"></span>
            `;
    }
    let likeSection = "";
    if (user != null) {
        userLiked = Likes_API.GetLiked(user.Id, post.Id);
        likeSection =
            `
            <span class="fa-solid fa-thumbs-up likeCmd cmdIconSmall" postId="${post.Id}" title="Modifier nouvelle"></span>
            <span>0</span>
            `;
    }

    return $(`
        <div class="post" id="${post.Id}">
            <div class="postHeader">
                ${post.Category}
                ${crudIcon}
                ${likeSection}
            </div>
            <div class="postTitle"> ${post.Title} </div>
            <img class="postImage" src='${post.Image}'/>
            <div class="postDate"> ${date} </div>
            <div postId="${post.Id}" class="postTextContainer hideExtra">
                <div class="postText" >${post.Text}</div>
            </div>
            <div class="postfooter">
                <span postId="${post.Id}" class="moreText cmdIconXSmall fa fa-angle-double-down" title="Afficher la suite"></span>
                <span postId="${post.Id}" class="lessText cmdIconXSmall fa fa-angle-double-up" title="Réduire..."></span>
            </div>         
        </div>
    `);
}
async function compileCategories() {
    categories = [];
    let response = await Posts_API.GetQuery("?fields=category&sort=category");
    if (!Posts_API.error) {
        let items = response.data;
        if (items != null) {
            items.forEach(item => {
                if (!categories.includes(item.Category))
                    categories.push(item.Category);
            })
            if (!categories.includes(selectedCategory))
                selectedCategory = "";
            updateDropDownMenu(categories);
        }
    }
}
function updateDropDownMenu() {
    let DDMenu = $("#DDMenu");
    let selectClass = selectedCategory === "" ? "fa-check" : "fa-fw";
    DDMenu.empty();
    if (user == null) {
        /*connection**/
        DDMenu.append($(`
            <div class="dropdown-item menuItemLayout" id="connection">
                <i class="menuIcon mx-2 fa-solid fa-arrow-right-to-bracket"></i>Connection
            </div>
            `));

            $('#connection').on("click", function() {
                showConnection();
            });
    } else {
        if (user["isAdmin"]) {
            DDMenu.append($(`
                <div class="dropdown-item menuItemLayout" id="gestionAdmin">
                    <i class="menuIcon mx-2 fa-solid fa-arrow-right-to-bracket"></i>Gestion des usagers
                </div>
                <div class="dropdown-divider"></div>
                `));
            $("#gestionAdmin").on("click", function() {
                renderUserManagement();
            });
        }
        /*modify profile*/
        DDMenu.append($(`
            <div class="dropdown-item menuItemLayout" id="modifyProfil">
                <i class="menuIcon mx-2 fa-solid fa-arrow-right-to-bracket"></i>Modifier votre profil
            </div>`));
        $("#modifyProfil").on("click", function() {
            renderAccountForm();
        });
        DDMenu.append($(`
            <div class="dropdown-item menuItemLayout" id="logout">
                <i class="menuIcon mx-2 fa-solid fa-arrow-right-to-bracket"></i>Déconnexion
            </div>`));
        $("#logout").on("click", function() {
            sessionStorage.removeItem("Email");
            sessionStorage.removeItem("Password");
            Accounts_API.Logout(user["Id"]);
            user = null;
            updateMenu();
            showPosts();
        });

    }
    DDMenu.append($(`<div class="dropdown-divider"></div>`));
    DDMenu.append($(`
        <div class="dropdown-item menuItemLayout" id="allCatCmd">
            <i class="menuIcon fa ${selectClass} mx-2"></i> Toutes les catégories
        </div>
        `));
    DDMenu.append($(`<div class="dropdown-divider"></div>`));
    categories.forEach(category => {
        selectClass = selectedCategory === category ? "fa-check" : "fa-fw";
        DDMenu.append($(`
            <div class="dropdown-item menuItemLayout category" id="allCatCmd">
                <i class="menuIcon fa ${selectClass} mx-2"></i> ${category}
            </div>
        `));
    })
    DDMenu.append($(`<div class="dropdown-divider"></div> `));
    DDMenu.append($(`
        <div class="dropdown-item menuItemLayout" id="aboutCmd">
            <i class="menuIcon fa fa-info-circle mx-2"></i> À propos...
        </div>
        `));
    $('#aboutCmd').on("click", function () {
        showAbout();
    });
    $('#allCatCmd').on("click", async function () {
        selectedCategory = "";
        await showPosts(true);
        updateDropDownMenu();
    });
    $('.category').on("click", async function () {
        selectedCategory = $(this).text().trim();
        await showPosts(true);
        updateDropDownMenu();
    });
}
function attach_Posts_UI_Events_Callback() {

    linefeeds_to_Html_br(".postText");
    // attach icon command click event callback
    $(".editCmd").off();
    $(".editCmd").on("click", function () {
        showEditPostForm($(this).attr("postId"));
    });
    $(".likeCmd").on("click", function() {
        console.log(user);
        Likes_API.SetLike(user.Id, $(this).attr("postId"));
    });
    $(".deleteCmd").off();
    $(".deleteCmd").on("click", function () {
        showDeletePostForm($(this).attr("postId"));
    });

    $(".moreText").click(function () {
        $(`.commentsPanel[postId=${$(this).attr("postId")}]`).show();
        $(`.lessText[postId=${$(this).attr("postId")}]`).show();
        $(this).hide();
        $(`.postTextContainer[postId=${$(this).attr("postId")}]`).addClass('showExtra');
        $(`.postTextContainer[postId=${$(this).attr("postId")}]`).removeClass('hideExtra');
    })
    $(".lessText").click(function () {
        $(`.commentsPanel[postId=${$(this).attr("postId")}]`).hide();
        $(`.moreText[postId=${$(this).attr("postId")}]`).show();
        $(this).hide();
        $(`.postTextContainer[postId=${$(this).attr("postId")}]`).addClass('hideExtra');
        $(`.postTextContainer[postId=${$(this).attr("postId")}]`).removeClass('showExtra');
    })
}
function addWaitingGif() {
    clearTimeout(waiting);
    waiting = setTimeout(() => {
        postsPanel.itemsPanel.append($("<div id='waitingGif' class='waitingGifcontainer'><img class='waitingGif' src='Loading_icon.gif' /></div>'"));
    }, waitingGifTrigger)
}
function removeWaitingGif() {
    clearTimeout(waiting);
    $("#waitingGif").remove();
}

/////////////////////// Posts content manipulation ///////////////////////////////////////////////////////

function linefeeds_to_Html_br(selector) {
    $.each($(selector), function () {
        let postText = $(this);
        var str = postText.html();
        var regex = /[\r\n]/g;
        postText.html(str.replace(regex, "<br>"));
    })
}
function highlight(text, elem) {
    text = text.trim();
    if (text.length >= minKeywordLenth) {
        var innerHTML = elem.innerHTML;
        let startIndex = 0;

        while (startIndex < innerHTML.length) {
            var normalizedHtml = innerHTML.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            var index = normalizedHtml.indexOf(text, startIndex);
            let highLightedText = "";
            if (index >= startIndex) {
                highLightedText = "<span class='highlight'>" + innerHTML.substring(index, index + text.length) + "</span>";
                innerHTML = innerHTML.substring(0, index) + highLightedText + innerHTML.substring(index + text.length);
                startIndex = index + highLightedText.length + 1;
            } else
                startIndex = innerHTML.length + 1;
        }
        elem.innerHTML = innerHTML;
    }
}
function highlightKeywords() {
    if (showKeywords) {
        let keywords = $("#searchKeys").val().split(' ');
        if (keywords.length > 0) {
            keywords.forEach(key => {
                let titles = document.getElementsByClassName('postTitle');
                Array.from(titles).forEach(title => {
                    highlight(key, title);
                })
                let texts = document.getElementsByClassName('postText');
                Array.from(texts).forEach(text => {
                    highlight(key, text);
                })
            })
        }
    }
}

//////////////////////// Forms rendering /////////////////////////////////////////////////////////////////

async function renderEditPostForm(id) {
    $('#commit').show();
    addWaitingGif();
    let response = await Posts_API.Get(id)
    if (!Posts_API.error) {
        let Post = response.data;
        if (Post !== null)
            renderPostForm(Post);
        else
            showError("Post introuvable!");
    } else {
        showError(Posts_API.currentHttpError);
    }
    removeWaitingGif();
}
async function renderDeletePostForm(id) {
    let response = await Posts_API.Get(id)
    if (!Posts_API.error) {
        let post = response.data;
        if (post !== null) {
            let date = convertToFrenchDate(UTC_To_Local(post.Date));
            //question
            $("#form").append(`
                <div class="post" id="${post.Id}">
                <div class="postHeader">  ${post.Category} </div>
                <div class="postTitle ellipsis"> ${post.Title} </div>
                <img class="postImage" src='${post.Image}'/>
                <div class="postDate"> ${date} </div>
                <div class="postTextContainer showExtra">
                    <div class="postText">${post.Text}</div>
                </div>
            `);
            linefeeds_to_Html_br(".postText");
            // attach form buttons click event callback
            $('#commit').on("click", async function () {
                await Posts_API.Delete(post.Id);
                if (!Posts_API.error) {
                    await showPosts();
                }
                else {
                    console.log(Posts_API.currentHttpError)
                    showError("Une erreur est survenue!");
                }
            });
            $('#cancel').on("click", async function () {
                await showPosts();
            });
        } else {
            showError("Post introuvable!");
        }
    } else
        showError(Posts_API.currentHttpError);
}
function newPost() {
    let Post = {};
    Post.Id = 0;
    Post.Title = "";
    Post.Text = "";
    Post.Image = "news-logo-upload.png";
    Post.Category = "";
    return Post;
}
function renderPostForm(post = null) {
    let create = post == null;
    if (create) post = newPost();
    $("#form").show();
    $("#form").empty();
    $("#form").append(`
        <form class="form" id="postForm">
            <input type="hidden" name="Id" value="${post.Id}"/>
             <input type="hidden" name="Date" value="${post.Date}"/>
             <input type="hidden" name="CreatorId" value="${user.Id}"/>
            <label for="Category" class="form-label">Catégorie </label>
            <input 
                class="form-control"
                name="Category"
                id="Category"
                placeholder="Catégorie"
                required
                value="${post.Category}"
            />
            <label for="Title" class="form-label">Titre </label>
            <input 
                class="form-control"
                name="Title" 
                id="Title" 
                placeholder="Titre"
                required
                RequireMessage="Veuillez entrer un titre"
                InvalidMessage="Le titre comporte un caractère illégal"
                value="${post.Title}"
            />
            <label for="Url" class="form-label">Texte</label>
             <textarea class="form-control" 
                          name="Text" 
                          id="Text"
                          placeholder="Texte" 
                          rows="9"
                          required 
                          RequireMessage = 'Veuillez entrer une Description'>${post.Text}</textarea>

            <label class="form-label">Image </label>
            <div class='imageUploaderContainer'>
                <div class='imageUploader' 
                     newImage='${create}' 
                     controlId='Image' 
                     imageSrc='${post.Image}' 
                     waitingImage="Loading_icon.gif">
                </div>
            </div>
            <div id="keepDateControl">
                <input type="checkbox" name="keepDate" id="keepDate" class="checkbox" checked>
                <label for="keepDate"> Conserver la date de création </label>
            </div>
            <input type="submit" value="Enregistrer" id="savePost" class="btn btn-primary displayNone">
        </form>
    `);
    if (create) $("#keepDateControl").hide();

    initImageUploaders();
    initFormValidation(); // important do to after all html injection!

    $("#commit").click(function () {
        $("#commit").off();
        return $('#savePost').trigger("click");
    });
    $('#postForm').on("submit", async function (event) {
        event.preventDefault();
        let post = getFormData($("#postForm"));
        if (post.Category != selectedCategory)
            selectedCategory = "";
        if (create || !('keepDate' in post))
            post.Date = Local_to_UTC(Date.now());
        delete post.keepDate;
        post = await Posts_API.Save(post, create);
        if (!Posts_API.error) {
            await showPosts();
            postsPanel.scrollToElem(post.Id);
        }
        else
            showError("Une erreur est survenue! ", Posts_API.currentHttpError);
    });
    $('#cancel').on("click", async function () {
        await showPosts();
    });
}
function getFormData($form) {
    // prevent html injections
    const removeTag = new RegExp("(<[a-zA-Z0-9]+>)|(</[a-zA-Z0-9]+>)", "g");
    var jsonObject = {};
    // grab data from all controls
    $.each($form.serializeArray(), (index, control) => {
        jsonObject[control.name] = control.value.replace(removeTag, "");
    });
    return jsonObject;
}
