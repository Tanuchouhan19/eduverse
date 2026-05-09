import React, { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addEvent, updateEvent } from '../features/admin/adminSlice';

const AddEvent = (changeTab) => {
      
      const{edit} = useSelector(state => state.admin)

       const dispatch = useDispatch()
       const navigate = useNavigate()


    // add event form data
       const [formData, setFormData] = useState({
        eventName: "",
        eventDescription: "",
        eventDate: "",
        eventImage: "",
        status: "upcoming",
        location: "",
        availableSeats: "",
        organizer: "",
        prize: "",
      });
    
      const {eventName, eventDescription, eventDate, eventImage, status, location, availableSeats, organizer, prize} = formData
    
      const handleChange = (e) => {
        setFormData((prev)=>{
          return {
            ...prev,
            [e.target.name]: e.target.value
          }
        })
      }
    
      const handleAddEvent= (e) => {
        e.preventDefault()
        !edit.isEdit ? dispatch(addEvent(formData)) : dispatch(updateEvent(formData))
        navigate("/auth/events")
      }

      useEffect(()=>{
          setFormData(edit.event)
      },[edit])
      
  return (
    <div className="space-y-4 ">
      <div className="flex justify-between items-center mb-6 ">
        <h3 className="text-3xl font-black  text-slate-900 ">
          Add Events
        </h3>
      </div>
              <p>Add New Events Here</p>
                                                                  
              <form onSubmit={handleAddEvent} className="border border-gray-200 rounded-md w-full px-5 py-5">
                <input name="eventName" value={eventName} onChange={handleChange}  className="my-1 border border-gray-300 rounded-md p-1.5 w-full "  type="text" placeholder="Enter Event Tittle"/>
                <textarea name="eventDescription" value={eventDescription}  onChange={handleChange} className="my-1  border border-gray-300 rounded-md p-1.5 w-full " type = "text" placeholder="Enter Event Description"/>
                <input  name="eventDate" value={eventDate}   onChange={handleChange} className=" my-1 border border-gray-300 rounded-md p-1.5 w-full " type="date" placeholder="Enter Event Date"></input>
                <input name="eventImage" value={eventImage}  onChange={handleChange} className="my-1 border border-gray-300 rounded-md p-1.5 w-full " type="url" placeholder="Enter Event Image URL"></input>
                <select name="status" value={status} onChange={handleChange} className="my-1 border border-gray-300 rounded-md p-1.5 w-full ">
                  <option value="upcoming">Upcoming</option>
                  <option value="completed">completed</option>
                  <option value="ongoing">ongoing</option>
                  <option value="postponed">postponed</option>

                </select>
                <input name="location" value={location} onChange={handleChange} className=" my-1 border border-gray-300 rounded-md p-1.5 w-full " type="text" placeholder="Enter Event Location"/>
                <input name="availableSeats" value={availableSeats}  onChange={handleChange} className="my-1 border border-gray-300 rounded-md p-1.5 w-full " type="number" placeholder="Enter Events Available Seats"/>
                <input name="organizer" value={organizer}  onChange={handleChange}  className="my-1 border border-gray-300 rounded-md p-1.5 w-full " type="text" placeholder="Enter Event Organizer"/>
                <input name="prize" value={prize} onChange={handleChange} className="my-1 border border-gray-300 rounded-md p-1.5 w-full " type="number" placeholder="Enter Event Ticket Price "/>
                <button 
                  className=" my-1 w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-400 to-cyan-500 text-white rounded-lg hover:shadow-lg hover:shadow-cyan-500/50 transition-all font-medium"
                > {edit.isEdit ? "Update Event" : "Add Event" }
                  <Plus size={20}/> 
                </button>

              </form>
    </div>
  )
}

export default AddEvent
