import axios from "axios";

const BUCKET_UPLOAD_URL =
  "https://bucket.cyberawareness.ngo/bucket/upload/cybercrime";

const getUploadedUrl = (data) =>
  data?.file?.url ||
  data?.file?.[0]?.url ||
  data?.files?.[0]?.url ||
  data?.data?.url ||
  data?.url ||
  "";

export const uploadBucketFile = async (file, errorMessage) => {
  if (!file) return "";

  const formData = new FormData();
  formData.append("file", file, file.name || `upload_${Date.now()}`);

  // Do not set Content-Type manually in the browser. Axios adds the multipart
  // boundary required by the bucket service.
  const response = await axios.post(BUCKET_UPLOAD_URL, formData);
  const url = getUploadedUrl(response?.data);

  if (!url) {
    throw new Error(errorMessage || "The file could not be uploaded.");
  }

  return url;
};
