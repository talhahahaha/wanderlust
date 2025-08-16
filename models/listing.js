const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description:{
    type: String,
  },
  image: {
    type: String,
    default:"https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60",
    set: (v) => v===""? "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aG90ZWxzfGVufDB8fDB8fHww&auto=format&fit=crop&w=800&q=60" : v,
  },
  // image: {
  // filename: {
  //   type: String,
  //   default: "listingimage"
  // },
  // url: {
  //   type: String,
  //   default: "https://image.unsplash.com/photos/sunset-shines-through-the-manhattan-bridge-gPaakkcpSFI",
  //   set: (v) =>
  //     v === ""
  //       ? "https://imageunsplash.com/photos/sunset-shines-through-the-manhattan-bridge-gPaakkcpSFI"
  //       : v,
  // }
//},
  price: Number,
  location: String,
  country: String,
}); 

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing; // models/listing.js



