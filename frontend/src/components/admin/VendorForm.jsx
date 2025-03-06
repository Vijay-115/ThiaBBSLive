import React, { useState, useEffect } from "react";

const VendorForm = ({ vendor, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer", // Default role
    // referredBy: "",
  });

  useEffect(() => {
    if (vendor) {
      setFormData({
        name: vendor.name || "",
        email: vendor.email || "",
        phone: vendor.userdetails?.phone || "",
        password: vendor?.password || "",
        role: vendor.role || "customer",
        // referredBy: vendor.userdetails?.referredBy || "",
      });
    }
  }, [vendor]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-[50vw] w-full mx-auto bg-white border border-gray-400 p-8 shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {vendor ? "Edit Vendor" : "Add Vendor"}
      </h2>
      <div className="input-box-form mt-[20px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-md"
            />
          </div>

          <div>
            <label className="block text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-md"
            />
          </div>
          {/* Password */}
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

          <div>
            <label className="block text-gray-700">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full border p-2 rounded-md block"
            >
              <option value="customer">Customer</option>
              <option value="agent">Agent</option>
              <option value="territory_head">Territory Head</option>
              <option value="franchise">Franchise</option>
            </select>
          </div>

          {/* {formData.role !== "franchise" && (
            <div>
              <label className="block text-gray-700">Referred By (Higher Role User ID)</label>
              <input
                type="text"
                name="referredBy"
                value={formData.referredBy}
                onChange={handleChange}
                required={formData.role !== "customer"}
                className="w-full border p-2 rounded-md"
              />
            </div>
          )} */}

          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default VendorForm;