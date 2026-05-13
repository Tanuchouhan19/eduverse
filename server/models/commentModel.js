const { default: mongoose } = require("mongoose");

const commentSchema = new mongoose.Schema({
    
    text : {
        type : String,
        required : true
    },

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : false
    },

    username : {
        type : String,
        default : 'Guest'
    },

    event : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'Event',
        required : true
    }

},{
    timestamps : true
})

module.exports = mongoose.model('comment' , commentSchema)
