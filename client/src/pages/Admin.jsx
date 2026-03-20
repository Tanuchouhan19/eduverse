"use client";

import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Users,
  ShoppingBag,
  Calendar,
  BarChart3,
  Edit2,
  Trash2,
  Plus,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllEvents,
  getAllListings,
  getAllUsers,
  updateListing,
  updateUser,
} from "../features/admin/adminSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";

const Admin = () => {
  const { user } = useSelector((state) => state.auth);
  const {
    allUsers,
    allEvents,
    allListings,
    adminLoading,
    adminSuccess,
    adminError,
    adminErrorMessage,
  } = useSelector((state) => state.admin);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);

  useEffect(() => {
    if (!user.isAdmin) {
      navigate("/myprofile");
    }

    // fetch users
    dispatch(getAllUsers());
    // fetch events
    dispatch(getAllEvents());
    // dispatch Listing
    dispatch(getAllListings());

    if (adminError && adminErrorMessage) {
      toast.error(adminErrorMessage, { position: "top-center" });
    }
  }, [user, adminError, adminErrorMessage]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState(null);

  const [users, setUsers] = useState([
    {
      _id: 1,
      name: "Sukh Paji",
      email: "sukh@eduverse.com",
      phone: "9876543210",
      joinDate: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "Priya Singh",
      email: "priya@eduverse.com",
      phone: "9876543211",
      joinDate: "2024-02-10",
      status: "active",
    },
    {
      id: 3,
      name: "Rahul Kumar",
      email: "rahul@eduverse.com",
      phone: "9876543212",
      joinDate: "2024-03-05",
      status: "inactive",
    },
    {
      id: 4,
      name: "Ananya Sharma",
      email: "ananya@eduverse.com",
      phone: "9876543213",
      joinDate: "2024-01-20",
      status: "active",
    },
  ]);

  const [listings, setListings] = useState([
    {
      id: 1,
      title: "Mathematics Textbook",
      seller: "Sukh Paji",
      price: "450",
      category: "books",
      status: "active",
      posted: "2024-01-10",
    },
    {
      id: 2,
      title: "Gaming Laptop",
      seller: "Priya Singh",
      price: "45000",
      category: "electronics",
      status: "active",
      posted: "2024-01-12",
    },
    {
      id: 3,
      title: "Study Desk",
      seller: "Rahul Kumar",
      price: "5500",
      category: "furniture",
      status: "sold",
      posted: "2024-01-08",
    },
    {
      id: 4,
      title: "Winter Jacket",
      seller: "Ananya Sharma",
      price: "1200",
      category: "clothing",
      status: "active",
      posted: "2024-01-15",
    },
  ]);

  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Campus Fest 2024",
      date: "2024-03-15",
      location: "Main Auditorium",
      description: "Annual college festival with competitions and performances",
      attendees: 234,
      comments: [
        {
          user: "Sukh Paji",
          text: "Looking forward to this!",
          time: "2 hours ago",
        },
        {
          user: "Priya Singh",
          text: "Will there be food stalls?",
          time: "1 hour ago",
        },
      ],
    },
    {
      id: 2,
      title: "Sports Day",
      date: "2024-03-20",
      location: "Sports Ground",
      description: "Inter-college sports competition",
      attendees: 156,
      comments: [
        {
          user: "Rahul Kumar",
          text: "Sign me up for cricket!",
          time: "3 hours ago",
        },
      ],
    },
    {
      id: 3,
      title: "Tech Talk - AI Workshop",
      date: "2024-03-25",
      location: "Computer Lab",
      description: "Workshop on AI and Machine Learning",
      attendees: 89,
      comments: [
        {
          user: "Ananya Sharma",
          text: "Is this free for all students?",
          time: "5 hours ago",
        },
        {
          user: "Sukh Paji",
          text: "Great opportunity to learn!",
          time: "4 hours ago",
        },
      ],
    },
  ]);

  if (adminLoading) {
    return <Loader />;
  }

  const stats = [
    {
      label: "Active Users",
      value: allUsers?.length,
      icon: Users,
      color: "from-cyan-400 to-blue-500",
    },
    {
      label: "Active Listings",
      value: allListings?.length,
      icon: ShoppingBag,
      color: "from-pink-400 to-rose-500",
    },
    {
      label: "Total Events",
      value: allEvents?.length,
      icon: Calendar,
      color: "from-purple-400 to-pink-500",
    },
    // { label: 'Total Revenue', value: '₹2.5L', icon: BarChart3, color: 'from-orange-400 to-red-500' },
  ];

  // const addEvent = ()=> {
  //   return (
  //     <div className="space-y-4">
  //             <div className="flex justify-between items-center mb-6">
  //               <h3 className="text-xl font-bold text-gray-800">
  //                 Add Event
  //               </h3>
  //               <button
  //                 onClick={() => setShowUserModal(true)}
  //                 className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-medium"
  //               >
  //                 <Plus size={20} /> Add New Events Here
  //               </button>
  //             </div>

              
  //           </div>
  //   )
  // } 

  return (
    <div className="flex h-screen bg-gray-50 py-20">
      {/* Sidebar */}
      <div
        className={`${sidebarOpen ? "w-64" : "w-20"} bg-white border-r border-gray-200 transition-all duration-300 shadow-sm`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-pink-500">
              EduVerse
            </h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8 space-y-2 px-3">
          {[
            { id: "dashboard", label: "Dashboard", icon: BarChart3 },
            { id: "users", label: "Users", icon: Users },
            { id: "listings", label: "Listings", icon: ShoppingBag },
            { id: "events", label: "Events", icon: Calendar },
            { id: "add", label: "Add Events", icon: Calendar },

          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeTab === item.id
                ? "bg-gradient-to-r from-cyan-400 to-pink-400 text-white shadow-lg shadow-cyan-500/50"
                : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              <item.icon size={20} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center shadow-sm">
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500"></p>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-400 to-pink-400"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-gray-500 text-sm mb-2">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-gray-800">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}
                      >
                        <stat.icon size={24} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">
                    Recent Users
                  </h3>
                  <div className="space-y-3">
                    {allUsers.slice(0, 3).map((user) => (
                      <div
                        key={user._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-800">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-700">
                          {user.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <h3 className="text-lg font-bold mb-4 text-gray-800">
                    Active Listings
                  </h3>
                  <div className="space-y-3">
                    {allListings.slice(0, 3).map((listing) => (
                      <div
                        key={listing._id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center">
                          <img
                            className="w-15 h-15 rounded-sm  p-2 pl-2"
                            src={listing.itemImage}
                          ></img>
                          <p className="font-medium text-gray-800">
                            {listing.title}
                          </p>
                        </div>
                        <p className="font-bold text-pink-500">
                          ₹{listing.prize}
                        </p>
                        <p className="font-small text-gray-500">
                          {new Date(listing.createdAt).toLocaleDateString(
                            "en-In",
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}



          {/* Users Management Tab */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Manage Users
                </h3>
                <button
                  onClick={() => setShowUserModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-medium"
                >
                  <Plus size={20} /> Add User
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Phone
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 ">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {allUsers.map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                          {user.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {user.phone}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${user.isActive === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}
                          >
                            {user.isActive}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2">
                          <button
                            onClick={() =>
                              dispatch(
                                updateUser({
                                  _id: user._id,
                                  isActive: user.isActive ? false : true,
                                }),
                              )
                            }
                            className={
                              user.isActive
                                ? " cursor-pointer p-2 hover:bg-red-100 rounded-lg text-red-800 transition-colors bg-red-300"
                                : " cursor-pointer  p-2 hover:bg-green-100 bg-green-300 rounded-lg text-green-800 transition-colors"
                            }
                          >
                            {user.isActive
                              ? "Deactivate Account"
                              : "Activate Account"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}


          {/* ADD EVENT  */}
  {activeTab === "add" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6 ">
                <h3 className="text-3xl font-black  text-slate-900 ">
                  Add Events
                </h3>
                
                <button
                  onClick={() => setShowUserModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-medium"
                >
                  <Plus size={20} /> 
                </button>
              </div>
              <p>Add New Events Here</p>
              
              <form className="border border-gray-300 p-4 py-4 rounded-md">
                <input className="border border-gray-300 rounded-md p-1.5 w-full "  type="text" placeholder="Enter Event Tittle"/>
                <textarea className="border border-gray-300 rounded-md p-1.5 w-full " type = "text" placeholder="Enter Event Description"/>
                <input className="border border-gray-300 rounded-md p-1.5 w-full " type="date" placeholder="Enter Event Date"></input>
                <input className="border border-gray-300 rounded-md p-1.5 w-full " type="date" placeholder="Enter Event Image URL"></input>
                <select className="border border-gray-300 rounded-md p-1.5 w-full ">
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">completed</option>
                  <option value="ongoing">ongoing</option>
                  <option value="postponed">postponed</option>

                </select>
                <input className="border border-gray-300 rounded-md p-1.5 w-full " type="text" placeholder="Enter Event Location"/>
                <input className="border border-gray-300 rounded-md p-1.5 w-full " type="number" placeholder="Enter Events Available Seats"/>
                <input className="border border-gray-300 rounded-md p-1.5 w-full " type="text" placeholder="Enter Event Organizer"/>
                <input className="border border-gray-300 rounded-md p-1.5 w-full " type="number" placeholder="Enter Event Ticket Price "/>


              </form>
              
            </div>
          )}
          {/* ------ */}

          {/* Listings Management Tab */}
          {activeTab === "listings" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Manage Listings
                </h3>
              </div>

              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Image
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Title
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Seller
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Price
                      </th>
                      {/* <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Category</th> */}
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="">
                    {allListings.map((listing) => (
                      <tr
                        key={listing._id}
                        className={
                          listing.isAvailable
                            ? "border-b border-gray-200 hover:bg-gray-50 transition-colors"
                            : "border-b border-gray-200 hover:bg-gray-400 bg-gray-300 transition-colors  "
                        }
                      >
                        <td className="px-4 py-3">
                          <img
                            className="w-16 h-16 rounded-md object-cover"
                            src={listing.itemImage}
                            alt={listing.title}
                          />
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                          {listing.title}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {listing.user.name}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-pink-500">
                          ₹{listing.prize}
                        </td>
                        {/* <td className="px-6 py-4 text-sm text-gray-600 capitalize">{listing.category}</td> */}
                        <td className="px-6 py-4 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${listing.createdAt === "active" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
                          >
                            {formatDate(listing.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm flex gap-2 flex ">
                          <button
                            onClick={() => {
                              setSelectedListing(listing);
                              setShowEditModal(true);
                            }}
                            className="mt-3 p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors "
                          >
                            <Edit2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          

          {/* Events Management Tab */}
          {activeTab === "events" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">
                  Manage Events
                </h3>
                <button
                  onClick={() => setShowEventModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-400 to-pink-500 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all font-medium"
                >
                  <Plus size={20} /> Add Event
                </button>
              </div>

              <div className="space-y-4">
                {allEvents.map((event) => (
                  <div
                    key={event._id}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                  >
                    <button
                      onClick={() =>
                        setExpandedEvent(
                          expandedEvent === event._id ? null : event.id,
                        )
                      }
                      className="w-full p-6 flex items-start justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="text-left">
                        <img
                          className="w-full h-40 object-cover pb-2"
                          src={event.eventImage}
                        ></img>
                        <h4 className="text-lg font-bold text-gray-800">
                          {event.eventName}
                        </h4>
                        <p className="text-sm text-gray-600 mt-2">
                          📍 {event.location} • 📅 {event.eventDate}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          👥 {event.availableSeats}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors">
                          <Edit2 size={18} />
                        </button>
                        <button className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors">
                          <Trash2 size={18} />
                        </button>
                        <ChevronDown
                          className={`transition-transform ${expandedEvent === event.id ? "rotate-180" : ""}`}
                          size={20}
                        />
                      </div>
                    </button>

                    {expandedEvent === event.id && (
                      <div className="border-t border-gray-200 p-6 bg-gray-50">
                        <div className="mb-6">
                          <p className="text-sm text-gray-700 mb-2">
                            <span className="font-bold">Description:</span>{" "}
                            {event.eventDescription}
                          </p>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                          <h5 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <MessageCircle size={18} /> Comments (
                            {event.comments.length})
                          </h5>
                          <div className="space-y-4">
                            {allEvents.comments.map((comment, idx) => (
                              <div
                                key={idx}
                                className="bg-white p-4 rounded-lg border border-gray-200"
                              >
                                <div className="flex items-start justify-between">
                                  <div>
                                    <p className="font-medium text-gray-800">
                                      {comment.user}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {comment.text}
                                    </p>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {comment.time}
                                  </p>
                                </div>
                                <div className="flex gap-2 mt-3">
                                  <button className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                    Approve
                                  </button>
                                  <button className="text-xs text-red-600 hover:text-red-700 font-medium">
                                    Delete
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}

                    
                  </div>
                ))}
              </div>
            </div>
          )}

       </div>
      </div>
      {showEditModal && selectedListing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[400px] p-6 relative">
            {/* Close Button */}
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              <X size={20} />
            </button>

            <h2 className="text-lg font-bold mb-2">Edit Product</h2>

            <h3 className="text-xl font-semibold">{selectedListing.title}</h3>

            <p className="text-sm text-gray-600 mt-2">
              Listed By : {selectedListing.user?.name}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              Note: Admin can only make product available or unavailable
            </p>

            <div className="flex gap-4 mt-6">
              <button
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 rounded-lg font-medium hover:opacity-90"
                onClick={() => {
                  dispatch(
                    updateListing({
                      isAvailable: selectedListing.isAvailable ? false : true,
                      _id: selectedListing._id,
                    }),
                  );
                  setShowEditModal(null);
                }}
              >
                {selectedListing.isAvailable
                  ? "Make it Unavailable"
                  : "Make it Available"}
              </button>

              <button
                onClick={() => setShowEditModal(null)}
                className="flex-1 border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
