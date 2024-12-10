import likeModel from '../models/like.js';
import AccountsController from './AccountsController.js';
import PostsController from './PostsController.js';
import Repository from '../models/repository.js';
import Controller from './Controller.js';
import AccessControl from '../accessControl.js';

export default class LikesController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new likeModel(), AccessControl.user()));
    }

    DeleteUser() {
        if (this.HttpContext.path.params.userId) {
            let user = this.repository.findByField("UserId", this.HttpContext.path.params.userId);
            if (user != null) {
                if (user.Password == this.HttpContext.path.params.Password) {
                    user = this.repository.remove(user.Id);
                }
            } else {
                this.HttpContext.response.badRequest("The userId is not link to a user.");
            }
        } else {
            this.HttpContext.response.badRequest("The userId is not set.");
        }
    } 
    SetLiked() {
        let userId = this.HttpContext.path.params.userId;
        let postId = this.HttpContext.path.params.postId;
        if (userId) {
            if (postId) {
                let user = AccountsController.repository.findByField("Id", userId);
                if (user) {
                    let post = PostsController.repository.findByField("Id", postId);
                    if (post) {
                        userLike = this.repository.findByFilter((object) => {
                            if (object.UserId == userId) {
                                if (object.postId == postId) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        if (userLike) {
                            this.repository.remove(userId, userLike);
                            this.HttpContext.response.JSON(userLike);
                        } else {
                            let newLike = {"UserId" : userId, "PostId" : postId};
                            this.repository.add(newLike);
                            this.HttpContext.response.created(newLike);
                        }
                    } else {
                        this.HttpContext.response.badRequest("The post don't exist.");
                    }
                } else {
                    this.HttpContext.response.badRequest("The user dont exist.");
                }
            } else {
                this.HttpContext.response.badRequest("The postId is not set.");
            }
        } else {
            this.HttpContext.response.badRequest("The userId is not set.");
        }
    } 
    SetLiked() {
        let userId = this.HttpContext.path.params.userId;
        let postId = this.HttpContext.path.params.postId;
        if (userId) {
            if (postId) {
                let user = AccountsController.repository.findByField("Id", userId);
                if (user) {
                    let post = PostsController.repository.findByField("Id", postId);
                    if (post) {
                        userLike = this.repository.findByFilter((object) => {
                            if (object.UserId == userId) {
                                if (object.postId == postId) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        if (userLike) {
                            this.repository.remove(userId, userLike);
                            this.HttpContext.response.JSON(userLike);
                        } else {
                            let newLike = {"UserId" : userId, "PostId" : postId};
                            this.repository.add(newLike);
                            this.HttpContext.response.created(newLike);
                        }
                    } else {
                        this.HttpContext.response.badRequest("The post don't exist.");
                    }
                } else {
                    this.HttpContext.response.badRequest("The user dont exist.");
                }
            } else {
                this.HttpContext.response.badRequest("The postId is not set.");
            }
        } else {
            this.HttpContext.response.badRequest("The userId is not set.");
        }
    } 
}