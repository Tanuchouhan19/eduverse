const Message = require("../models/messageModel")
const Listing = require("../models/listingModel")


const getMessages = async (req, res) => {

    const messages = await Message.find({ listing: req.params.pid }).populate('user', '-password').populate('listing')

    if (!messages) {
        res.status(404)
        throw new Error('Messages Not Found!')
    }
    res.status(200).json(messages)
}

const getSellerMessages = async (req, res) => {
    const sellerListings = await Listing.find({ user: req.user._id }).select("_id")
    const listingIds = sellerListings.map(listing => listing._id)

    const messages = await Message.find({ listing: { $in: listingIds } })
        .populate('user', '-password')
        .populate('listing')
        .sort({ createdAt: -1 })

    res.status(200).json(messages)
}

const markMessageRead = async (req, res) => {
    const message = await Message.findById(req.params.mid).populate('listing')

    if (!message) {
        res.status(404)
        throw new Error("Message Not Found!")
    }

    if (String(message.listing.user) !== String(req.user._id)) {
        res.status(403)
        throw new Error("Not allowed to update this message")
    }

    message.isRead = true
    await message.save()

    const updatedMessage = await Message.findById(message._id).populate('user', '-password').populate('listing')
    res.status(200).json(updatedMessage)
}

const replyMessage = async (req, res) => {
    const { replyText } = req.body

    if (!replyText) {
        res.status(400)
        throw new Error("Please Add Reply Text!")
    }

    const message = await Message.findById(req.params.mid).populate('listing')

    if (!message) {
        res.status(404)
        throw new Error("Message Not Found!")
    }

    if (String(message.listing.user) !== String(req.user._id)) {
        res.status(403)
        throw new Error("Not allowed to reply to this message")
    }

    message.replyText = replyText
    message.repliedAt = new Date()
    message.isRead = true
    await message.save()

    const updatedMessage = await Message.findById(message._id).populate('user', '-password').populate('listing')
    res.status(200).json(updatedMessage)
}



const sendMessage = async (req, res) => {
    if (!req.body.text) {
        res.status(400)
        throw new Error('Please Add Text!')
    }

    const listing = await Listing.findById(req.params.pid)

    if (!listing) {
        res.status(404)
        throw new Error("Listing Not Found!")
    }

    const newMessage = await Message.create({ text: req.body.text, user: req.user._id, listing: req.params.pid })

    if (!newMessage) {
        res.status(400)
        throw new Error("Message Not Sent!")
    }
    const populatedMessage = await Message.findById(newMessage._id).populate('user', '-password').populate('listing')
    res.status(201).json(populatedMessage)
}

module.exports = { getMessages, getSellerMessages, markMessageRead, replyMessage, sendMessage }
