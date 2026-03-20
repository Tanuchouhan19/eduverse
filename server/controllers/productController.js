const Listing = require("../models/listingModel")



const getProducts = async (req, res) => {
    const listings = await Listing.find().populate('user')

    if (!listings) {
        res.status(404)
        throw new Error("Products not Found!")
    }

    res.status(200).json(listings)
}

const addProduct = async (req, res) => {
    const { title, description, prize, isAvailable, itemImage } = req.body

    if (!req.body || !title || !description || !prize || !itemImage) {
        res.status(400)
        throw new Error('Please fill all details!')
    }

    const newListing = await Listing.create({
        title,
        description,
        prize,
        isAvailable: true,
        itemImage,
        user: req.user._id

    })

    if (!newListing) {
        res.status(400)
        throw new Error('Listing not created')
    }
    res.status(201).json(newListing)
}

// for single product  find by id 
const getProduct = async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate('user')

    if (!listing) {
        res.status(404)
        throw new Error("Product not Found!")
    }

    res.status(200).json(listing)
}


const updateProduct = async (req, res) => {
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user')

    if (!updatedListing) {
        res.status(404)
        throw new Error("Product not Updated!!")
    }

    res.status(200).json(updatedListing)
}


module.exports = { getProducts, addProduct, getProduct, updateProduct }