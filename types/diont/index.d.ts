export type diontService = {
  name: string;
  host?: string;
  port?: string;
  [key: string]: unknown;
};

export type diontReturn = {
  on(eventName: string, callback: (service: { service: diontService }) => void): string;
  announceService(service: diontService): string;
  renounceService(service: diontService): void | false;
  getServiceInfos(): { [key: string]: diontService };
  repeatAnnouncements(): void;
};

export default function diont(options: { broadcast: boolean }): diontReturn;
