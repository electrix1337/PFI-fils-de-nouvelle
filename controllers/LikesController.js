import likeModel from '../models/like.js';
import Repository from '../models/repository.js';
import Controller from './Controller.js';
import AccessControl from '../accessControl.js';

export default class LikesController extends Controller {
    constructor(HttpContext) {
        super(HttpContext, new Repository(new likeModel(), AccessControl.user()));
    }

    DeleteUser() {
        if (this.HttpContext.path.params.userId) {
            let user = this.repository.findByField("Email", this.HttpContext.path.params.Email);
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
    GetLiked() {
        let userId = this.HttpContext.path.params.userId;
        let postId = this.HttpContext.path.params.postId;
        if (userId) {
            if (postId) {
                let postsLiked = this.repository.
                if (this.repository.findByField("Email", loginInfo.Email))
            } else {
                this.HttpContext.response.badRequest("The postId is not set.");
            }
        } else {
            this.HttpContext.response.badRequest("The userId is not set.");
        }
    } 
}