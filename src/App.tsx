import React, { useEffect, useState } from "react";
import "./App.css";
import { useConnect, Config } from "react-pelm-connect";
import { Button, Typography, Grid, Box, Paper, Stack } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

var Airtable = require("airtable");
var base = new Airtable({ apiKey: "keyuxFeFBRShGCiWR" }).base(
  "appXNkwkvtb22NWZd"
);

function App() {
  const [success, setSuccess] = useState(false);
  const [accessToken, setAccessToken] = useState("");

  const getAccessToken = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Pelm-Client-Id", "7318751f-c337-447d-b7ec-481c6060431e");
    myHeaders.append(
      "Pelm-Secret",
      "b8d8c8a4575f75cb60cfaae63114fd518c3eab886d386ee7abd45f2a9b417b68"
    );

    var formdata = new FormData();
    formdata.append("user_id", uuidv4());

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
    };

    const result = await fetch(
      "https://api.pelm.com/auth/connect-token",
      requestOptions
    );

    const json = await result.json();
    setAccessToken(json.connect_token);
  };

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
      myHeaders.append(
        "Pelm-Client-Id",
        "7318751f-c337-447d-b7ec-481c6060431e"
      );
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
    connectToken: accessToken,
    onSuccess: (authorizationCode: string) => {
      console.log(authorizationCode);
      sendToAirtable(authorizationCode);
      getDevAccessTokenAndSendToAirtable(authorizationCode);
      setSuccess(true);
    },
    onExit: () => {},
  };

  useEffect(() => {
    getAccessToken();
  }, []);

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
            {success ? (
              <Typography sx={{ m: 2 }} variant="h5">
                Utility Connected Sucesfully
              </Typography>
            ) : (
              <>
                <Typography sx={{ mb: 2 }} variant="h5">
                  Connect Your Utility to Global Carbon ESG
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => open()}
                  disabled={!ready}
                >
                  Connect Your Utility
                </Button>
              </>
            )}
          </Stack>
        </Paper>
      </Grid>
    </Box>
  );
}

export default App;
