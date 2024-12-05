import Model from './model.js';

export default class Post extends Model {
    constructor() {
        super(true /* secured Id */);

        this.addField('UserId', 'string');
        this.addField('PostId', 'string');
    }
}