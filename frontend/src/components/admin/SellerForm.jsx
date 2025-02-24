import React, { useState } from "react";
import { UserService } from "../../services/UserService";
import toast from "react-hot-toast";

const SellerForm = ({ seller }) => {
  const [formData, setFormData] = useState({
    name: seller ? seller.name : "",
    email: seller ? seller.email : "",
    password: seller ? seller.password : "",
    role: 'seller',
    phone: seller ? seller?.userdetails?.phone : "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting User Data:", formData);
    const data = await UserService.createUser(formData);

    if (data) {
        console.log("Profile updated successfully:", data);
        toast.success(data.message);
    } else {
        console.log("Failed to update profile");
        toast.error(data.message);
    }
    // Reset form
    setFormData({
      seller_id: "",
      name: "",
      email: "",
      password: "",
    });
  };

  return (
    <div className="max-w-[50vw] w-full mx-auto bg-white border border-gray-400 p-8 shadow-md rounded-md">
      <h2 className="text-2xl font-semibold text-center mb-6">
        {seller ? "Edit Seller" : "Add Seller"}
      </h2>
      <div className="input-box-form mt-[20px]">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-wrap mx-[-12px]">
            {/* First Name */}
            <div className="min-[992px]:w-[50%] w-full px-[12px]">
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
            <div className="min-[992px]:w-[50%] w-full px-[12px]">
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

            {/* Save Button */}
            <div className="w-full px-[12px]">
              <div className="input-button">
                <button
                  type="submit"
                  className="bb-btn-2 inline-block py-[10px] px-[25px] text-[14px] font-medium text-white bg-[#6c7fd8] rounded-[10px] hover:bg-transparent hover:border-[#3d4750] hover:text-secondary border"
                >
                  {seller ? "Update Seller" : "Create Seller"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellerForm;
