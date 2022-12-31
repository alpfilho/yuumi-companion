export type diontService = {
  name: string;
  host?: string;
  port?: string;
  [key: string]: unknown;
};

export default function diont(): {
  on(eventName: string, callback: (service: diontService) => void): string;
  announceService(service: diontService): string;
  renounceService(service: diontService): void | false;
  getServiceInfos(): void;
};
