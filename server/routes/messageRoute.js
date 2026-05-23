const express = require('express')
const {  getMessages, getSellerMessages, markMessageRead, replyMessage, sendMessage } = require('../controllers/messageController')
const protect = require('../middleware/authMiddleware')


const router = express.Router()

router.get("/seller/inbox" ,protect , getSellerMessages)
router.put("/:mid/read" ,protect , markMessageRead)
router.put("/:mid/reply" ,protect , replyMessage)
router.get("/:pid" ,protect , getMessages)
router.post("/:pid" ,protect ,  sendMessage)


module.exports = router
