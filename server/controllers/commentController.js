const Comment = require('../models/commentModel')


const addComment = async (req , res) => {
   if(!req.body.text){
    res.status(400)
    throw new Error('Please Add Text!')
   }

   if(!req.user?._id){
    res.status(401)
    throw new Error('Please login to add a comment')
   }

   const commentData = {
    text : req.body.text,
    event : req.params.eid,
    user : req.user._id,
    username : req.user.name || req.body.username || 'User'
   }
   
   const newComment = await Comment.create(commentData)

   if(!newComment){
    res.status(400)
    throw new Error("Comment Not Added!")
   }
   const savedComment = await Comment.findById(newComment._id).populate('user', '-password').populate('event')
   res.status(201).json(savedComment)
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
