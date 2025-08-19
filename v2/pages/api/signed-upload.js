import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  try {
    const { paramsToSign } = req.body || {};
    const signature = cloudinary.utils.api_sign_request(
      paramsToSign || {},
      process.env.CLOUDINARY_API_SECRET
    );
    res.status(200).json({ signature });
  } catch (e) {
    res.status(500).json({ error: true, message: "Signature error" });
  }
}

