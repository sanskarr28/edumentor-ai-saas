import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
  region: process.env.AWS_REGION ?? "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
  },
});

const BUCKET = process.env.AWS_S3_BUCKET ?? "";

export async function getPresignedUploadUrl(key: string, contentType: string) {
  const cmd = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(s3, cmd, { expiresIn: 300 }); // 5 min
  const fileUrl = `https://${BUCKET}.s3.${process.env.AWS_REGION ?? "us-east-1"}.amazonaws.com/${key}`;
  return { uploadUrl, fileUrl };
}

export async function getPresignedDownloadUrl(key: string) {
  const cmd = new GetObjectCommand({ Bucket: BUCKET, Key: key });
  return getSignedUrl(s3, cmd, { expiresIn: 3600 }); // 1 hour
}

export function extractKeyFromUrl(fileUrl: string): string {
  // Extract S3 key from the URL: https://bucket.s3.region.amazonaws.com/key
  try {
    const url = new URL(fileUrl);
    return url.pathname.slice(1); // remove leading /
  } catch {
    return fileUrl;
  }
}
