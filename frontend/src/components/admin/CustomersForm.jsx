import React, { useState, useEffect } from "react";

const CustomersForm = ({ customer, onSave, setIsAddEditModalOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    phone: "",
  });

  // Update formData when customer prop changes
  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer?.name || "",
        email: customer?.email || "",
        password: customer?.password || "",
        role: "user",
        phone: customer?.userdetails?.phone || "",
      });
    }
  }, [customer]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value || "", // Ensuring empty string instead of undefined
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();

    if (customer?._id) {
      submissionData.append("_id", customer._id);
    }
    submissionData.append("name", formData.name);
    submissionData.append("email", formData.email);
    submissionData.append("phone", formData.phone);
    submissionData.append("role", formData.role);
    submissionData.append("password", formData.password);

    console.log("Submitting User Data:", formData);
    onSave(submissionData);

    // Reset form after submission
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "user",
      phone: "",
    });
  };

  return (
    <div className="max-w-[50vw] w-full mx-auto bg-white border border-gray-400 p-8 shadow-md rounded-md relative">
      <span className="popup-close" onClick={() => setIsAddEditModalOpen(false)}><i className="ri-close-circle-line"></i></span>
      <h2 className="text-2xl font-semibold text-center mb-6">
        {customer ? "Edit Vendor" : "Add Vendor"}
      </h2>
      <div className="input-box-form mt-[20px]">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap mx-[-12px]">
            {/* First Name */}
            <div className="w-full px-[12px]">
              <div className="input-item mb-[24px]">
                <label className="block text-[14px] font-medium text-secondary mb-[8px]">
                  First Name *
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter your First Name"
                  className="w-full p-[10px] text-[14px] border border-[#eee] rounded-[10px]"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div className="w-full px-[12px]">
              <div className="input-item mb-[24px]">
                <label className="block text-[14px] font-medium text-secondary mb-[8px]">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your Email"
                  className="w-full p-[10px] text-[14px] border border-[#eee] rounded-[10px]"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Phone */}
            <div className="w-full px-[12px]">
              <div className="input-item mb-[24px]">
                <label className="block text-[14px] font-medium text-secondary mb-[8px]">
                  Phone *
                </label>
                <input
                  type="text"
                  name="phone"
                  placeholder="88888 88888"
                  className="w-full p-[10px] text-[14px] border border-[#eee] rounded-[10px]"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password */}
            { !customer && (
              <div className="w-full px-[12px]">
                <div className="input-item mb-[24px]">
                  <label className="block text-[14px] font-medium text-secondary mb-[8px]">
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your Password"
                    className="w-full p-[10px] text-[14px] border border-[#eee] rounded-[10px]"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="w-full px-[12px]">
              <div className="input-button">
                <button
                  type="submit"
                  className="bb-btn-2 inline-block py-[10px] px-[25px] text-[14px] font-medium text-white bg-[#6c7fd8] rounded-[10px] hover:bg-transparent hover:border-[#3d4750] hover:text-secondary border"
                >
                  {customer ? "Update Vendor" : "Create Vendor"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CustomersForm;