// controllers/vendorController.js
const path = require("path");
const fs = require("fs");
const os = require("os");
const Tesseract = require("tesseract.js");
const pdfPoppler = require("pdf-poppler");
const Vendor = require("../models/Vendor");

// Optional: set this if pdf-poppler can't find Poppler automatically
// process.env.POPPLER_PATH = "C:\\Program Files\\poppler-24.08.0\\Library\\bin";

/* ------------------------------ small helpers ------------------------------ */
const safeUnlink = (p) => { try { fs.unlinkSync(p); } catch (_) {} };
const digitsOnly = (s = "") => s.replace(/\D/g, "");
const cleanLine = (line = "") =>
  line.replace(/[^A-Z0-9\s:/\-\.]/gi, "").replace(/\s+/g, " ").trim();

const isValidName = (line = "") => {
  const up = line.toUpperCase();
  const invalid = [
    "INCOME TAX","GOVT","PERMANENT ACCOUNT","DEPARTMENT","SIGNATURE",
    "FATHER","BIRTH","NAME","GOVERNMENT","INDIA","UNIQUE","IDENTIFICATION"
  ];
  return line.length >= 3 && /[A-Za-z]/.test(line) && !invalid.some(w => up.includes(w));
};
const removeInitial = (name = "") => {
  const parts = name.trim().split(/\s+/);
  if (parts.length > 1 && parts[0].length === 1) return parts.slice(1).join(" ");
  return name.trim();
};

/* ------------------------------ PAN parse ----------------------------- */
function extractPanDetails(text) {
  let name = "", fatherName = "", dob = "", panNumber = "";
  const panMatch = text.match(/[A-Z]{5}[0-9]{4}[A-Z]{1}/);
  if (panMatch) panNumber = panMatch[0];
  const dobMatch = text.match(/\b\d{2}\/\d{2}\/\d{4}\b/);
  if (dobMatch) dob = dobMatch[0];

  const lines = text.split("\n").map(cleanLine).filter(Boolean);
  const upLines = lines.map(l => l.toUpperCase());
  const panIndex = upLines.findIndex(l => panNumber && l.includes(panNumber));
  if (panIndex >= 0) {
    const possibleName = lines[panIndex + 1];
    const possibleFather = lines[panIndex + 2];
    if (isValidName(possibleName)) name = removeInitial(possibleName);
    if (isValidName(possibleFather)) fatherName = removeInitial(possibleFather);
  }
  if ((!name || !fatherName) && dob) {
    const dobIndex = upLines.findIndex(l => l.includes(dob));
    const beforeDob = lines.slice(0, dobIndex).filter(isValidName);
    if (beforeDob.length >= 2) {
      if (!name) name = removeInitial(beforeDob[beforeDob.length - 2]);
      if (!fatherName) fatherName = removeInitial(beforeDob[beforeDob.length - 1]);
    }
  }
  return { name, fatherName, dob, panNumber };
}

function parseDobToDate(input) {
  if (!input) return null;
  if (input instanceof Date) return input;
  const s = String(input).trim();

  // DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY
  const m = s.match(/^([0-3]?\d)[\/\-\.]([01]?\d)[\/\-\.]((?:19|20)\d{2})$/);
  if (m) {
    const dd = m[1].padStart(2, "0");
    const mm = m[2].padStart(2, "0");
    const yyyy = m[3];
    return new Date(`${yyyy}-${mm}-${dd}`);
  }
  const t = Date.parse(s);
  if (!Number.isNaN(t)) return new Date(t);
  return null;
}

/* ---------------------------- Aadhaar (front) --------------------------- */
function extractAadhaarNumber(text) {
  const withoutVID = text.replace(/VID\s*[:\-]?\s*\d[\d\s]{10,}/i, "");
  const spaced = withoutVID.match(/\b(\d{4}\s\d{4}\s\d{4})\b/);
  if (spaced) return spaced[1].replace(/\s/g, "");
  const compact = withoutVID.replace(/\s/g, "").match(/\b(\d{12})\b/);
  return compact ? compact[1] : "";
}
function extractDOB(text) {
  const m = text.match(/\b(?:DOB|Date of Birth|Year of Birth|YOB)\s*[:\-]?\s*([0-3]?\d[\/\-\.][01]?\d[\/\-\.](?:19|20)\d{2})\b/i);
  return m ? m[1].trim() : "";
}
function extractGender(text) {
  const g = text.match(/\b(MALE|FEMALE|TRANSGENDER)\b/i);
  return g ? g[1].toLowerCase() : "";
}
function extractNameFront(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  let idx = lines.findIndex(l => /DOB|Date of Birth|Year of Birth|YOB/i.test(l));
  if (idx > 0) {
    const cand = lines[idx - 1].replace(/^Name[:\-]?\s*/i, "").trim();
    if (/[A-Za-z]/.test(cand)) return cand;
  }
  const latin = lines.filter(l => /^[\x00-\x7F]+$/.test(l) && /[A-Za-z]/.test(l));
  latin.sort((a, b) => b.length - a.length);
  return (latin[0] || "").trim();
}
function splitFirstLast(fullName) {
  if (!fullName) return { firstName: "", lastName: "" };
  const m = fullName.match(/(.*)\bJaya\s+Singh\b/i);
  if (m) return { firstName: m[1].trim().replace(/[,\-]+$/, ""), lastName: "Jaya Singh" };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return { firstName: fullName, lastName: "" };
  return { firstName: parts.slice(0, -1).join(" "), lastName: parts.slice(-1)[0] };
}
function extractAadhaarFront(text) {
  const nameFull = extractNameFront(text);
  const { firstName, lastName } = splitFirstLast(nameFull);
  const dob = extractDOB(text);
  const gender = extractGender(text);
  return { name: nameFull, firstName, lastName, dob, gender };
}

/* ------------------------- Aadhaar (back) address ----------------------- */
const IN_STATES = [
  ["Andhra Pradesh"], ["Arunachal Pradesh"], ["Assam"], ["Bihar"], ["Chhattisgarh"],
  ["Goa"], ["Gujarat"], ["Haryana"], ["Himachal Pradesh"], ["Jharkhand"],
  ["Karnataka"], ["Kerala"], ["Madhya Pradesh"], ["Maharashtra"], ["Manipur"],
  ["Meghalaya"], ["Mizoram"], ["Nagaland"], ["Odisha","Orissa"], ["Punjab"],
  ["Rajasthan"], ["Sikkim"], ["Tamil Nadu","Tamilnadu"], ["Telangana"], ["Tripura"],
  ["Uttar Pradesh","UP"], ["Uttarakhand","Uttaranchal"], ["West Bengal"],
  ["Andaman and Nicobar Islands","Andaman & Nicobar"], ["Chandigarh"],
  ["Dadra and Nagar Haveli and Daman and Diu","Dadra and Nagar Haveli","Daman and Diu"],
  ["Delhi","NCT of Delhi","New Delhi"], ["Jammu and Kashmir","Jammu & Kashmir","J&K"],
  ["Ladakh"], ["Lakshadweep"], ["Puducherry","Pondicherry","Pondichery","Puduchery"],
];
const STATE_PATTERNS = IN_STATES.map(list => ({
  canonical: list[0],
  re: new RegExp("\\b(" + list.map(s => s.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).join("|") + ")\\b","i")
}));
function detectState(joined) {
  for (const { canonical, re } of STATE_PATTERNS) {
    const m = joined.match(re);
    if (m) return { state: canonical, matched: m[0] };
  }
  return { state: "", matched: "" };
}
// function extractAddressBack(rawText) {
//   let lines = rawText
//     .split(/\r?\n/)
//     .map(l => l.replace(/[^\x20-\x7E]/g, "").trim())
//     .filter(Boolean);

//   const isAddressLine = (s) => s.replace(/[^A-Za-z]/g,"").toLowerCase().includes("address");
//   const addrIdx = lines.findIndex(isAddressLine);

//   let block = [];
//   if (addrIdx !== -1) {
//     for (let i = addrIdx + 1; i < Math.min(lines.length, addrIdx + 8); i++) {
//       const ln = lines[i];
//       if (
//         /\bVID\b/i.test(ln) ||
//         /\b\d{4}\s?\d{4}\s?\d{4}\b/.test(ln) ||
//         /uidai\.gov\.in/i.test(ln) ||
//         /Unique\s+Identification/i.test(ln) ||
//         /Government/i.test(ln) ||
//         /help@uidai\.gov\.in/i.test(ln)
//       ) break;
//       block.push(ln);
//     }
//   } else {
//     const pinLine = lines.findIndex(l => /\b\d{6}\b/.test(l));
//     const s = Math.max(0, pinLine - 4);
//     block = lines.slice(s, Math.min(lines.length, s + 6))
//       .filter(ln => !/Unique\s+Identification|uidai\.gov\.in|Government|VID/i.test(ln));
//   }

//   let joined = block.join(", ");
//   joined = joined
//     .replace(/\([^)]*\)/g, "")
//     .replace(/\s{2,}/g, " ")
//     .replace(/\s*,\s*/g, ", ")
//     .replace(/,+/g, ",")
//     .replace(/,\s*,/g, ", ")
//     .replace(/\s*:\s*/g, ": ")
//     .replace(/\b1\s*st\b/gi, "1 st")
//     .replace(/\bKosa?pa?la?yam\b/gi, "Kosapalayam");

//   const pinMatch = joined.match(/(\d{6})(?!.*\d{6})/);
//   const postalCode = pinMatch ? pinMatch[1] : "";
//   if (postalCode) joined = joined.replace(postalCode, "").replace(/[-–]\s*$/, "").replace(/,\s*$/, "");

//   const { state: detectedState, matched: stateToken } = detectState(joined);
//   let state = detectedState;
//   const parts = joined.split(",").map(s => s.trim()).filter(Boolean);

//   let city = "";
//   if (state && stateToken) {
//     const idx = parts.findIndex(p =>
//       new RegExp("\\b" + stateToken.replace(/[.*+?^${}()|[\]\\]/g,"\\$&") + "\\b","i").test(p)
//     );
//     if (idx > 0) city = parts[idx - 1];
//   } else if (parts.length) {
//     city = parts[parts.length - 1];
//   }

//   let cutoff = parts.length;
//   if (state && stateToken) {
//     const idx = parts.findIndex(p =>
//       new RegExp("\\b" + stateToken.replace(/[.*+?^${}()|[\]\\]/g,"\\$&") + "\\b","i").test(p)
//     );
//     cutoff = idx > 0 ? idx - 1 : idx;
//   }
//   let streetParts = parts.slice(0, cutoff);

//   if (streetParts.length) {
//     streetParts[0] = streetParts[0].replace(/^(S|D|W|C)\/O\s*[^,]*,\s*/i, "").trim();
//     if (/^(S|D|W|C)\/O\b/i.test(streetParts[0]) && !streetParts[0].includes(",")) {
//       streetParts.shift();
//     }
//   }

//   const street = streetParts.join(", ").replace(/\s{2,}/g, " ").replace(/,\s*,/g, ", ").trim();

//   return {
//     street,
//     city: city || "",
//     state: state || "",
//     country: "India",
//     postalCode: postalCode || ""
//   };
// }
function extractAddressBack(rawText) {
  // 1) Pre-clean to ASCII and trim
  let lines = (rawText || "")
    .split(/\r?\n/)
    .map(l => l.replace(/[^\x20-\x7E]/g, "").trim())
    .filter(Boolean);

  // 2) Helpers
  const isUidaiNoise = (s) =>
    /uidai|unique\s+identification|authority|gov\.in|help@uidai|qr\s*code/i.test(s);
  const hasAadhaar12 = (s) => /\b\d(?:\s?\d){11}\b/.test(s.replace(/\s+/g, " "));
  const isAddressHeader = (s) => s.replace(/[^A-Za-z]/g, "").toLowerCase().includes("address");
  const looksLikePin = (s) => /\b\d{6}\b/.test(s);

  // 3) Find address block: after "Address" and before UIDAI footer / Aadhaar number
  const addrIdx = lines.findIndex(isAddressHeader);
  let block = [];
  if (addrIdx !== -1) {
    for (let i = addrIdx + 1; i < Math.min(lines.length, addrIdx + 12); i++) {
      const ln = lines[i];
      if (!ln) continue;
      if (isUidaiNoise(ln) || hasAadhaar12(ln)) break;
      block.push(ln);
    }
  } else {
    // Fallback: local window around last 6-digit PIN
    const pinLineIdx = lines.findIndex(looksLikePin);
    const start = Math.max(0, pinLineIdx - 5);
    const end = Math.min(lines.length, (pinLineIdx === -1 ? lines.length : pinLineIdx + 3));
    block = lines.slice(start, end).filter(ln => !isUidaiNoise(ln) && !hasAadhaar12(ln));
  }

  // 4) Join and normalize punctuation/spacing
  let joined = block
    .join(", ")
    .replace(/\([^)]*\)/g, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s*,\s*/g, ", ")
    .replace(/,+/g, ",")
    .replace(/,\s*,/g, ", ")
    .replace(/\s*:\s*/g, ": ")
    // normalize common address OCR patterns
    .replace(/\b1\s*st\b/gi, "1st")
    .replace(/\b2\s*nd\b/gi, "2nd")
    .replace(/\b3\s*rd\b/gi, "3rd")
    .replace(/\bPondicherry\b/gi, "Puducherry"); // modern canonical

  // 5) Extract PIN (last 6-digit token in the entire string)
  const pinMatch = joined.match(/(\d{6})(?!.*\d{6})/);
  const postalCode = pinMatch ? pinMatch[1] : "";

  // 6) Remove PIN from the working string to avoid polluting tokens
  if (postalCode) {
    joined = joined.replace(new RegExp(postalCode + "\\b"), "").replace(/[-–]\s*$/, "").replace(/,\s*$/, "");
  }

  // 7) Detect State/UT
  const IN_STATES = [
    ["Andhra Pradesh"], ["Arunachal Pradesh"], ["Assam"], ["Bihar"], ["Chhattisgarh"],
    ["Goa"], ["Gujarat"], ["Haryana"], ["Himachal Pradesh"], ["Jharkhand"],
    ["Karnataka"], ["Kerala"], ["Madhya Pradesh"], ["Maharashtra"], ["Manipur"],
    ["Meghalaya"], ["Mizoram"], ["Nagaland"], ["Odisha","Orissa"], ["Punjab"],
    ["Rajasthan"], ["Sikkim"], ["Tamil Nadu","Tamilnadu"], ["Telangana"], ["Tripura"],
    ["Uttar Pradesh","UP"], ["Uttarakhand","Uttaranchal"], ["West Bengal"],
    ["Andaman and Nicobar Islands","Andaman & Nicobar"],
    ["Chandigarh"],
    ["Dadra and Nagar Haveli and Daman and Diu","Dadra and Nagar Haveli","Daman and Diu"],
    ["Delhi","NCT of Delhi","New Delhi"],
    ["Jammu and Kashmir","Jammu & Kashmir","J&K"],
    ["Ladakh"],
    ["Lakshadweep"],
    ["Puducherry","Pondicherry","Pondichery","Puduchery"]
  ];
  const STATE_PATTERNS = IN_STATES.map(list => ({
    canonical: list[0],
    re: new RegExp("\\b(" + list.map(s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|") + ")\\b", "i")
  }));

  let state = "";
  let stateToken = "";
  for (const { canonical, re } of STATE_PATTERNS) {
    const m = joined.match(re);
    if (m) { state = canonical; stateToken = m[0]; break; }
  }

  // 8) Split tokens and filter candidates
  const parts = joined
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)
    // drop obvious noise or Aadhaar lines
    .filter(s => !hasAadhaar12(s) && !/^\d[\d\s-]*$/.test(s) && !isUidaiNoise(s));

  // 9) Determine city: prefer the token immediately before the state token;
  // if not found, choose the last reasonable token (with letters, not long numeric)
  let city = "";
  if (state && stateToken) {
    const idx = parts.findIndex(p =>
      new RegExp("\\b" + stateToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(p)
    );
    if (idx > 0) city = parts[idx - 1];
  }
  if (!city) {
    // fallback: pick the last part that has letters and isn’t just numbers/punctuation
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i];
      if (/[A-Za-z]/.test(p) && !hasAadhaar12(p) && !/^\d{4}(\s?\d{4}){2}$/.test(p)) {
        city = p;
        break;
      }
    }
  }

  // 10) Street = everything before city/state
  let cutoff = parts.length;
  if (state && stateToken) {
    const iState = parts.findIndex(p =>
      new RegExp("\\b" + stateToken.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i").test(p)
    );
    if (iState !== -1) cutoff = Math.max(0, iState - (city ? 1 : 0));
  }
  const streetParts = parts.slice(0, cutoff).filter(p => p !== city);
  let street = streetParts.join(", ").replace(/\s{2,}/g, " ").replace(/,\s*,/g, ", ").trim();

  // Final guardrails: never return number-like city
  if (city && !/[A-Za-z]/.test(city)) city = "";

  return {
    street: street || "",
    city: city || "",
    state: state || "",
    country: "India",
    postalCode: postalCode || ""
  };
}

/* -------------------------- PDF → image (1st pg) ---------------------- */
async function pdfFirstPageToImage(pdfPath) {
  const outDir = path.join(
    os.tmpdir(),
    `pdf2img_${Date.now()}_${Math.random().toString(36).slice(2)}`
  );
  fs.mkdirSync(outDir, { recursive: true });

  const opts = {
    format: "jpeg",
    out_dir: outDir,
    out_prefix: "page",
    page: 1,
    dpi: 200,
  };
  if (process.env.POPPLER_PATH) {
    opts.poppler_path = process.env.POPPLER_PATH;
    console.log("Using Poppler at:", opts.poppler_path);
  }

  try {
    await pdfPoppler.convert(pdfPath, opts);
  } catch (err) {
    console.error("PDF convert failed:", err.message);
    throw new Error("PDF OCR failed. Check Poppler install and POPPLER_PATH. Details: " + err.message);
  }

  const p1 = path.join(outDir, "page-1.jpg");
  const p1alt = path.join(outDir, "page-1.jpeg");
  if (fs.existsSync(p1)) return p1;
  if (fs.existsSync(p1alt)) return p1alt;
  throw new Error("PDF conversion succeeded but output image not found");
}

/* ------------------------------ OCR core ------------------------------ */
async function recognizeImageOCR(filePath, params = {}) {
  const { data: { text } } = await Tesseract.recognize(filePath, "eng", {
    tessedit_pageseg_mode: "3",
    ...params
  });
  return text;
}

/* ---- GST helpers (kept in case you ever re-enable OCR for GST) ---- */
function extractGstin(text) {
  const m = text.match(/\b\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]\b/);
  return m ? m[0] : "";
}
function extractGstLegalName(text) {
  const m = text.match(/Legal Name\s*:?[\s\r\n]+([^\r\n]+)/i);
  return m ? m[1].trim() : "";
}
function extractGstConstitution(text) {
  const m = text.match(/Constitution of Business\s*:?[\s\r\n]+([^\r\n]+)/i);
  return m ? m[1].trim() : "";
}
function extractGstAddress(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim());
  const start = lines.findIndex(l => /Address of Principal Place of\s*Business/i.test(l));
  const addr = { floorNo:"", buildingNo:"", street:"", locality:"", city:"", district:"", state:"", postalCode:"" };
  if (start !== -1) {
    const grab = [];
    for (let i = start + 1; i < Math.min(lines.length, start + 20); i++) {
      const ln = lines[i];
      if (!ln) continue;
      if (/^\s*\d+\.\s/.test(ln)) break;
      grab.push(ln);
    }
    const take = (label, key) => {
      const r = new RegExp("^" + label.replace(/[.*+?^${}()|[\]\\]/g,"\\$&") + "\\s*:\\s*(.+)$","i");
      const row = grab.find(x => r.test(x));
      if (row) {
        const v = row.replace(r, "$1").trim();
        if (v) addr[key] = v;
      }
    };
    take("Floor No\\.", "floorNo");
    take("Building No\\./Flat No\\.", "buildingNo");
    take("Road/Street", "street");
    take("Locality/Sub Locality", "locality");
    take("City/Town/Village", "city");
    take("District", "district");
    take("State", "state");
    take("PIN Code", "postalCode");
  }
  return addr;
}

/* ------------------------------ Controllers --------------------------- */
// POST /api/vendors/ocr  (field: document)  ?side=aadhaar_front|aadhaar_back|gst
// exports.uploadOCR = async (req, res) => {
//   try {
//     const file = req.file;
//     if (!file) {
//       return res.status(400).json({ message: 'No file uploaded' });
//     }
//     // Process the uploaded file (e.g., OCR logic)
//     res.status(200).json({ message: 'File uploaded successfully', file });
//   } catch (error) {
//     res.status(500).json({ message: 'Error processing file', error });
//   }
// };

exports.uploadOCR = async (req, res) => {
  let tempImageFromPdf = null;
  try {
    if (!req.file) return res.status(400).json({ success:false, message:"No file uploaded" });

    const side = (req.query.side || "").toLowerCase();
    const filePath = req.file.path;
    const ext = path.extname(filePath).toLowerCase();

    const fileUrl = `/uploads/${path.basename(filePath)}`;

    let ocrInputPath = filePath;
    if (ext === ".pdf") {
      try {
        const imgPath = await pdfFirstPageToImage(filePath);
        tempImageFromPdf = imgPath;
        ocrInputPath = imgPath;
      } catch (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "PDF OCR failed. Verify Poppler is installed and POPPLER_PATH is correct."
        });
      }
    }

    // Run OCR
    let text;
    if (side === "aadhaar_back") {
      const { data } = await Tesseract.recognize(ocrInputPath, "eng", {
        tessedit_pageseg_mode: "6",
        tessedit_char_whitelist: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ,:-/."
      });
      text = data.text;
    } else {
      const { data } = await Tesseract.recognize(ocrInputPath, "eng");
      text = data.text;
    }

    // PAN (no side)
    if (!side && /[A-Z]{5}\d{4}[A-Z]\b/.test(text)) {
      const extracted = extractPanDetails(text);
      return res.json({ success: true, docType: "pan", fileUrl, rawText: text, extracted });
    }

    if (side === "aadhaar_front") {
      const a12 = extractAadhaarNumber(text);
      const { name, firstName, lastName, dob, gender } = extractAadhaarFront(text);
      return res.json({
        success: true,
        docType: "aadhaar_front",
        fileUrl,
        rawText: text,
        extracted: { name, firstName, lastName, dob, gender, aadhaarNumber: a12 }
      });
    }

    if (side === "aadhaar_back") {
      
      const a12 = extractAadhaarNumber(text);
      const address = extractAddressBack(text);
      console.log("Aadhaar BACK raw:\n", text);
  console.log("Aadhaar BACK parsed:", address)
      return res.json({
        success: true,
        docType: "aadhaar_back",
        fileUrl,
        rawText: text,
        extracted: { aadhaarNumber: a12, address }
      });
    }

    if (side === "gst") {
      // keeping this response in case you want to see OCR output,
      // but your UI now fills GST manually and only stores file.
      const gst_number = extractGstin(text);
      const gst_legal_name = extractGstLegalName(text);
      const gst_constitution = extractGstConstitution(text);
      const gst_address = extractGstAddress(text);
      return res.json({
        success: true,
        docType: "gst",
        fileUrl,
        rawText: text,
        extracted: {
          gst_number,
          legal_name: gst_legal_name,
          constitution: gst_constitution,
          address: gst_address
        }
      });
    }

    return res.json({ success: true, docType: "unknown", fileUrl, rawText: text, extracted: {} });
  } catch (err) {
    console.error("OCR Error:", err);
    res.status(500).json({ success:false, message:"OCR failed", details: err.message });
  } finally {
    if (tempImageFromPdf && fs.existsSync(tempImageFromPdf)) {
      safeUnlink(tempImageFromPdf);
      try { fs.rmdirSync(path.dirname(tempImageFromPdf), { recursive: true }); } catch (_) {}
    }
  }
};

// JSON body saves for PAN/Aadhaar/GST fields (no file here)
// Always update a single vendor:
// - If vendorId present: filter = {_id: vendorId}
// - Else: filter by any of the known identifiers (PAN/Aadhaar/GST)
// Use upsert + runValidators:false so drafts don't fail on required fields
exports.saveStepByKey = async (req, res) => {
  try {
    console.log("saveStepByKey body:", JSON.stringify(req.body));
    const b = req.body || {};

    const vendorId = b.vendorId && String(b.vendorId).trim();
    const pan = b.pan_number ? String(b.pan_number).toUpperCase().trim() : "";
    const aad = b.aadhar_number ? String(b.aadhar_number).replace(/\D/g, "") : "";
    const gst = b.gst_number ? String(b.gst_number).toUpperCase().trim() : "";

    // 1) Build filter
    let filter = null;
    if (vendorId) {
      filter = { _id: vendorId };
    } else {
      const or = [];
      if (pan) or.push({ pan_number: pan });
      if (aad) or.push({ aadhar_number: aad });
      if (gst) or.push({ gst_number: gst });
      if (or.length === 0) {
        return res.status(400).json({ ok:false, message:"Provide vendorId or one of pan_number/aadhar_number/gst_number" });
      }
      filter = { $or: or };
    }

    // 2) Build $set
    const set = { updated_at: new Date() };
    if (pan) set.pan_number = pan;
    if (aad) set.aadhar_number = aad;
    if (gst) set.gst_number = gst;

    for (const k of [
      "pan_pic",
      "aadhar_pic_front",
      "aadhar_pic_back",
      "gst_cert_pic",
      "gst_legal_name",
      "gst_constitution",
      "vendor_fname",
      "vendor_lname",
      "gender",
    ]) {
      if (Object.prototype.hasOwnProperty.call(b, k)) {
        const v = b[k];
        if (v !== undefined && v !== null && String(v).trim() !== "") {
          set[k] = String(v).trim();
        }
      }
    }

    if (Object.prototype.hasOwnProperty.call(b, "dob") && b.dob) {
      const parsed = parseDobToDate(b.dob);
      if (!parsed) {
        return res.status(400).json({ ok:false, message:"Invalid DOB format. Use DD/MM/YYYY or YYYY-MM-DD." });
      }
      set.dob = parsed;
    }

    if (b.register_business_address && typeof b.register_business_address === "object") {
      const a = b.register_business_address;
      for (const k of ["street","city","state","country","postalCode"]) {
        const v = a[k];
        if (v !== undefined && v !== null && String(v).trim() !== "") {
          set[`register_business_address.${k}`] = String(v).trim();
        }
      }
    }

    if (b.gst_address && typeof b.gst_address === "object") {
      const g = b.gst_address;
      for (const k of ["floorNo","buildingNo","street","locality","city","district","state","postalCode"]) {
        const v = g[k];
        if (v !== undefined && v !== null && String(v).trim() !== "") {
          set[`gst_address.${k}`] = String(v).trim();
        }
      }
    }

    // 3) Upsert draft safely (no required-field validation during steps)
    const updated = await Vendor.findOneAndUpdate(
      filter,
      { $set: set, $setOnInsert: { created_at: new Date() } },
      { new: true, upsert: true, runValidators: false, setDefaultsOnInsert: false }
    );

    return res.json({ ok:true, data: updated });
  } catch (e) {
    console.error("saveStepByKey error:", e);
    return res.status(500).json({ ok:false, message:"Save step-by-key failed", details: e.message });
  }
};

// Legacy: PATCH /api/vendors/:vendorId/step (kept for completeness)
exports.saveStep = async (req, res) => {
  try {
    const { vendorId } = req.params;
    if (!vendorId) return res.status(400).json({ ok:false, message:"vendorId required" });

    const updateBody = { ...(req.body || {}) };
    if (Object.prototype.hasOwnProperty.call(updateBody, "dob")) {
      const dobDate = parseDobToDate(updateBody.dob);
      if (!dobDate) return res.status(400).json({ ok:false, message:"Invalid DOB format. Use DD/MM/YYYY or YYYY-MM-DD." });
      updateBody.dob = dobDate;
    }

    const doc = await Vendor.findByIdAndUpdate(
      vendorId,
      { $set: updateBody, $currentDate: { updated_at: true } },
      { new: true, runValidators: false }
    );
    if (!doc) return res.status(404).json({ ok:false, message:"Vendor not found" });
    res.json({ ok:true, data: doc });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok:false, message:"Save step failed", details: e.message });
  }
};

// PUT /api/vendors/gst  (multipart form-data: document + fields)
// No OCR. Always update same vendor by vendorId.
exports.updateGst = async (req, res) => {
  try {
    const vendorId = (req.body.vendorId || "").trim();
    if (!vendorId) return res.status(400).json({ ok:false, message:"vendorId required" });

    const set = { updated_at: new Date() };

    if (req.file) {
      set.gst_cert_pic = `/uploads/${req.file.filename}`;
    }

    const b = req.body || {};
    if (b.gst_number) set.gst_number = String(b.gst_number).toUpperCase().trim();
    if (b.gst_legal_name) set.gst_legal_name = String(b.gst_legal_name).trim();
    if (b.gst_constitution) set.gst_constitution = String(b.gst_constitution).trim();

    // allow nested form-data: gst_address[floorNo], etc.
    const g = b.gst_address || {};
    const keys = ["floorNo","buildingNo","street","locality","city","district","state","postalCode"];
    for (const k of keys) {
      const v = (g[k] ?? b[`gst_address[${k}]`]);
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        set[`gst_address.${k}`] = String(v).trim();
      }
    }

    const updated = await Vendor.findByIdAndUpdate(
      vendorId,
      { $set: set },
      { new: true, runValidators: false }
    );
    if (!updated) return res.status(404).json({ ok:false, message:"Vendor not found" });

    return res.json({ ok:true, data: updated });
  } catch (e) {
    console.error("updateGst error:", e);
    return res.status(500).json({ ok:false, message:"GST update failed", details: e.message });
  }
};

// New function to update bank details
exports.updateBankDetails = async (req, res) => {
  try {
    const vendorId = req.params.vendorId;
    if (!vendorId) {
      return res.status(400).json({ ok: false, message: "Vendor ID is required" });
    }

    const set = { updated_at: new Date() };

    if (req.file) {
      // store uploaded file path
      set.cancel_cheque_passbook = `/uploads/${req.file.filename}`;
    }

    const b = req.body || {};
    if (b.account_holder_name) set.account_holder_name = String(b.account_holder_name).trim();
    if (b.account_no)         set.account_no         = String(b.account_no).trim();
    if (b.ifcs_code)          set.ifcs_code          = String(b.ifcs_code).trim().toUpperCase();
    if (b.bank_name)          set.bank_name          = String(b.bank_name).trim();
    if (b.branch_name)        set.branch_name        = String(b.branch_name).trim();
    if (b.bank_address)       set.bank_address       = String(b.bank_address).trim();

    const updated = await Vendor.findByIdAndUpdate(
      vendorId,
      { $set: set },
      { new: true, runValidators: false }
    );

    if (!updated) {
      return res.status(404).json({ ok: false, message: "Vendor not found" });
    }

    return res.json({ ok: true, data: updated });
  } catch (e) {
    console.error("updateBank error:", e);
    return res.status(500).json({ ok: false, message: "Bank update failed", details: e.message });
  }
};

// Added updateBankByParam to reuse updateBank logic
exports.updateBankByParam = async (req, res) => {
  req.body = req.body || {};
  req.body.vendorId = req.params.vendorId;  // reuse the same logic
  return exports.updateBankDetails(req, res);
};

// New function to update outlet details
exports.updateOutlet = async (req, res) => {
  try {
    const b = req.body || {};
    const vendorId = (b.vendorId || "").trim();
    if (!vendorId) {
      return res.status(400).json({ ok: false, message: "vendorId required" });
    }

    const set = { updated_at: new Date() };

    if (b.outlet_name) set.outlet_name = String(b.outlet_name).trim();
    if (b.outlet_manager_name) set.outlet_manager_name = String(b.outlet_manager_name).trim();
    if (b.outlet_contact_no) set.outlet_contact_no = String(b.outlet_contact_no).trim();
    if (b.outlet_phone_no) set.outlet_phone_no = String(b.outlet_phone_no).trim();

    if (b.outlet_location && typeof b.outlet_location === "object") {
      const a = b.outlet_location;
      const keys = ["street", "city", "district", "state", "country", "postalCode"];
      keys.forEach((k) => {
        if (a[k] !== undefined && a[k] !== null && String(a[k]).trim() !== "") {
          set[`outlet_location.${k}`] = String(a[k]).trim();
        }
      });
    }

    if (b.outlet_coords && typeof b.outlet_coords === "object") {
      const { lat, lng } = b.outlet_coords;
      if (lat !== undefined && lat !== null) set["outlet_coords.lat"] = Number(lat);
      if (lng !== undefined && lng !== null) set["outlet_coords.lng"] = Number(lng);
    }

    if (req.file) {
      set.outlet_nameboard_image = req.file.filename; // store filename only
    }

    const updated = await Vendor.findByIdAndUpdate(vendorId, { $set: set }, { new: true });
    if (!updated) return res.status(404).json({ ok: false, message: "Vendor not found" });

    res.json({ ok: true, data: updated });
  } catch (e) {
    console.error("updateOutlet error:", e);
    res.status(500).json({ ok: false, message: "Outlet update failed", details: e.message });
  }
};

// Middleware to validate geolocation data
exports.validateGeolocation = (req, res, next) => {
  const { lat, lng } = req.body.outlet_coords || {};

  if (lat === undefined || lng === undefined) {
    return res.status(400).json({ ok: false, message: "Latitude and longitude are required." });
  }

  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return res.status(400).json({ ok: false, message: "Invalid latitude or longitude." });
  }

  next();
};

// New function to register vendor and save all data under the same ObjectId
exports.registerVendor = async (req, res) => {
  try {
    const vendorData = req.body;
    const vendor = new Vendor(vendorData);
    await vendor.save();
    res.status(201).json({ message: 'Vendor registered successfully', vendor });
  } catch (error) {
    res.status(500).json({ message: 'Error registering vendor', error });
  }
};

module.exports = {
  uploadOCR: exports.uploadOCR,
  saveStepByKey: exports.saveStepByKey,
  saveStep: exports.saveStep,
  updateGst: exports.updateGst,
  updateBankDetails: exports.updateBankDetails,
  updateBankByParam: exports.updateBankByParam,
  updateOutlet: exports.updateOutlet,
  validateGeolocation: exports.validateGeolocation,
  registerVendor: exports.registerVendor,
};

