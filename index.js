const express = require("express");
const { google } = require("googleapis");
const dotenv = require("dotenv");
//service account credentials
const cal_secrets = require("./cal_secrets.json");
const app = express();
dotenv.config();
const SCOPES = "https://www.googleapis.com/auth/calendar.readonly";
const GOOGLE_CLIENT_EMAIL = cal_secrets.client_email;
const GOOGLE_PRIVATE_KEY = cal_secrets.private_key;
const GOOGLE_PROJECT_NUMBER = process.env.GOOGLE_PROJECT_NUMBER;

const jwtClient = new google.auth.JWT(
  GOOGLE_CLIENT_EMAIL,
  null,
  GOOGLE_PRIVATE_KEY,
  SCOPES
);

const calendar = google.calendar({
  version: "v3",
  project: GOOGLE_PROJECT_NUMBER,
  auth: jwtClient,
});

app.get("/freebusy/intervals", (req, res) => {
  let timeMin = req.query.timeMin;
  let timeMax = req.query.timeMax;
  let calendarId = req.query.calendarId;
  calendar.freebusy.query(
    {
      resource: {
        timeMin: timeMin,
        timeMax: timeMax,
        items: [{ id: calendarId }],
      },
    },
    (error, result) => {
      if (error) {
        console.log("first", error);
        res.send({ error: error });
      } else {
        res.send(result.data);
      }
    }
  );
});
app.listen(3000, () => console.log(`App listening on port 3000!`));
