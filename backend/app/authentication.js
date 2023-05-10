//const express = require('express');
//const router = express.Router;
//const jwt = require('jsonwebtoken');

import * as queryString from 'query-string';

const stringifiedParams = queryString.stringify({
  client_id: process.env.CLIENT_ID_GOES_HERE,
  redirect_uri: 'https://prova-i1d6.onrender.com/authenticate/google',
  scope: [
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
  ].join(' '), // space seperated string
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent',
});

const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`;

//module.exports = router;