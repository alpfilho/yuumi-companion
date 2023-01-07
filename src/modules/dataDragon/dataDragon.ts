import fetch from "node-fetch";

export type ChampionData = {
  version: string;
  id: string;
  key: string;
  name: string;
  image: {
    full: string;
    sprite: string;
    group: string;
    x: number;
    y: number;
    w: number;
    h: number;
  };
  stats: {
    hp: number;
    hpperlevel: number;
    mp: number;
    mpperlevel: number;
    movespeed: number;
    armor: number;
    armorperlevel: number;
    spellblock: number;
    spellblockperlevel: number;
    attackrange: number;
    hpregen: number;
    hpregenperlevel: number;
    mpregen: number;
    mpregenperlevel: number;
    crit: number;
    critperlevel: number;
    attackdamage: number;
    attackdamageperlevel: number;
    attackspeedperlevel: number;
    attackspeed: number;
  };
};

export class DataDragon {
  private cdnPath = "https://ddragon.leagueoflegends.com";
  private version = "12.23.1";
  private champions: { [champ: string]: ChampionData } = null;

  constructor() {
    this.start();
  }

  async start() {
    const { v } = await fetch(`${this.cdnPath}/realms/br.json`).then((response) =>
      response.json().then(
        (data) =>
          data as {
            n: {
              item: string;
              rune: string;
              mastery: string;
              summoner: string;
              champion: string;
              profileicon: string;
              map: string;
              language: string;
              sticker: string;
            };
            v: string;
            l: "pt_BR";
            cdn: string;
            dd: string;
            lg: string;
            css: string;
            profileiconmax: number;
          }
      )
    );

    this.version = v;

    const { data } = await fetch(`${this.cdnPath}/cdn/${this.version}/data/pt_BR/champion.json`).then((response) =>
      response.json().then((data) => data as { data: { [champ: string]: ChampionData } })
    );

    this.champions = data;
  }

  public getProfilePath(id: number) {
    return `${this.cdnPath}/cdn/${this.version}/img/profileicon/${id}.png`;
  }

  public getChampList() {
    return this.champions;
  }
}
