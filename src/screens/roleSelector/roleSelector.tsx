import React, { FC, useCallback } from "react";

import "./roleSelector.css";

const { app } = window;

export const RoleSelector: FC = () => {
  const onClickPlayer = useCallback(() => {
    app.send("mainFrontEnd:changeRole", "player");
  }, []);

  const onClickYuumi = useCallback(() => {
    app.send("mainFrontEnd:changeRole", "yuumi");
  }, []);

  return (
    <div className="role-selector">
      <div className="role-selector-header">
        <span className="body2">Selecione a função deste computador:</span>
      </div>

      <div className="role-selector-options">
        <div className="role-option">
          <button type="button" className="role-button" onClick={onClickPlayer}>
            <h1 className="head1">
              <span className="emote">👍</span> Jogador Humano
            </h1>
          </button>
        </div>
        <div className="role-option">
          <button type="button" className="role-button" onClick={onClickYuumi}>
            <h1 className="head1">
              <span className="emote">🤖</span> Bot Yuumi
            </h1>
          </button>
        </div>
      </div>
    </div>
  );
};
