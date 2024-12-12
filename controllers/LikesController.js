import likeModel from '../models/like.js';
import postsModel from '../models/post.js';
import userModel from '../models/user.js';
import Repository from '../models/repository.js';
import Controller from './Controller.js';
import AccessControl from '../accessControl.js';

export default class LikesController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new likeModel(), AccessControl.user()));
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
                                if (object.PostId == postId) {
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
    getlikesfrompost() {
        let postId = this.HttpContext.path.params.postId;
        if (postId) {
            let postsRepos = new Repository(new postsModel());
            let post = postsRepos.findByField("Id", postId);
            if (post) {
                let userLikes = this.repository.findByFilter((object) => {
                    if (object.PostId == postId) {
                        return true;
                    }
                    return false;
                });
                let usersTab = [];
                let usersRepos = new Repository(new userModel());
                for (var userLike in userLikes) {
                    let user = usersRepos.findByField("Id", userLikes[userLike].UserId).Name;
                    if (user == null) {
                        this.repository.remove(userLikes[userLike].Id);
                    } else {
                        usersTab.push(user);
                    }
                }
                this.HttpContext.response.JSON(usersTab);
            } else {
                this.HttpContext.response.badRequest("The post don't exist.");
            }
        } else {
            this.HttpContext.response.badRequest("The postId is not set.");
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
                                if (object.PostId == postId) {
                                    return true;
                                }
                            }
                            return false;
                        });
                        if (userLike.length >= 1) {
                            this.repository.remove(userLike[0].Id);
                            this.HttpContext.response.JSON(false);
                        } else {
                            let newLike = {"UserId" : userId, "PostId" : postId};
                            let like = this.repository.add(newLike);
                            if (this.repository.model.state.isValid) {
                                this.HttpContext.response.created(like);
                            } else {
                                this.HttpContext.response.JSON(true);
                            }
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