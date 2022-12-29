import React, { FC, useCallback, useEffect } from "react";
import { useSetAtom } from "jotai";

import { selectedRoleAtom } from "../../app.atoms";

import "./home.css";

export const Home: FC = () => {
  const setSelectedRole = useSetAtom(selectedRoleAtom);

  const onClickYuumi = useCallback(() => {
    setSelectedRole("yuumi");
  }, []);

  const onClickPlayer = useCallback(() => {
    setSelectedRole("player");
  }, []);

  return (
    <div className="home">
      <h1 className="home-title">Selecione uma função:</h1>
      <button className="home-button" onClick={onClickYuumi}>
        Yuumi
      </button>
      <button className="home-button" onClick={onClickPlayer}>
        Player
      </button>
    </div>
  );
};
