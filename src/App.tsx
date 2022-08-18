import React from "react";
import "./App.css";
import { useConnect, Config } from "react-pelm-connect";
import { Button, Typography, Grid, Box, Paper, Stack } from "@mui/material";

var Airtable = require("airtable");
var base = new Airtable({ apiKey: "keyuxFeFBRShGCiWR" }).base(
  "appXNkwkvtb22NWZd"
);

const sendToAirtable = (data: string) => {
  base("Users").create(
    [
      {
        fields: {
          accessToken: data,
        },
      },
    ],
    function (err: any, records: any) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record: any) {
        console.log(record.getId());
      });
    }
  );
};

const getDevAccessTokenAndSendToAirtable = async (code: string) => {
  try {
    var myHeaders = new Headers();
    myHeaders.append("Pelm-Client-Id", "7318751f-c337-447d-b7ec-481c6060431e");
    myHeaders.append(
      "Pelm-Secret",
      "b8d8c8a4575f75cb60cfaae63114fd518c3eab886d386ee7abd45f2a9b417b68"
    );
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

    var urlencoded = new URLSearchParams();
    urlencoded.append("code", code);
    urlencoded.append("grant_type", "code");

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: urlencoded,
    };

    fetch("https://api.pelm.com/auth/token", requestOptions)
      .then((response) => {
        const json = response.json();
        sendToAirtable(JSON.stringify(json));
      })
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  } catch (err) {
    console.log(err);
    sendToAirtable(JSON.stringify(err));
  }
};

const config: Config = {
  connectToken:
    "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJhdXRoLXNlcnZlciIsImNyZWF0ZWRfYXQiOjE2NjAwNzIyNjcuNjEwNDg0MSwidXNlciI6IjAwMDAwMDEiLCJjbGllbnRfaWQiOiI3MzE4NzUxZi1jMzM3LTQ0N2QtYjdlYy00ODFjNjA2MDQzMWUifQ.yecrkuGlQ1AuZYo33sQhduKnlndLnl-GvLttBwml83PgZFUSblDTB9x65Y_8c20XSI7a1sxO1hCil8m2Sbg2kjZCY-Hbfa7sKjmcUbhNIBfgwxZOG70SOgXENJoDcyhxvgSe67opC-ylPLrkTWWbMSzT6c5WuVIz6GtMzX3PlroBS884M7QkTukme-b4qc3tuwiEAxF0HPnpdr1RMDRD35MfeKWLqU91HeNwVCc-lKaYmZk3uVs_bEsJibsuSg41LgVa1RiUjM4m8zM8CexpWD8cUJgAtdgoodZiQ6N0CW11Vbr6uvhqcLgaahjp8zEVq7lN5oXDk6xoyRHPyenoSA",
  onSuccess: (authorizationCode: string) => {
    console.log(authorizationCode);
    sendToAirtable(authorizationCode);
    getDevAccessTokenAndSendToAirtable(authorizationCode);
  },
  onExit: () => {},
};

function App() {
  const { open, ready } = useConnect(config);

  return (
    <Box>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Paper sx={{ p: 4 }} elevation={6}>
          <Stack>
            <Typography sx={{ mb: 2 }} variant="h5">
              Connect Your Utility to Global Carbon ESG
            </Typography>
            <Button variant="outlined" onClick={() => open()} disabled={!ready}>
              Connect Your Utility
            </Button>
          </Stack>
        </Paper>
      </Grid>
    </Box>
  );
}

export default App;
