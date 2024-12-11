import likeModel from '../models/like.js';
import postsModel from '../models/post.js';
import userModel from '../models/user.js';
import Repository from '../models/repository.js';
import Controller from './Controller.js';
import AccessControl from '../accessControl.js';

export default class LikesController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new likeModel()));
    }

    deleteuser() {
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
    getliked() {
        let userId = this.HttpContext.path.params.userId;
        let postId = this.HttpContext.path.params.postId;
        if (userId) {
            if (postId) {
                let usersRepos = new Repository(new userModel());
                let user = usersRepos.findByField("Id", userId);
                if (user) {
                    let postsRepos = new Repository(new postsModel());
                    let post = postsRepos.findByField("Id", postId);
                    if (post) {
                        let userLike = this.repository.findByFilter((object) => {
                            if (object.UserId == userId) {
                                if (object.postId == postId) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        if (userLike.length >= 1) {
                            this.HttpContext.response.JSON(true);
                        } else {
                            this.HttpContext.response.JSON(false);
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
    setlike() {
        let userId = this.HttpContext.path.params.userId;
        let postId = this.HttpContext.path.params.postId;
        if (userId) {
            if (postId) {
                let usersRepos = new Repository(new userModel());
                let user = usersRepos.findByField("Id", userId);
                if (user) {
                    let postsRepos = new Repository(new postsModel());
                    let post = postsRepos.findByField("Id", postId);
                    if (post) {
                        let userLike = this.repository.findByFilter((object) => {
                            if (object.UserId == userId) {
                                if (object.postId == postId) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        if (userLike.length >= 1) {
                            this.repository.remove(userId, userLike);
                            this.HttpContext.response.JSON(false);
                        } else {
                            let newLike = {"UserId" : userId, "PostId" : postId};
                            let usertest = this.repository.add(newLike);
                            this.HttpContext.response.JSON(true);
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