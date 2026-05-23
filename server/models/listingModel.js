const { mongoose } = require("mongoose");

const listingSchema = new mongoose.Schema({
    title : {
         type : String ,
        required : [true , "please Fill Product Name"]
    },
    description : {
         type : String ,
        required : [true , "please Fill Product Description Name"]
    },
    prize : {
         type : String ,
        required : [true , "please Fill Product Prize "]
    },
    isAvailable : {
        type : Boolean ,
        default : true ,
        required : true 
    },
    itemImage : {
         type : String ,
        default : ""
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required  : true,
        ref : 'User'
    },
     category: {           // ✅ Capital C → small c
        type: String,
        default: "General", // ✅ true nahi — string default
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    saves: {
        type: Number,
        default: 0
    }
},{
    timestamps : true
})

module.exports = mongoose.model('Listing' , listingSchema)
