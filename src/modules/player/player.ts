import psList from "ps-list";
import { GetGameState } from "../getGameState";

export function Player() {
  const player = this;

  player.start = async () => {
    GetGameState.start();

    const processes = await psList();
    console.log(processes);
  };

  player.stop = () => {
    GetGameState.stop();
  };
}
