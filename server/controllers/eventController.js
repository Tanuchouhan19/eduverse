const Event = require("../models/eventModel")


const getEvents = async (req,res) => {
  const events = await Event.find();
   if (!events) {
      res.status(404);
      throw new Error("Events Not Found ");
   }
   res.status(200).json(events);
}

const getEvent = async (req,res) => {
const event = await Event.findById(req.params.eid);
   if (!event) {
      res.status(404);
      throw new Error("Event Not Found ");
   }
   res.status(200).json(event);}


module.exports = {getEvent ,getEvents}