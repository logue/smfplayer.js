/// <reference types="vite/client" />

declare const __APP_VERSION__: string;
declare const __BUILD_DATE__: string;

declare module 'encoding-japanese' {
  type EncodingType =
    | 'AUTO'
    | 'UTF-32'
    | 'UTF-16'
    | 'UTF-16BE'
    | 'UTF-16LE'
    | 'UTF-8'
    | 'UTF-8N'
    | 'JIS'
    | 'EUC-JP'
    | 'SJIS'
    | 'UNICODE'
    | 'ASCII'
    | 'BINARY'
    | 'BUFFER';

  interface ConvertOptions {
    to: EncodingType;
    from?: EncodingType;
    type?: 'string' | 'arraybuffer' | 'array';
    bom?: boolean | string;
  }

  export function convert(
    data: Uint8Array | number[] | string,
    options: ConvertOptions
  ): Uint8Array | ArrayBuffer | string | number[];

  export function detect(
    data: Uint8Array | number[] | string
  ): EncodingType | false;
}
