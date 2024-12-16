// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly API_URL: string;
  readonly DEBUG: boolean;
  readonly APP_ENV: 'development' | 'production';
  readonly DEV_EMAIL_TO: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
