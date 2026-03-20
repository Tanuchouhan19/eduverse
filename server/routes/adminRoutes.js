const express = require('express')
const { getAllUsers, updateUser, addEvent, updateProductListing, updateEvent, getAllComments } = require('../controllers/adminController')
const adminprotect = require('../middleware/adminMiddleware')


const router = express.Router()


router.get("/users" ,adminprotect, getAllUsers)
router.put("/users/:uid" , adminprotect , updateUser)
router.post("/event" ,adminprotect ,  addEvent)
router.put("/event/:eid" , adminprotect , updateEvent)
router.put("/product/:pid" , adminprotect , updateProductListing)
router.get("/comment/:eid" ,adminprotect ,  getAllComments)





module.exports = router