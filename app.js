require('dotenv').config(); 

const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const ejs = require('ejs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const fromPhone = process.env.FROM_TWILIO_PHONE;

const client = new twilio(accountSid, authToken);

app.get('/', (req, res) => {
  res.render('index', { messageSent: false, errorMessage: '' });
});

app.post('/send-sms', (req, res) => {
  const to = req.body.to;
  const body = req.body.body;

  client.messages
    .create({
      from: fromPhone, 
      to: to,
      body: body,
    })
    .then((message) => {
      res.render('index', { messageSent: true, messageSentSid: message.sid, errorMessage: '' });
    })
    .catch((err) => {
      res.render('index', { messageSent: false, errorMessage: err.message });
    });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
