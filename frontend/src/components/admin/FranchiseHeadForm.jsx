import React, { useState, useEffect } from "react";
import API from "../../utils/api"; // same helper you use
import { Form, Button, Spinner, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

const constitutionOptions = [
  { value: "proprietorship", label: "Proprietorship" },
  { value: "partnership", label: "Partnership" },
  { value: "private_ltd", label: "Private Limited" },
  { value: "public_ltd", label: "Public Limited" },
  { value: "llp", label: "LLP" },
  { value: "trust", label: "Trust" },
  { value: "society", label: "Society" },
];
export default function FranchiseHeadForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [docId, setDocId] = useState(
    () => localStorage.getItem("franchiseHeadId") || ""
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
  const [bankFile, setBankFile] = useState(null);

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

  // ---------- Step 1: PAN ----------
  const onPanUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("document", file);
    setLoadingPan(true);
    try {
      const { data } = await API.post("/api/franchise-head/ocr", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!data?.success) throw new Error("PAN OCR failed");

      const { extracted = {}, fileUrl } = data;
      const next = {
        firstName: extracted.name || formData.firstName,
        lastName: extracted.fatherName || formData.lastName,
        dob: extracted.dob || formData.dob,
        panNumber: (
          extracted.panNumber ||
          formData.panNumber ||
          ""
        ).toUpperCase(),
      };
      setFormData((p) => ({ ...p, ...next }));

      if (next.panNumber && fileUrl) {
        const r = await API.post("/api/franchise-head/step-by-key", {
          vendorId: docId,
          pan_number: next.panNumber,
          pan_pic: fileUrl,
        });
        const id = r?.data?.data?._id;
        if (id && !docId) {
          setDocId(id);
          localStorage.setItem("franchiseHeadId", id);
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
      const r = await API.post("/api/franchise-head/step-by-key", {
        vendorId: docId,
        pan_number: (formData.panNumber || "").toUpperCase(),
        vendor_fname: formData.firstName || "",
        vendor_lname: formData.lastName || "",
        dob: formData.dob || "",
      });
      const id = r?.data?.data?._id;
      if (id) {
        setDocId(id);
        localStorage.setItem("franchiseHeadId", id);
      }
      setStep(2);
    } catch (e) {
      console.error(e);
      alert(e?.response?.data?.message || e.message || "Save failed");
    }
  };

  // ---------- Step 2: Aadhaar ----------
  const onAadhaarFront = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("document", file);
    setLoadingAFront(true);
    try {
      const { data } = await API.post(
        "/api/franchise-head/ocr?side=aadhaar_front",
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (!data?.success) throw new Error("Aadhaar front OCR failed");

      const a12 = (data?.extracted?.aadhaarNumber || "").replace(/\D/g, "");
      if (a12) {
        setFormData((p) => ({ ...p, aadharNumber: fmtAadhaarUI(a12) }));
        const r = await API.post("/api/franchise-head/step-by-key", {
          vendorId: docId,
          aadhar_number: a12,
          aadhar_pic_front: data.fileUrl || undefined,
          side: "front",
        });
        const id = r?.data?.data?._id;
        if (id && !docId) {
          setDocId(id);
          localStorage.setItem("franchiseHeadId", id);
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
      const { data } = await API.post(
        "/api/franchise-head/ocr?side=aadhaar_back",
        fd,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      if (!data?.success) throw new Error("Aadhaar back OCR failed");

      const a12 = (data?.extracted?.aadhaarNumber || "").replace(/\D/g, "");
      const addr = data?.extracted?.address || {};
      setFormData((p) => ({
        ...p,
        aadharNumber: a12 ? fmtAadhaarUI(a12) : p.aadharNumber,
        register_street: addr.street || "",
        register_city: addr.city || "",
        register_state: addr.state || "",
        register_postalCode: addr.postalCode || "",
        register_country: "India",
      }));

      await API.post("/api/franchise-head/step-by-key", {
        vendorId: docId,
        aadhar_number: a12,
        aadhar_pic_back: data.fileUrl || undefined,
        side: "back",
        register_business_address: {
          street: addr.street || "",
          city: addr.city || "",
          state: addr.state || "",
          country: "India",
          postalCode: addr.postalCode || "",
        },
      });
    } catch (e2) {
      console.error(e2);
      alert("Aadhaar back OCR failed");
    } finally {
      setLoadingABack(false);
    }
  };

  const saveStep2AndNext = async () => {
    const aRaw = (formData.aadharNumber || "").replace(/\D/g, "");
    if (!aRaw) return alert("Missing Aadhaar number");
    await API.post("/api/franchise-head/step-by-key", {
      vendorId: docId,
      aadhar_number: aRaw,
      register_business_address: {
        street: formData.register_street || "",
        city: formData.register_city || "",
        state: formData.register_state || "",
        country: formData.register_country || "India",
        postalCode: formData.register_postalCode || "",
      },
    });
    setStep(3);
  };

  // ---------- Step 3: GST ----------
  const onGstUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("document", file);
    setLoadingGST(true);
    try {
      const { data } = await API.post("/api/franchise-head/ocr?side=gst", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (!data?.success) throw new Error("GST OCR failed");

      const ex = data.extracted || {};
      setFormData((p) => ({
        ...p,
        gstNumber: ex.gst_number || p.gstNumber,
        gstLegalName: ex.legal_name || p.gstLegalName,
        gstConstitution: ex.constitution || p.gstConstitution,
        gst_floorNo: ex.address?.floorNo || p.gst_floorNo,
        gst_buildingNo: ex.address?.buildingNo || p.gst_buildingNo,
        gst_street: ex.address?.street || p.gst_street,
        gst_locality: ex.address?.locality || p.gst_locality,
        gst_district: ex.address?.district || p.gst_district,
      }));
      if (ex.gst_number && data.fileUrl) {
        await API.post("/api/franchise-head/step-by-key", {
          vendorId: docId,
          gst_number: ex.gst_number,
          gst_cert_pic: data.fileUrl,
        });
      }
    } catch (err) {
      console.error(err);
      alert("GST OCR failed");
    } finally {
      setLoadingGST(false);
    }
  };

  const saveGstAndNext = async () => {
    const fd = new FormData();
    fd.append("vendorId", docId);
    fd.append("document", null); // optional file, handled by /ocr above
    fd.append("gst_number", (formData.gstNumber || "").toUpperCase());
    fd.append("gst_legal_name", formData.gstLegalName || "");
    fd.append("gst_constitution", formData.gstConstitution || "");
    fd.append("gst_address[floorNo]", formData.gst_floorNo || "");
    fd.append("gst_address[buildingNo]", formData.gst_buildingNo || "");
    fd.append("gst_address[street]", formData.gst_street || "");
    fd.append("gst_address[locality]", formData.gst_locality || "");
    fd.append("gst_address[district]", formData.gst_district || "");
    await API.put("/api/franchise-head/gst", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setStep(4);
  };

  // ---------- Step 4: Bank ----------
  const [bankData, setBankData] = useState({
    account_holder_name: "",
    account_no: "",
    ifcs_code: "",
    bank_name: "",
    branch_name: "",
    bank_address: "",
  });

  const onBankUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("document", file);
    const { data } = await API.post("/api/franchise-head/ocr?side=bank", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (data?.success) {
      const ex = data.extracted || {};
      setBankData((p) => ({
        ...p,
        account_holder_name: ex.account_holder_name || p.account_holder_name,
        account_no: ex.account_number || p.account_no,
        ifcs_code: (ex.ifsc_code || p.ifcs_code || "").toUpperCase(),
        bank_name: ex.bank_name || p.bank_name,
        branch_name: ex.branch_name || p.branch_name,
        bank_address: ex.bank_address || p.bank_address,
      }));
    }
  };
  const saveOutletAndNext = async () => {
    const vid = docId || localStorage.getItem("vendorId");
    if (!vid) {
      alert("Missing vendorId. Complete earlier steps first.");
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

    const r = await API.put("/api/franchise-head/outlet", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (!r?.data?.ok) throw new Error(r?.data?.message || "Save failed");
    navigate("/franchise-head-success");

    alert("Outlet details saved");
    // setStep(6);
  };
  const saveBankDetails = async () => {
    const fd = new FormData();
    fd.append("account_holder_name", bankData.account_holder_name || "");
    fd.append("account_no", bankData.account_no || "");
    fd.append("ifcs_code", (bankData.ifcs_code || "").toUpperCase());
    fd.append("bank_name", bankData.bank_name || "");
    fd.append("branch_name", bankData.branch_name || "");
    fd.append("bank_address", bankData.bank_address || "");
    await API.put(`/api/franchise-head/${docId}/bank`, fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    setStep(5);
  };

  // ---------- Step 5: Outlet ----------
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
  const fetchLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) =>
        setOutlet((p) => ({
          ...p,
          lat: coords.latitude,
          lng: coords.longitude,
        })),
      () => alert("Failed to fetch location")
    );
  };
  const handleOutletImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setOutletImage(e.target.files[0]);
    }
  };

  const saveOutletAndFinish = async () => {
    const fd = new FormData();
    fd.append("vendorId", docId);
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

    const r = await API.put("/api/franchise-head/outlet", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (!r?.data?.ok) return alert("Save failed");
    navigate("/franchise-head-success");
  };

  useEffect(() => {
    const id = localStorage.getItem("franchiseHeadId");
    if (id) setDocId(id);
  }, []);

  return (
    <div>
      <h4 className="mb-3">Franchise Head Registration</h4>
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
            <Button onClick={saveStep1AndNext}>Save & Continue</Button>
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
