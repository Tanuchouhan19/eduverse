const { mongoose } = require("mongoose");

const eventSchema = new mongoose.Schema({

    eventName : {
        type : String ,
        required : [true , "please Fill Event Name"]
    },
    eventDescription : {
        type : String ,
        required : [true , "please Fill Event Description "]
    },
    eventImage : {
        type : String ,
        required : [true , "please Fill Event Image URL"]
    },
    eventDate :{
        type : String ,
        required : [true , "please Fill Event Date"]
    },
    status : {
        type : String ,
        enum : ["upcoming" , "completed" , "ongoing" , "postponed"] ,
        required : true,
        default : "upcoming"
    },
    location : {
        type : String ,
        required : [true , "please Fill Event Location "]
    },
    availableSeats : {
        type : Number ,
        required : [true , "please Fill Event Seats"] ,
        default : 50
    },
    organizer : {
         type : String ,
        required : [true , "please Fill Event Organizer Name"]
    },
    prize : {
        type : String ,
        required : [true , "please Fill Event prize "]
    },

},{
    timestamps : true
}) 


module.exports = mongoose.model('Event',eventSchema)