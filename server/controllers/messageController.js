const Message = require("../models/messageModel")


const getMessages = async (req, res) => {

    const messages = await Message.find({ listing: req.params.pid }).populate('user').populate('listing')

    if (!messages) {
        res.status(404)
        throw new Error('Messages Not Found!')
    }
    res.status(200).json(messages)
}




const sendMessage = async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error('Please Add Text!')
    }

    const newMessage = await Message.create({ text: req.body.text, user: req.user._id, listing: req.params.pid })

    if (!newMessage) {
        res.status(400)
        throw new Error("Message Not Sent!")
    }
    res.status(201).json(newMessage)
}

module.exports = { getMessages, sendMessage }