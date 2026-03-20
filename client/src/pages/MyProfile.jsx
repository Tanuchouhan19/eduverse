"use client"

import { Mail, Package, User, Send } from "lucide-react"
import { useState } from "react"
import { useSelector } from "react-redux"

const MyProfile = () => {
    const {user} = useSelector(state => state.auth)

  const [listings, setListings] = useState([
    {
      id: 1,
      title: "Advanced Mathematics Textbook",
      description: "Used for 1 semester, excellent condition, all notes included",
      price: "450",
      category: "books",
      image: "https://images.unsplash.com/photo-150784272343-583f20270319?w=400&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Gaming Laptop - Dell G15",
      description: "Core i7, RTX 3060, 16GB RAM, 512GB SSD, minor scratches on body",
      price: "45000",
      category: "electronics",
      image: "https://images.unsplash.com/photo-1588872657840-90a6486db56c?w=400&h=300&fit=crop",
    },
    {
      id: 3,
      title: "Wooden Study Desk",
      description: "Spacious desk with drawers, perfect for studying, light oak finish",
      price: "5500",
      category: "furniture",
      image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Winter Jacket - Branded",
      description: "Columbia brand, winter proof, size M, barely worn, with tags",
      price: "1200",
      category: "clothing",
      image: "https://images.unsplash.com/photo-1544441893-b09d85e5e5c0?w=400&h=300&fit=crop",
    },
    {
      id: 5,
      title: "Physics Lab Equipment Set",
      description: "Complete set with instruments for basic physics experiments",
      price: "2800",
      category: "other",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
    },
    {
      id: 6,
      title: "Wireless Earbuds Pro",
      description: "Noise cancelling, 30 hour battery, ANC, touch controls",
      price: "3500",
      category: "electronics",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    },
  ])
  const [messages, setMessages] = useState([
    { id: 1, from: "John Doe", text: "Is this item still available?", time: "2 hours ago" },
    { id: 2, from: "Sarah Smith", text: "Great product! When can I pick it up?", time: "4 hours ago" },
    { id: 3, from: "Mike Johnson", text: "Can you negotiate the price?", time: "1 day ago" },
  ])
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image: "",
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddListing = (e) => {
    e.preventDefault()
    if (formData.title && formData.price) {
      setListings((prev) => [...prev, { ...formData, id: Date.now() }])
      setFormData({ title: "", description: "", price: "", category: "", image: "" })
    }
  }

  const handleEditListing = (id) => {
    // Implement edit functionality
  }

  const handleDeleteListing = (id) => {
    setListings((prev) => prev.filter((listing) => listing.id !== id))
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-cyan-500">EduVerse</div>
          <nav className="flex items-center gap-8">
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Home
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Marketplace
            </a>
            <a href="#" className="text-gray-700 hover:text-gray-900">
              Events
            </a>
            <button className="text-red-500 hover:text-red-600 font-semibold">Logout</button>
          </nav>
        </div>
      </header>

      {/* Profile Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-r from-cyan-50 to-pink-50 rounded-2xl p-8 mb-12 border-2 border-cyan-200">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-cyan-400 to-pink-400 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">{user.name}</h1>
              <div className="mt-4 space-y-2">
                <p className="text-gray-700 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-cyan-500" />
                  {user.email}
                </p>
                <p className="text-gray-700 flex items-center gap-2">
                  {/* Placeholder for Phone icon */}
                  +91 {user.phone}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12">
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-cyan-400 transition">
            <div className="text-3xl font-bold text-pink-500">12</div>
            <p className="text-gray-600 mt-2">Active Listings</p>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-cyan-400 transition">
            <div className="text-3xl font-bold text-cyan-500">8</div>
            <p className="text-gray-600 mt-2">Unread Messages</p>
          </div>
          <div className="bg-white border-2 border-gray-200 rounded-xl p-6 text-center hover:border-cyan-400 transition">
            <div className="text-3xl font-bold text-purple-500">4.8</div>
            <p className="text-gray-600 mt-2">Rating</p>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Add Listing Form */}
          <div className="lg:col-span-2">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <Package className="w-8 h-8 text-cyan-500" />
                Add New Listing
              </h2>

              <form onSubmit={handleAddListing} className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="What are you selling?"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe your item in detail..."
                    rows="4"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-400 focus:outline-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Category</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-400 focus:outline-none"
                    >
                      <option value="">Select Category</option>
                      <option value="books">Books</option>
                      <option value="electronics">Electronics</option>
                      <option value="furniture">Furniture</option>
                      <option value="clothing">Clothing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Price</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      placeholder="₹ 0"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    placeholder="Paste image URL here"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-400 to-cyan-500 text-white font-bold py-3 rounded-lg hover:shadow-lg transition transform hover:scale-105"
                >
                  Post Listing
                </button>
              </form>

              {/* Your Listings */}
              {listings.length > 0 && (
                <div className="mt-12 pt-8 border-t-2 border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Your Listings</h3>
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <div key={listing.id} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900">{listing.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{listing.description}</p>
                            <p className="text-cyan-600 font-bold mt-2">₹ {listing.price}</p>
                          </div>
                          <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold">
                            {listing.category}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Messages */}
          <div className="lg:col-span-1">
            <div className="bg-white border-2 border-gray-200 rounded-2xl p-8 h-fit">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Mail className="w-6 h-6 text-pink-500" />
                Messages
              </h2>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">No messages yet</p>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="border-l-4 border-pink-400 bg-pink-50 p-4 rounded-lg hover:bg-pink-100 transition"
                    >
                      <p className="font-semibold text-gray-900">{msg.from}</p>
                      <p className="text-gray-700 text-sm mt-2">{msg.text}</p>
                      <p className="text-gray-500 text-xs mt-2">{msg.time}</p>
                      <button className="mt-3 flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-semibold text-sm">
                        <Send className="w-4 h-4" />
                        Reply
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* My Listings */}
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
            <Package className="w-8 h-8 text-pink-500" />
            My Listings
          </h2>

          {listings.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No listings yet. Create your first listing above!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-cyan-400 transition"
                >
                  {listing.image && (
                    <img
                      src={listing.image || "/placeholder.svg"}
                      alt={listing.title}
                      className="w-full h-40 object-cover rounded-lg mb-4"
                    />
                  )}
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-bold text-gray-900 text-lg">{listing.title}</h3>
                      <span className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                        {listing.category}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">{listing.description}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                      <p className="text-cyan-600 font-bold text-lg">₹ {listing.price}</p>
                      <div className="flex gap-2">
                        <button
                          className="bg-cyan-50 text-cyan-600 hover:bg-cyan-100 px-3 py-2 rounded-lg font-semibold text-sm transition"
                          onClick={() => handleEditListing(listing.id)}
                        >
                          Edit
                        </button>
                        <button
                          className="bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg font-semibold text-sm transition"
                          onClick={() => handleDeleteListing(listing.id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyProfile