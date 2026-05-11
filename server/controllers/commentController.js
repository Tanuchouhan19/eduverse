const Comment = require('../models/commentModel')


const addComment = async (req , res) => {
   if(!req.body.text){
    res.status(400)
    throw new Error('Please Add Text!')
   }
   
   const newComment = await Comment.create({text : req.body.text, user : req.user._id , event : req.params.eid})

   if(!newComment){
    res.status(400)
    throw new Error("Comment Not Added!")
   }
   res.status(201).json(newComment)
}

const getComments  =  async (req,res) => {
    const comments = await Comment.find({event : req.params.eid}).populate('user', '-password').populate('event')

    if(!comments){
        res.status(404)
        throw new Error('Comments Not Found!')
    }
    res.status(200).json(comments)
}

module.exports = {addComment , getComments}
