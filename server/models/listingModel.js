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
        required : [true , "please Fill Prduct Image"]
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        required  : true,
        ref : 'User'
    }
},{
    timestamps : true
})

module.exports = mongoose.model('Listing' , listingSchema)