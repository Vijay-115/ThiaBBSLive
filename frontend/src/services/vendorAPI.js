// src/services/vendorAPI.js
import API from "../utils/api";

// side: "aadhaar_front" | "aadhaar_back"
export const ocrDocument = (file, side) => {
  const fd = new FormData();
  fd.append("document", file);
  return API.post(
    `/api/vendors/ocr?side=${encodeURIComponent(side || "")}`,
    fd,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
};

export const saveVendorStep = (vendorId, payload) =>
  API.patch(`/api/vendors/${vendorId}/step`, payload);
