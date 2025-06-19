const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  name: String,
  email: String,
  travelDate: String,
  numDays: Number,
  numPeople: Number,
  mealType: String,
  tripType: String,
  stayType: String,
  message: String,
  paymentMethod: String,
  destination: String,
  totalCost: Number
});

module.exports = mongoose.model('Booking', bookingSchema);
