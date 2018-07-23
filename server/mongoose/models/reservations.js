const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReservationsSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  numberOfGuests: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  hour: {
    type: String,
    required: true
  },
  tableType: String,
  privateTable: Boolean,
  ocean: Boolean,
  outsideTable: Boolean,
  waitingTime: String,
  favoriteFood: String,
  attendant: String,
  vip: Boolean,
  archived: Boolean
});

const Reservation = mongoose.model('Reservation', ReservationsSchema);
module.exports = Reservation;
