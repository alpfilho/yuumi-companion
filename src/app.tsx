import React, { useEffect, useState } from "react";
// import { useAtomValue } from "jotai";

// import { selectedRoleAtom } from "./app.atoms";
// import { Player } from "./screens/player";
// import { Yuumi } from "./screens/yuumi";
// import { Home } from "./screens/home";
import { StatusBar } from "./components/statusBar";

export const App = () => {
  const [credentials, setCredentials] = useState<{
    address: string;
    port: number;
    username: string;
    password: string;
    protocol: string;
  }>(null);

  useEffect(() => {
    window.channel.on("league-client-credentials", (event, credentials) => {
      console.log(credentials);
      setCredentials(credentials);
    });
    window.channel.send("front-end-ready");
  }, []);

  useEffect(() => {
    console.log(credentials);
  }, [credentials]);

  return (
    <>
      <button
        onClick={() => {
          console.log("goiaba");
          const url = `${credentials.protocol}://${credentials.address}:${credentials.port}/lol-champ-select/v1/session`;
          console.log("url", url);
          fetch(url, {
            headers: {
              Authorization: `Basic ${btoa(
                credentials.username + ":" + credentials.password
              )}`,
            },
            mode: "cors",
          }).then((data) => {
            data.json().then((data) => {
              console.log(data);
            });
          });
        }}
      >
        Goiaba
      </button>
      <StatusBar />
    </>
  );
};
