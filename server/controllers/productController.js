const Listing = require("../models/listingModel")
const Message = require("../models/messageModel")

const normalizeCategory = (category = "Other") => {
    const categories = ["Electronics", "Books", "Furniture", "Stationery", "Clothing", "Other"]
    const normalized = categories.find(item => item.toLowerCase() === String(category).toLowerCase())
    return normalized || "Other"
}



const getProducts = async (req, res) => {
    const listings = await Listing.find().populate('user', '-password').sort({ createdAt: -1 })

    if (!listings) {
        res.status(404)
        throw new Error("Products not Found!")
    }

    res.status(200).json(listings)
}

const getMyProducts = async (req, res) => {
    const listings = await Listing.find({ user: req.user._id }).populate('user', '-password').sort({ createdAt: -1 })
    res.status(200).json(listings)
}

const addProduct = async (req, res) => {
    const { title, description, prize, isAvailable, itemImage , category } = req.body

    if (!req.body || !title || !description || !prize) {
        res.status(400)
        throw new Error('Please fill all details!')
    }

    const newListing = await Listing.create({
        title,
        description,
        prize,
        isAvailable: true,
        itemImage: itemImage || "",
        category: normalizeCategory(category), 
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
    const listing = await Listing.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: true }
    ).populate('user', '-password')

    if (!listing) {
        res.status(404)
        throw new Error("Product not Found!")
    }

    res.status(200).json(listing)
}


const updateProduct = async (req, res) => {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
        res.status(404)
        throw new Error("Product not Found!!")
    }

    if (String(listing.user) !== String(req.user._id) && !req.user.isAdmin) {
        res.status(403)
        throw new Error("Not allowed to update this listing")
    }

    const payload = {
        ...req.body,
        ...(req.body.category ? { category: normalizeCategory(req.body.category) } : {}),
    }

    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, payload, { new: true }).populate('user', '-password')

    if (!updatedListing) {
        res.status(404)
        throw new Error("Product not Updated!!")
    }

    res.status(200).json(updatedListing)
}

const deleteProduct = async (req, res) => {
    const listing = await Listing.findById(req.params.id)

    if (!listing) {
        res.status(404)
        throw new Error("Product not Found!!")
    }

    if (String(listing.user) !== String(req.user._id) && !req.user.isAdmin) {
        res.status(403)
        throw new Error("Not allowed to delete this listing")
    }

    await listing.deleteOne()
    await Message.deleteMany({ listing: req.params.id })
    res.status(200).json({ _id: req.params.id })
}

module.exports = { getProducts, getMyProducts, addProduct, getProduct, updateProduct, deleteProduct }
