// frontend/pages/TerritoryHeadForm.jsx
import React, { useState, useEffect } from "react";
import { Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";
import axios from "axios";
const constitutionOptions = [
  { value: "proprietorship", label: "Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "private_ltd", label: "Private Limited" },
  { value: "public_ltd", label: "Public Limited" },
  { value: "llp", label: "LLP" },
  { value: "trust", label: "Trust" },
  { value: "society", label: "Society" },
];
export default function TerritoryHeadForm() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [territoryHeadId, setTerritoryHeadId] = useState(
    () => localStorage.getItem("territoryHeadId") || ""
  );

  const [mismatch, setMismatch] = useState({
    show: false,
    title: "",
    items: [],
  });

  const [loadingPan, setLoadingPan] = useState(false);
  const [loadingAFront, setLoadingAFront] = useState(false);
  const [loadingABack, setLoadingABack] = useState(false);
  const [loadingGST, setLoadingGST] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    panNumber: "",
    aadharNumber: "",
    gender: "",
    register_street: "",
    register_city: "",
    register_state: "",
    register_country: "India",
    register_postalCode: "",
    // GST manual fields
    gstNumber: "",
    gstLegalName: "",
    gstConstitution: "",
    gst_floorNo: "",
    gst_buildingNo: "",
    gst_street: "",
    gst_locality: "",
    gst_district: "",
  });
const handleSelectChange = (selectedOption, field) => {
  setFormData((prevData) => ({
    ...prevData,
    [field.name]: selectedOption ? selectedOption.label : "",
  }));
};
  const fmtAadhaarUI = (digits) =>
    (digits || "")
      .replace(/\D/g, "")
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim();

  function findDiffs(current, next, labelMap) {
    const items = [];
    for (const key of Object.keys(labelMap)) {
      const before = (current[key] ?? "").toString().trim();
      const after = (next[key] ?? "").toString().trim();
      if (!before && !after) continue;
      if (before !== after) items.push({ label: labelMap[key], before, after });
    }
    return items;
  }

  // -------------------- PAN (Step 1) --------------------
  const onPanUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("document", file);

    setLoadingPan(true);
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/territory-head/ocr`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        }
      );

      const data = resp?.data || {};
      if (!data.success) throw new Error("PAN OCR failed");

      const extracted = data.extracted || {};
      const fileUrl = data.fileUrl || null;

      const nextValues = {
        firstName: extracted.name || formData.firstName,
        lastName: extracted.fatherName || formData.lastName,
        dob: extracted.dob || formData.dob,
        panNumber: (
          extracted.panNumber ||
          formData.panNumber ||
          ""
        ).toUpperCase(),
      };

      const diffs = findDiffs(formData, nextValues, {
        firstName: "First name",
        lastName: "Surname (Last name)",
        dob: "DOB",
        panNumber: "PAN number",
      });
      setFormData((prev) => ({ ...prev, ...nextValues }));
      if (diffs.length)
        setMismatch({
          show: true,
          title: "Please review PAN details",
          items: diffs,
        });

      const pan = nextValues.panNumber;
      if (pan && fileUrl) {
        const r = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/territory-head/step-by-key`,
          {
            vendorId: territoryHeadId, // send if present
            pan_number: pan,
            pan_pic: fileUrl,
          }
        );
        const id = r?.data?.data?._id;
        if (id && !territoryHeadId) {
          setTerritoryHeadId(id);
          localStorage.setItem("territoryHeadId", id);
        }
      }
    } catch (err) {
      console.error(err);
      alert("PAN OCR failed");
    } finally {
      setLoadingPan(false);
    }
  };

  const saveStep1AndNext = async () => {
    try {
      const payload = {
        vendorId: territoryHeadId,
        pan_number: (formData.panNumber || "").toUpperCase(),
        vendor_fname: formData.firstName || "",
        vendor_lname: formData.lastName || "",
        dob: formData.dob || "",
      };
      const resp = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/territory-head/step-by-key`,
        payload
      );
      if (!resp?.data?.ok) throw new Error("Save failed");
      const id = resp?.data?.data?._id;
      if (id) {
        setTerritoryHeadId(id);
        localStorage.setItem("territoryHeadId", id);
      }
      setStep(2);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || e.message || "Save failed");
    }
  };

  // -------------------- Aadhaar (Step 2) --------------------
  const onAadhaarFront = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("document", file);

    setLoadingAFront(true);
    try {
      const resp = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/territory-head/ocr?side=aadhaar_front`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        }
      );

      const data = resp?.data || {};
      if (!data.success) throw new Error("Aadhaar front OCR failed");

      const extracted = data.extracted || {};
      const fileUrl = data.fileUrl || null;

      const aNumRaw = (extracted.aadhaarNumber || "").replace(/\D/g, "");
      const aNumUI = aNumRaw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
      setFormData((prev) => ({
        ...prev,
        aadharNumber: aNumUI || prev.aadharNumber,
      }));

      if (aNumRaw && fileUrl) {
        const r = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/territory-head/step-by-key`,
          {
            vendorId: territoryHeadId,
            aadhar_number: aNumRaw,
            aadhar_pic_front: fileUrl,
            side: "front",
          }
        );
        const id = r?.data?.data?._id;
        if (id && !territoryHeadId) {
          setTerritoryHeadId(id);
          localStorage.setItem("territoryHeadId", id);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Aadhaar front OCR failed");
    } finally {
      setLoadingAFront(false);
    }
  };

  const onAadhaarBack = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("document", file);

    setLoadingABack(true);
    try {
      const resp = await axios.post(
        `${
          import.meta.env.VITE_API_URL
        }/api/territory-head/ocr?side=aadhaar_back`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 30000,
        }
      );

      const { success, extracted, fileUrl } = resp.data || {};
      if (!success) throw new Error("Aadhaar back OCR failed");

      const aNumRaw = (extracted?.aadhaarNumber || "").replace(/\D/g, "");
      const aNumUI = aNumRaw.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
      const addr = extracted?.address || {};

      setFormData((p) => ({
        ...p,
        aadharNumber: aNumUI || p.aadharNumber,
        register_street: addr.street || "",
        register_city: addr.city || "",
        register_state: addr.state || "",
        register_postalCode: addr.postalCode || "",
        register_country: "India",
      }));

      if (aNumRaw) {
        const r = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/territory-head/step-by-key`,
          {
            vendorId: territoryHeadId,
            aadhar_number: aNumRaw,
            aadhar_pic_back: fileUrl || undefined,
            side: "back",
            register_business_address: {
              street: addr.street || "",
              city: addr.city || "",
              state: addr.state || "",
              country: "India",
              postalCode: addr.postalCode || "",
            },
          }
        );
        const id = r?.data?.data?._id;
        if (id && !territoryHeadId) {
          setTerritoryHeadId(id);
          localStorage.setItem("territoryHeadId", id);
        }
      }
    } catch (e) {
      console.error(e);
      alert("Aadhaar back OCR failed");
    } finally {
      setLoadingABack(false);
    }
  };

  const saveStep2AndNext = async () => {
    try {
      const aNumRaw = (formData.aadharNumber || "").replace(/\D/g, "");
      if (!aNumRaw) {
        alert("Missing Aadhaar number");
        return;
      }

      const r = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/territory-head/step-by-key`,
        {
          vendorId: territoryHeadId,
          aadhar_number: aNumRaw,
          register_business_address: {
            street: formData.register_street || "",
            city: formData.register_city || "",
            state: formData.register_state || "",
            country: formData.register_country || "India",
            postalCode: formData.register_postalCode || "",
          },
        }
      );
      const id = r?.data?.data?._id;
      if (id && !territoryHeadId) {
        setTerritoryHeadId(id);
        localStorage.setItem("territoryHeadId", id);
      }

      alert("Aadhaar slide saved");
      setStep(3);
    } catch (e) {
      console.error(e);
      alert("Save failed");
    }
  };

  // -------------------- GST (Step 3, no OCR) --------------------
  const [gstFile, setGstFile] = useState(null);
  const onGstUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("document", file);

    setLoadingGST(true);
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/territory-head/ocr?side=gst`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 45000,
        }
      );

      const data = resp?.data || {};
      if (!data.success) throw new Error("GST OCR failed");

      const extracted = data.extracted || {};
      const fileUrl = data.fileUrl || null;

      // Auto-fill formData with OCR results
      setFormData((prev) => ({
        ...prev,
        gstNumber: extracted.gst_number || prev.gstNumber,
        gstLegalName: extracted.legal_name || prev.gstLegalName,
        gstConstitution: extracted.constitution || prev.gstConstitution,
        gst_floorNo: extracted.address?.floorNo || prev.gst_floorNo,
        gst_buildingNo: extracted.address?.buildingNo || prev.gst_buildingNo,
        gst_street: extracted.address?.street || prev.gst_street,
        gst_locality: extracted.address?.locality || prev.gst_locality,
        gst_district: extracted.address?.district || prev.gst_district,
      }));

      // Save file + gst number immediately (optional)
      if (extracted.gst_number && fileUrl) {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/territory-head/step-by-key`,
          {
            vendorId: territoryHeadId,
            gst_number: extracted.gst_number,
            gst_cert_pic: fileUrl,
          }
        );
      }
    } catch (err) {
      console.error(err);
      alert("GST OCR failed");
    } finally {
      setLoadingGST(false);
    }
  };

  const saveGstAndNext = async () => {
    try {
      if (!territoryHeadId) {
        alert("Missing territoryHeadId. Complete Step 1 first.");
        return;
      }
      // if (!gstFile) { alert("Please upload the GST certificate file."); return; }

      const fd = new FormData();
      fd.append("vendorId", territoryHeadId);
      fd.append("document", gstFile);
      fd.append("gst_number", (formData.gstNumber || "").toUpperCase());
      fd.append("gst_legal_name", formData.gstLegalName || "");
      fd.append("gst_constitution", formData.gstConstitution || "");
      fd.append("gst_address[floorNo]", formData.gst_floorNo || "");
      fd.append("gst_address[buildingNo]", formData.gst_buildingNo || "");
      fd.append("gst_address[street]", formData.gst_street || "");
      fd.append("gst_address[locality]", formData.gst_locality || "");
      fd.append("gst_address[district]", formData.gst_district || "");

      setLoadingGST(true);
      const r = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/territory-head/gst`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 45000,
        }
      );

      if (!r?.data?.ok) throw new Error(r?.data?.message || "Save failed");

      // advance to Bank step
      setStep(4);
      // optional: toast
    } catch (e) {
      console.error(e);
      alert("Save failed");
    } finally {
      setLoadingGST(false);
    }
  };

  // -------------------- Bank Details (Step 4) --------------------
  const [bankFile, setBankFile] = useState(null);
  const [bankData, setBankData] = useState({
    account_holder_name: "",
    account_no: "",
    ifcs_code: "",
    bank_name: "",
    branch_name: "",
    bank_address: "",
  });

  // const onBankFileChange = (e) => {
  //   const file = e.target.files?.[0] || null;
  //   setBankFile(file);
  // };

  // -------------------- Bank OCR Upload --------------------
  const onBankUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("document", file);

    setLoadingGST(true); // reuse loading spinner state or create new for bank
    try {
      const resp = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/territory-head/ocr?side=bank`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
          timeout: 45000,
        }
      );

      const data = resp?.data || {};
      if (!data.success) throw new Error("Bank OCR failed");

      const extracted = data.extracted || {};
      const fileUrl = data.fileUrl || null;

      setBankData((prev) => ({
        ...prev,
        account_holder_name:
          extracted.account_holder_name || prev.account_holder_name,
        account_no: extracted.account_number || prev.account_no,
        ifcs_code: (extracted.ifsc_code || prev.ifcs_code || "").toUpperCase(),
        bank_name: extracted.bank_name || prev.bank_name,
        branch_name: extracted.branch_name || prev.branch_name,
        bank_address: extracted.bank_address || prev.bank_address,
      }));

      // optional: immediately save bank file + minimal details
      if (extracted.account_number && fileUrl) {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/api/territory-head/step-by-key`,
          {
            vendorId: territoryHeadId,
            bank_doc_pic: fileUrl,
            account_no: extracted.account_number,
            ifcs_code: extracted.ifsc_code,
          }
        );
      }
    } catch (err) {
      console.error(err);
      alert("Bank OCR failed");
    } finally {
      setLoadingGST(false);
    }
  };

  const saveBankDetails = async () => {
    const vid = territoryHeadId || localStorage.getItem("territoryHeadId");
    if (!vid) {
      alert("Territory Head ID is required. Complete PAN/Aadhaar step first.");
      return;
    }

    const fd = new FormData();
    fd.append("document", bankFile); // your uploaded file
    fd.append("account_holder_name", bankData.account_holder_name || "");
    fd.append("account_no", bankData.account_no || "");
    fd.append("ifcs_code", (bankData.ifcs_code || "").toUpperCase());
    fd.append("bank_name", bankData.bank_name || "");
    fd.append("branch_name", bankData.branch_name || "");
    fd.append("bank_address", bankData.bank_address || "");

    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/territory-head/${vid}/bank`,
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (!response?.data?.ok)
        throw new Error(response?.data?.message || "Save failed");

      alert("Bank details saved successfully.");
      setStep(5); // Move to outlet details step
    } catch (error) {
      console.error("Error saving bank details:", error);
      alert("Failed to save bank details.");
    }
  };

  // -------------------- Outlet Details (Step 5) --------------------
  const [outlet, setOutlet] = useState({
    outlet_name: "",
    manager_name: "",
    manager_mobile: "",
    outlet_phone: "",
    street: "",
    city: "",
    district: "",
    state: "",
    country: "India",
    postalCode: "",
    lat: "",
    lng: "",
  });
  const [outletImage, setOutletImage] = useState(null);

  // file change handler
  const handleOutletImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setOutletImage(e.target.files[0]);
    }
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setOutlet((prev) => ({ ...prev, lat: latitude, lng: longitude }));
          alert(
            `Location fetched: Latitude ${latitude}, Longitude ${longitude}`
          );
        },
        (error) => {
          console.error("Error fetching location:", error);
          alert("Failed to fetch location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const saveOutletAndNext = async () => {
    const vid = territoryHeadId || localStorage.getItem("territoryHeadId");
    if (!vid) {
      alert("Missing territoryHeadId. Complete earlier steps first.");
      return;
    }

    const fd = new FormData();
    fd.append("vendorId", vid);
    fd.append("outlet_name", outlet.outlet_name);
    fd.append("outlet_manager_name", outlet.manager_name);
    fd.append("outlet_contact_no", outlet.manager_mobile);
    fd.append("outlet_phone_no", outlet.outlet_phone);

    fd.append("outlet_location[street]", outlet.street);
    fd.append("outlet_location[city]", outlet.city);
    fd.append("outlet_location[district]", outlet.district);
    fd.append("outlet_location[state]", outlet.state);
    fd.append("outlet_location[country]", outlet.country || "India");
    fd.append("outlet_location[postalCode]", outlet.postalCode);

    if (outlet.lat) fd.append("outlet_coords[lat]", outlet.lat);
    if (outlet.lng) fd.append("outlet_coords[lng]", outlet.lng);

    if (outletImage) fd.append("outlet_nameboard_image", outletImage);

    const r = await axios.put(
      `${import.meta.env.VITE_API_URL}/api/territory-head/outlet`,
      fd,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (!r?.data?.ok) throw new Error(r?.data?.message || "Save failed");
    navigate("/territory-head-success");

    alert("Outlet details saved");
  };

  // Optional final registration helper (kept for parity)
  const registerTerritoryHead = async () => {
    const fd = new FormData();
    fd.append("vendorId", territoryHeadId);
    fd.append("pan_number", formData.panNumber);
    fd.append("aadhar_number", formData.aadharNumber);
    fd.append("gst_number", formData.gstNumber);
    fd.append("account_no", bankData.account_no);
    fd.append("outlet_name", outlet.outlet_name);
    fd.append("outlet_coords[lat]", outlet.lat);
    fd.append("outlet_coords[lng]", outlet.lng);

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/territory-head/register`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!response?.data?.ok)
        throw new Error(response?.data?.message || "Registration failed");

      alert("Registration successful!");
      window.location.href = "/territory-head-success";
    } catch (error) {
      console.error("Error registering territory head:", error);
      alert("Failed to register territory head.");
    }
  };

  // Restore id on mount
  useEffect(() => {
    const id = localStorage.getItem("territoryHeadId");
    if (id) setTerritoryHeadId(id);
  }, []);

  return (
    <div>
      <h4 className="mb-3">Territory Head Registration</h4>
      <div className="mb-3">
        <strong>Step {step} of 5</strong>
      </div>

      {step === 1 && (
        <div>
          <h5 className="mb-3">Step 1: PAN Card Details</h5>
          <Form.Group className="mb-3">
            <Form.Label>Upload PAN (JPG, JPEG, PNG, PDF)</Form.Label>
            <Form.Control
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={onPanUpload}
            />
            {loadingPan && (
              <div className="mt-2">
                <Spinner size="sm" /> Reading PAN…
              </div>
            )}
          </Form.Group>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, firstName: e.target.value }))
                }
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Surname (Last Name)</Form.Label>
              <Form.Control
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, lastName: e.target.value }))
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>DOB (DD/MM/YYYY)</Form.Label>
              <Form.Control
                value={formData.dob}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, dob: e.target.value }))
                }
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>PAN Number</Form.Label>
              <Form.Control
                value={formData.panNumber}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    panNumber: e.target.value.toUpperCase(),
                  }))
                }
              />
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <Button variant="primary" onClick={saveStep1AndNext}>
              Save & Continue
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h5 className="mb-3">Step 2: Aadhaar Details</h5>

          <Form.Group className="mb-3">
            <Form.Label>Upload Aadhaar Front (JPG, JPEG, PNG, PDF)</Form.Label>
            <Form.Control
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={onAadhaarFront}
            />
            {loadingAFront && (
              <div className="mt-2">
                <Spinner size="sm" /> Reading front…
              </div>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Aadhaar Back (JPG, JPEG, PNG, PDF)</Form.Label>
            <Form.Control
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              onChange={onAadhaarBack}
            />
            {loadingABack && (
              <div className="mt-2">
                <Spinner size="sm" /> Reading back…
              </div>
            )}
          </Form.Group>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                value={formData.firstName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, firstName: e.target.value }))
                }
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Surname (Last Name)</Form.Label>
              <Form.Control
                value={formData.lastName}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, lastName: e.target.value }))
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>DOB (DD/MM/YYYY)</Form.Label>
              <Form.Control
                value={formData.dob}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, dob: e.target.value }))
                }
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Aadhaar Number</Form.Label>
              <Form.Control
                value={formData.aadharNumber}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    aadharNumber: fmtAadhaarUI(e.target.value),
                  }))
                }
              />
            </Col>
          </Row>

          <Form.Group className="mb-2">
            <Form.Label>Street</Form.Label>
            <Form.Control
              value={formData.register_street}
              onChange={(e) =>
                setFormData((p) => ({ ...p, register_street: e.target.value }))
              }
            />
          </Form.Group>

          <Row>
            <Col md={4} className="mb-2">
              <Form.Label>City</Form.Label>
              <Form.Control
                value={formData.register_city}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, register_city: e.target.value }))
                }
              />
            </Col>
            <Col md={4} className="mb-2">
              <Form.Label>State/UT</Form.Label>
              <Form.Control
                value={formData.register_state}
                onChange={(e) =>
                  setFormData((p) => ({ ...p, register_state: e.target.value }))
                }
              />
            </Col>
            <Col md={4} className="mb-3">
              <Form.Label>PIN</Form.Label>
              <Form.Control
                value={formData.register_postalCode}
                onChange={(e) =>
                  setFormData((p) => ({
                    ...p,
                    register_postalCode: e.target.value,
                  }))
                }
              />
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" onClick={saveStep2AndNext}>
              Save & Continue
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h5 className="mb-3">Step 3: GST Details</h5>

          <div className="mb-3">
            <label>Upload GST Certificate (PDF/JPG/PNG)</label>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={onGstUpload}
            />
            {loadingGST && <div className="mt-2">Saving GST…</div>}
          </div>

          <div className="mb-3">
            <label>GST Number</label>
            <input
              value={formData.gstNumber}
              onChange={(e) =>
                setFormData((p) => ({
                  ...p,
                  gstNumber: e.target.value.toUpperCase(),
                }))
              }
            />
          </div>

          <div className="mb-3">
            <label>Legal Name</label>
            <input
              value={formData.gstLegalName}
              onChange={(e) =>
                setFormData((p) => ({ ...p, gstLegalName: e.target.value }))
              }
            />
          </div>

          <div className="col-span-1 mt-3 w-full">
            <div className="input-item mb-[8px]">
              <label className="block text-[14px] font-medium text-secondary mb-[8px]">
                Constitution of Business
              </label>
              <Select
                options={constitutionOptions}
                value={
                  constitutionOptions.find(
                    (option) =>
                      option.label === formData.constitution_of_business
                  ) || null
                }
                onChange={(option) =>
                  handleSelectChange(option, {
                    name: "constitution_of_business",
                  })
                }
                placeholder="Select Constitution"
                isSearchable
                className="w-full border rounded-lg"
              />
            </div>
          </div>

          <div className="mt-3">
            <label>Floor No.</label>
            <input
              value={formData.gst_floorNo}
              onChange={(e) =>
                setFormData((p) => ({ ...p, gst_floorNo: e.target.value }))
              }
            />
            <label>Building/Flat No.</label>
            <input
              value={formData.gst_buildingNo}
              onChange={(e) =>
                setFormData((p) => ({ ...p, gst_buildingNo: e.target.value }))
              }
            />
            <label>Road/Street</label>
            <input
              value={formData.gst_street}
              onChange={(e) =>
                setFormData((p) => ({ ...p, gst_street: e.target.value }))
              }
            />
            <label>Locality/Sub-locality</label>
            <input
              value={formData.gst_locality}
              onChange={(e) =>
                setFormData((p) => ({ ...p, gst_locality: e.target.value }))
              }
            />
            <label>District</label>
            <input
              value={formData.gst_district}
              onChange={(e) =>
                setFormData((p) => ({ ...p, gst_district: e.target.value }))
              }
            />
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" onClick={saveGstAndNext}>
              Save & Continue
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h5 className="mb-3">Step 4: Bank Details</h5>

          <Form.Group className="mb-3">
            <Form.Label>
              Upload Cancelled Cheque or Bank Letter (PDF/JPG/PNG)
            </Form.Label>
            <Form.Control
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={onBankUpload}
            />
          </Form.Group>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Account Holder Name</Form.Label>
              <Form.Control
                value={bankData.account_holder_name}
                onChange={(e) =>
                  setBankData((p) => ({
                    ...p,
                    account_holder_name: e.target.value,
                  }))
                }
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                value={bankData.account_no}
                onChange={(e) =>
                  setBankData((p) => ({ ...p, account_no: e.target.value }))
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>IFSC Code</Form.Label>
              <Form.Control
                value={bankData.ifcs_code}
                onChange={(e) =>
                  setBankData((p) => ({
                    ...p,
                    ifcs_code: e.target.value.toUpperCase(),
                  }))
                }
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Bank Name</Form.Label>
              <Form.Control
                value={bankData.bank_name}
                onChange={(e) =>
                  setBankData((p) => ({ ...p, bank_name: e.target.value }))
                }
              />
            </Col>
          </Row>

          <Row>
            <Col md={6} className="mb-3">
              <Form.Label>Branch</Form.Label>
              <Form.Control
                value={bankData.branch_name}
                onChange={(e) =>
                  setBankData((p) => ({ ...p, branch_name: e.target.value }))
                }
              />
            </Col>
            <Col md={6} className="mb-3">
              <Form.Label>Bank Address</Form.Label>
              <Form.Control
                as="textarea"
                value={bankData.bank_address}
                onChange={(e) =>
                  setBankData((p) => ({ ...p, bank_address: e.target.value }))
                }
              />
            </Col>
          </Row>

          <div className="d-flex justify-content-end gap-2">
            <button
              type="button"
              onClick={() => saveBankDetails(bankFile, bankData)}
            >
              Save Bank Details
            </button>
          </div>
        </div>
      )}

      {step === 5 && (
        <div>
          <h5 className="mb-3">Step 5: Outlet Details</h5>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Outlet Name</Form.Label>
              <Form.Control
                value={outlet.outlet_name}
                onChange={(e) =>
                  setOutlet((p) => ({ ...p, outlet_name: e.target.value }))
                }
              />
            </Col>
            <Col md={6}>
              <Form.Label>Manager Name</Form.Label>
              <Form.Control
                value={outlet.manager_name}
                onChange={(e) =>
                  setOutlet((p) => ({ ...p, manager_name: e.target.value }))
                }
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Manager Mobile</Form.Label>
              <Form.Control
                value={outlet.manager_mobile}
                onChange={(e) =>
                  setOutlet((p) => ({ ...p, manager_mobile: e.target.value }))
                }
              />
            </Col>
            <Col md={6}>
              <Form.Label>Outlet Phone</Form.Label>
              <Form.Control
                value={outlet.outlet_phone}
                onChange={(e) =>
                  setOutlet((p) => ({ ...p, outlet_phone: e.target.value }))
                }
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Street</Form.Label>
              <Form.Control
                value={outlet.street}
                onChange={(e) =>
                  setOutlet((p) => ({ ...p, street: e.target.value }))
                }
              />
            </Col>
            <Col md={6}>
              <Form.Label>City</Form.Label>
              <Form.Control
                value={outlet.city}
                onChange={(e) =>
                  setOutlet((p) => ({ ...p, city: e.target.value }))
                }
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>District</Form.Label>
              <Form.Control
                value={outlet.district}
                onChange={(e) =>
                  setOutlet((p) => ({ ...p, district: e.target.value }))
                }
              />
            </Col>
            <Col md={6}>
              <Form.Label>State</Form.Label>
              <Form.Control
                value={outlet.state}
                onChange={(e) =>
                  setOutlet((p) => ({ ...p, state: e.target.value }))
                }
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Country</Form.Label>
              <Form.Control
                value={outlet.country}
                onChange={(e) =>
                  setOutlet((p) => ({ ...p, country: e.target.value }))
                }
              />
            </Col>
            <Col md={6}>
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                value={outlet.postalCode}
                onChange={(e) =>
                  setOutlet((p) => ({ ...p, postalCode: e.target.value }))
                }
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Label>Latitude</Form.Label>
              <Form.Control
                value={outlet.lat}
                onChange={(e) =>
                  setOutlet((p) => ({ ...p, lat: e.target.value }))
                }
              />
            </Col>
            <Col md={6}>
              <Form.Label>Longitude</Form.Label>
              <Form.Control
                value={outlet.lng}
                onChange={(e) =>
                  setOutlet((p) => ({ ...p, lng: e.target.value }))
                }
              />
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Fetch Location</Form.Label>
            <Button variant="secondary" onClick={fetchLocation}>
              Use Current Location
            </Button>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Upload Outlet Nameboard Image (JPG, PNG)</Form.Label>
            <Form.Control
              type="file"
              accept=".jpg,.png"
              onChange={handleOutletImageChange}
            />
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <button type="button" onClick={saveOutletAndNext}>
              Save & Continue
            </button>
          </div>
        </div>
      )}

      {mismatch.show && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              width: "min(680px, 92vw)",
              background: "#fff",
              borderRadius: 12,
              boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
              padding: "20px 22px",
            }}
          >
            <h3 style={{ margin: "0 0 8px 0" }}>{mismatch.title}</h3>
            <div
              style={{
                maxHeight: 260,
                overflow: "auto",
                border: "1px solid #eee",
                borderRadius: 8,
                padding: "10px 12px",
              }}
            >
              {mismatch.items.map((it, idx) => (
                <div key={idx} style={{ marginBottom: 10 }}>
                  <div style={{ fontWeight: 600 }}>{it.label}</div>
                  <div style={{ fontSize: 13, color: "#666" }}>
                    Previous: {it.before || "(empty)"}
                  </div>
                  <div style={{ fontSize: 13 }}>
                    Now: {it.after || "(empty)"}
                  </div>
                </div>
              ))}
            </div>
            <div
              style={{
                display: "flex",
                gap: 10,
                justifyContent: "flex-end",
                marginTop: 12,
              }}
            >
              <button
                onClick={() =>
                  setMismatch({ show: false, title: "", items: [] })
                }
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "1px solid #ddd",
                  background: "#f7f7f7",
                  cursor: "pointer",
                }}
              >
                OK, I’ll review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
