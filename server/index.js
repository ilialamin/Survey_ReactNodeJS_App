const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./models/Survey');
require('./services/passport');

// Connect to MongoDB with Mongoose at mLab:
mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());
// User Session with cookie
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000, // cookie for 30 days before expire
    keys: [keys.cookieKey] // cookie encryption
  })
);
app.use(passport.initialize());
app.use(passport.session());

// All routes :
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);


if (process.env.NODE_ENV ==='production') {
  // Express will serve up production assets main.js or main.css
  app.use(express.static('client/build'));

  // Express will serve up the index.html
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);
