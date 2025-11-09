/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STORE_NAME: string;
  readonly VITE_STORE_PHONE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
