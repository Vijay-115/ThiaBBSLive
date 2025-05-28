import React, { useState, useEffect } from "react";
import Select from "react-select";

const UserForm = ({ vendor, onSave, setIsAddEditModalOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "customer", // Default role
    // referredBy: "",
  });
  const [rolesOptions, setRolesOptions] = useState([]);
  const [roles, setRoles] = useState([
    {
      label:'Customer',
      value:'customer'
    },
    {
      label:'Agent',
      value:'agent'
    },
    {
      label:'Territory Head',
      value:'territory_head'
    },
    {
      label:'Franchise',
      value:'franchise'
    },
  ]);

  useEffect(() => {
    const formattedOptions = roles.map((role) => ({
      value: role.value,
      label: role.label,
    }));
    setRolesOptions(formattedOptions);
  }, [roles]);


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

  const handleSelectChange = (selectedOption) => {
    console.log(selectedOption);
    setFormData((prevData) => ({
      ...prevData,
      role: selectedOption.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="max-w-[50vw] w-full mx-auto bg-white border border-gray-400 p-8 shadow-md rounded-md relative">
      <span className="popup-close" onClick={() => setIsAddEditModalOpen(false)}><i className="ri-close-circle-line"></i></span>
      <h2 className="text-2xl font-semibold text-center mb-6">
        {vendor ? "Edit Vendor" : "Add Vendor"}
      </h2>
      <div className="input-box-form mt-[20px]">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full px-[12px] mt-[0px]">
            <div className="input-item mb-[12px]">
              <label className="block text-[14px] font-medium text-secondary mb-[8px]">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded-md"
              />
            </div>
          </div>

          <div className="w-full px-[12px] mt-[0px]">
            <div className="input-item mb-[12px]">
              <label className="block text-[14px] font-medium text-secondary mb-[8px]">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded-md"
              />
            </div>
          </div>

          <div className="w-full px-[12px] mt-[0px]">
            <div className="input-item mb-[12px]">
              <label className="block text-[14px] font-medium text-secondary mb-[8px]">Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full border p-2 rounded-md"
              />
            </div>
          </div>
          {/* Password */}
          { !vendor && (
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

          <div className="w-full px-[12px] mt-[0px]">
              <div className="input-item mb-[12px]">
                <label className="block text-[14px] font-medium text-secondary mb-[8px]">
                  Select Role*
                </label>
                <Select
                  options={rolesOptions}
                  value={rolesOptions.find(option => option.value === formData.role) || null}
                  onChange={handleSelectChange}
                  placeholder="Select Category"
                  isSearchable
                  className="w-full border rounded-lg"
                  name="role"
                />
              </div>
            </div>

          {/* {formData.role !== "franchise" && (
            <div>
              <label className="block text-[14px] font-medium text-secondary mb-[8px]">Referred By (Higher Role User ID)</label>
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

export default UserForm;