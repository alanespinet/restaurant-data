const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const mongoose = require('./mongoose/mongoose');
const Reservation = require('./mongoose/models/reservations');
const Subscriber = require('./mongoose/models/subscriber');
const User = require('./mongoose/models/users');
const bcrypt = require('bcrypt-nodejs');

const { catchError } = require('../utils/general');

const app = express();
const port = process.env.PORT || 3090;

// middlewares
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use( bodyParser.json() );
app.use( cors() );

// requests
app.get('/', (req, res, next) => {
  res.send('App is running');
});

// GET requests
app.get('/reservations', (req, res, next) => {
  Reservation.find()
    .then( response => res.send(response) )
    .catch( catchError );
});

// POST requests
app.post('/reservation', (req, res, next) => {
  const reservation = new Reservation({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    phone: req.body.phone,
    numberOfGuests: req.body.numberOfGuests,
    date: req.body.date,
    hour: req.body.hour,
    tableType: req.body.tableType !== '' ? req.body.tableType : 'square',
    privateTable: req.body.privateTable === 'yes',
    ocean: req.body.ocean === 'yes',
    outsideTable: req.body.outsideTable === 'outside',
    waitingTime: req.body.waitingTime !== '' ? req.body.waitingTime : 'open',
    favoriteFood: req.body.favoriteFood !== '' ? req.body.favoriteFood : 'no_preference',
    attendant: req.body.attendant !== '' ? req.body.attendant : 'no_preference',
    vip: req.body.vip === 'yes',
    archived: req.body.archived
  });

  reservation.save()
    .then( single => res.send(single) )
    .catch( error => res.end() );
});

app.post('/subscribe', (req, res, next) => {
  const subscriber = new Subscriber({
    email: req.body.email
  });

  subscriber.save()
  .then( single => res.send(single) )
  .catch( error => res.send('error') );
});


// UPDATE REQUESTS

app.post('/update/archiveres/:id', (req, res, next) => {
  const id = req.params.id;
  Reservation.findByIdAndUpdate(id, { archived: true })
    .then(result => { res.send(result) })
    .catch(error => { res.send('error') })
});

app.post('/update/unarchiveres/:id', (req, res, next) => {
  const id = req.params.id;
  Reservation.findByIdAndUpdate(id, { archived: false })
    .then(result => { res.send(result) })
    .catch(error => { res.send('error') })
});

app.post('/update/unarchiveall', (req, res, next) => {
  Reservation.update({}, {archived: false}, {multi: true})
  .then(result => { res.send('all records were unarchived') })
  .catch(error => { res.send('error') })
});

// DELETE REQUESTS

app.post('/delete/cancelres/:id', (req, res, next) => {
  const id = req.params.id;
  Reservation.findByIdAndRemove(id)
    .then(result => { res.send(result) })
    .catch(error => { res.send('error') })
});

// AUTHENTICATION REQUESTS
app.post('/signin', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if( !username || !password ){
    return res.send('Error: Missing Values');
  }

  User.findOne({ username: username })
  .then( existingUser => {
    if( existingUser ){
      return res.send('Error: User in Use');
    }

    const user = new User({
      username: username,
      password: password
    });

    user.save()
      .then( response => res.send( response ) )
      .catch( err => res.send( 'Error: Undefined' ) );
  });
});


app.post('/login', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if( !username || !password ){
    return res.send('Error: Missing Values');
  }

  User.findOne({ username: username })
    .then( existingUser => {
      if( !existingUser ){
        return res.send('Error: No User Found');
      }

      existingUser.comparePassword(password, (err, isMatch) => {
        if(isMatch) {
          res.send('Authenticated');
        } else {
          res.send('Non Authenticated');
        }
      });
    });
});




// LISTEN action
app.listen(port, () => { console.log('app running'); });
