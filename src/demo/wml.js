import S3Client from 'aws-sdk/clients/s3';
import SoundFont from '@logue/sf2synth';

const wml = new SoundFont.WebMidiLink();
document.getElementById('build').innerText = wml.build;

let url = './MSXspirit.sf2';
if (import.meta.env.VITE_SOUNDFONT_URL) {
  url = import.meta.env.VITE_SOUNDFONT_URL;
} else if (import.meta.env.VITE_S3_BUCKET_NAME) {
  // Fetch from Amazon S3, Cloudflare R2 etc.
  const s3 = new S3Client({
    endpoint: import.meta.env.VITE_S3_ENDPOINT,
    region: import.meta.env.VITE_S3_REGION || 'auto',
    accessKeyId: import.meta.env.VITE_S3_ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_S3_ACCESS_KEY_SECRET,
    signatureVersion: import.meta.env.VITE_S3_SIGNATURE_VERSION || 'v4',
  });
  url = await s3.getSignedUrlPromise('getObject', {
    Bucket: import.meta.env.VITE_S3_BUCKET_NAME,
    Key: import.meta.env.VITE_S3_BUCKET_KEY,
    Expires: 3600,
  });
}
await wml.setup(url);
