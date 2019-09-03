declare module 'post-robot' {
  // Warning: This is not actually a Promise, but the interface is the same.
  type ZalgoPromise<T> = Promise<T>;

  // For our purposes, Window is cross domain enough. For now at least.
  type CrossDomainWindowType = Window;
  type WindowResolverType = CrossDomainWindowType | string | HTMLIFrameElement;

  // Client
  // Loosely based on: https://github.com/krakenjs/post-robot/blob/master/src/public/client.js
  interface RequestOptionsType {
    window?: WindowResolverType;
    domain?: string | string[] | RegExp;
    name?: string;
    data?: object;
    fireAndForget?: boolean;
    timeout?: number;
  }
  interface ResponseMessageEvent {
    source: CrossDomainWindowType;
    origin: string;
    data: any;
  }
  interface Sendable {
    send: (name: string, data?: object) => ZalgoPromise<ResponseMessageEvent>;
  }

  // Server
  // Loosely based on: https://github.com/krakenjs/post-robot/blob/master/src/public/server.js
  type ErrorHandlerType = (err: any) => void;
  interface HandlerInput {
    source: Window;
    origin: string;
    data: object;
  }
  type HandlerType = (props: HandlerInput) => void | any | ZalgoPromise<any>;

  interface ServerOptionsType {
    handler?: HandlerType;
    errorHandler?: ErrorHandlerType;
    window?: CrossDomainWindowType;
    name?: string;
    domain?: string | RegExp | string[];
    once?: boolean;
    errorOnClose?: boolean;
  }

  interface Cancellable { cancel: () => void; }

  const postRobot: {
    send(
      window: WindowResolverType,
      name: string,
      data?: object,
      options?: any,
    ): ZalgoPromise<ResponseMessageEvent>;

    client(options?: RequestOptionsType): Sendable;

    listener(
      options?: ServerOptionsType,
    ): { on: (name: string, handler: HandlerType) => Cancellable };

    listen(options: ServerOptionsType): Cancellable;

    on(
      name: string,
      options: ServerOptionsType | HandlerType,
      handler?: HandlerType,
    ): Cancellable;
  };
  export default postRobot;
}
