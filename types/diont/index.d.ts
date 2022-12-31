export type diontService = {
  name: string;
  host?: string;
  port?: string;
  [key: string]: unknown;
};

export default function diont(options: { broadcast: boolean }): {
  on(eventName: string, callback: (service: diontService) => void): string;
  announceService(service: diontService): string;
  renounceService(service: diontService): void | false;
  getServiceInfos(): { [key: string]: diontService };
  repeatAnnouncements(): void;
};
