export * from './Comment';
export * from './Suggestion';
export * from './Api';


declare module '#app' {
    interface NuxtApp {
      $encrypt: (data: string) => string;
      $decrypt: (encrypted: string) => string;
    }
  }
