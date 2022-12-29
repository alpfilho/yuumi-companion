import { useSetAtom } from "jotai";
import React, { FC, useCallback, useEffect, useState } from "react";

import { selectedRoleAtom } from "../../app.atoms";

export const Yuumi: FC = () => {
  const setSelectedRole = useSetAtom(selectedRoleAtom);
  const [isConnected, setIsConnected] = useState(false);

  const onClickBack = useCallback(() => {
    setSelectedRole(undefined);
  }, []);

  useEffect(() => {
    window.yuumiCompanion.start();

    return () => {
      window.yuumiCompanion.stop();
    };
  }, []);

  return (
    <>
      <button onClick={onClickBack}>{"<"} Voltar</button>
      <h1>Yuumi</h1>
      {isConnected ? "Jogador" : "Jogador não conectado"}
    </>
  );
};
