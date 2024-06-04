import mongoose from "mongoose"

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String },
  startDateTime: { type: Date, default: Date.now },
  endDateTime: { type: Date, default: Date.now },
  price: { type: String },
  isFree: { type: Boolean, default: false },
  url: { type: String },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
  organizer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
})

const Event = mongoose.models.Event || mongoose.model("Event", eventSchema)

export default Event
