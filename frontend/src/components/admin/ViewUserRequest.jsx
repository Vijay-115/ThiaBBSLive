const ViewUserRequest = ({vendorData , onApprove, onDecline, setIsApproveModalOpen}) => {    
    console.log('ViewUserRequest',vendorData);
    const downloadImage = async (imageSrc) => {
        try {
            const response = await fetch(imageSrc, { mode: 'cors' });
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = imageSrc.split('/').pop() || 'download';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Image download failed:', error);
        }
    };

    return (
        <>
            <div className="flex justify-center items-center dark:bg-gray-900 py-10 ">
                <div className="grid gap-8 max-w-[991px] w-full">
                    <div id="back-div" className="bg-gradient-to-r from-logoSecondary to-logoPrimary rounded-[26px] m-4">
                        <div className="border-[20px] border-transparent rounded-[20px] dark:bg-gray-900 bg-white shadow-lg p-5 m-2">
                            <div className="h-[85vh] overflow-auto relative">
                                <span className="popup-close" onClick={() => setIsApproveModalOpen(false)}><i class="ri-close-circle-line"></i></span>       
                                <h1 className="pt-8 pb-6 font-bold dark:text-gray-400 text-3xl text-center">
                                    Vendor Request
                                </h1>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4">
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Vendor Name - {vendorData?.vendor_name}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Business Type - {vendorData?.business_type}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Brand Name - {vendorData?.brand_name}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Contact Person Name - {vendorData?.contact_person}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Contact Person Email - {vendorData?.email}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Contact Person Mobile - {vendorData?.mobile}</span>
                                    </div>
                                    <div className="col-span-3 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Contact Person Alternative Mobile - {vendorData?.atl_mobile}</span>
                                    </div>
                                    
                                    <h3 className="col-span-3 block text-[18px] font-medium text-primary mt-[20px]  mb-[8px]">Register Business Address </h3>

                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Street - {vendorData?.register_business_address?.street}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">State - {vendorData?.register_business_address?.state}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">City - {vendorData?.register_business_address?.city}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Country - {vendorData?.register_business_address?.country}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Post Code - {vendorData?.register_business_address?.postalCode}</span>
                                    </div>
                                    
                                    <h3 className="col-span-3 block text-[18px] font-medium text-primary mt-[20px]  mb-[8px]">Operational Address </h3>

                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Street - {vendorData?.operational_address?.street}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">State - {vendorData?.operational_address?.state}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">City - {vendorData?.operational_address?.city}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Country - {vendorData?.operational_address?.country}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Post Code - {vendorData?.operational_address?.postalCode}</span>
                                    </div>
                                    
                                    <h3 className="col-span-3 block text-[18px] font-medium text-primary mt-[20px]  mb-[8px]">Legal & Tax Information </h3>
                                    
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">PAN Number - {vendorData?.pan_number}</span>
                                    </div>
                                    {vendorData?.pan_pic && (  
                                        <div className="col-span-1 mt-3">
                                            <span className="block text-[14px] font-medium text-secondary">PAN PIC - <img onClick={() => window.open(import.meta.env.VITE_API_URL+''+vendorData?.pan_pic, '_blank')} src={import.meta.env.VITE_API_URL+''+vendorData?.pan_pic ?? ''} alt="new-product-1" className="w-[50px] h-[50px] border-[1px] border-solid border-[#eee] rounded-[10px] inline mx-2 p-1"/>
                                            <span title="download" onClick={() => downloadImage(import.meta.env.VITE_API_URL + vendorData?.pan_pic)}>
                                                <i className="ri-download-fill"></i>
                                            </span>
                                            </span>
                                        </div>
                                    )}
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">GST NUMBER - {vendorData?.gst_number}</span>
                                    </div>
                                    {vendorData?.gst_pic && (  
                                        <div className="col-span-1 mt-3">
                                            <span className="block text-[14px] font-medium text-secondary">GST PIC - <img onClick={() => window.open(import.meta.env.VITE_API_URL+''+vendorData?.gst_pic, '_blank')} src={import.meta.env.VITE_API_URL+''+vendorData?.gst_pic ?? ''} alt="new-product-1" className="w-[50px] h-[50px] border-[1px] border-solid border-[#eee] rounded-[10px] inline mx-2 p-1"/>
                                            <span title="download" onClick={() => downloadImage(import.meta.env.VITE_API_URL + vendorData?.gst_pic)}>
                                                <i className="ri-download-fill"></i>
                                            </span></span>
                                        </div>
                                    )}
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">FSSAI LICENSE - {vendorData?.fssai_license}</span>
                                    </div>
                                    {vendorData?.fssai_pic && (  
                                        <div className="col-span-1 mt-3">
                                            <span className="block text-[14px] font-medium text-secondary">FSSAI PIC - <img onClick={() => window.open(import.meta.env.VITE_API_URL+''+vendorData?.fssai_pic, '_blank')} src={import.meta.env.VITE_API_URL+''+vendorData?.fssai_pic ?? ''} alt="new-product-1" className="w-[50px] h-[50px] border-[1px] border-solid border-[#eee] rounded-[10px] inline mx-2 p-1"/>
                                            <span title="download" onClick={() => downloadImage(import.meta.env.VITE_API_URL + vendorData?.fssai_pic)}>
                                                <i className="ri-download-fill"></i>
                                            </span></span>
                                        </div>
                                    )}
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">SHOP ESTABLISH LICENSE - {vendorData?.shop_establish_license}</span>
                                    </div>
                                    {vendorData?.shop_establish_pic && (  
                                        <div className="col-span-1 mt-3">
                                            <span className="block text-[14px] font-medium text-secondary">SHOP ESTABLISH PIC - <img onClick={() => window.open(import.meta.env.VITE_API_URL+''+vendorData?.shop_establish_pic, '_blank')} src={import.meta.env.VITE_API_URL+''+vendorData?.shop_establish_pic ?? ''} alt="new-product-1" className="w-[50px] h-[50px] border-[1px] border-solid border-[#eee] rounded-[10px] inline mx-2 p-1"/>
                                            <span title="download" onClick={() => downloadImage(import.meta.env.VITE_API_URL + vendorData?.shop_establish_pic)}>
                                                <i className="ri-download-fill"></i>
                                            </span></span>
                                        </div>
                                    )}
                                    
                                    
                                    <h3 className="col-span-3 block text-[18px] font-medium text-primary mt-[20px]  mb-[8px]">Supermarket Outlets Locations</h3>

                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Store Manager Name - {vendorData?.outlet_manager_name}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Contact Number - {vendorData?.outlet_contact_no}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Street - {vendorData?.outlet_location?.street}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">State - {vendorData?.outlet_location?.state}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">City - {vendorData?.outlet_location?.city}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Country - {vendorData?.outlet_location?.country}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Post Code - {vendorData?.outlet_location?.postalCode}</span>
                                    </div>

                                    <h3 className="col-span-3 block text-[18px] font-medium text-primary mt-[20px]  mb-[8px]">Bank & Payment Details</h3>

                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Bank Name - {vendorData?.bank_name}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Account Holder’s Name - {vendorData?.account_holder_name}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Account Number - {vendorData?.account_no}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">IFSC Code - {vendorData?.ifcs_code}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Branch Name - {vendorData?.branch_name}</span>
                                    </div>
                                    {vendorData?.cancel_cheque_passbook && (  
                                    <div className="col-span-3 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Cancelled Cheque/Passbook Upload - <img onClick={() => window.open(import.meta.env.VITE_API_URL+''+vendorData?.cancel_cheque_passbook, '_blank')} src={import.meta.env.VITE_API_URL+''+vendorData?.cancel_cheque_passbook ?? ''} alt="new-product-1" className="w-[50px] h-[50px] border-[1px] border-solid border-[#eee] rounded-[10px] inline mx-2 p-1"/>
                                            <span title="download" onClick={() => downloadImage(import.meta.env.VITE_API_URL + vendorData?.cancel_cheque_passbook)}>
                                                <i className="ri-download-fill"></i>
                                            </span></span>
                                    </div>
                                    )}

                                    <h3 className="col-span-3 block text-[18px] font-medium text-primary mt-[20px]  mb-[8px]">Vendor Profile</h3>
                                    {vendorData?.profile_pic && (  
                                        <div className="col-span-1 mt-3">
                                            <span className="block text-[14px] font-medium text-secondary">Profile Picture/Logo - <img onClick={() => window.open(import.meta.env.VITE_API_URL+''+vendorData?.profile_pic, '_blank')} src={import.meta.env.VITE_API_URL+''+vendorData?.profile_pic ?? ''} alt="new-product-1" className="w-[50px] h-[50px] border-[1px] border-solid border-[#eee] rounded-[10px] inline mx-2 p-1"/>
                                            <span title="download" onClick={() => downloadImage(import.meta.env.VITE_API_URL + vendorData?.profile_pic)}>
                                                <i className="ri-download-fill"></i>
                                            </span></span>
                                        </div>
                                    )}
                                    {vendorData?.cover_pic && (  
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Cover Image for Vendor Storefron - <img onClick={() => window.open(import.meta.env.VITE_API_URL+''+vendorData?.cover_pic, '_blank')} src={import.meta.env.VITE_API_URL+''+vendorData?.cover_pic ?? ''} alt="new-product-1" className="w-[50px] h-[50px] border-[1px] border-solid border-[#eee] rounded-[10px] inline mx-2 p-1"/>
                                            <span title="download" onClick={() => downloadImage(import.meta.env.VITE_API_URL + vendorData?.cover_pic)}>
                                                <i className="ri-download-fill"></i>
                                            </span></span>
                                    </div>
                                    )}
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Brief Vendor Bio/Description - {vendorData?.vendor_bio}</span>
                                    </div>
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Product Category - {vendorData?.product_category}</span>
                                    </div>             
                                    <div className="col-span-1 mt-3">
                                        <span className="block text-[14px] font-medium text-secondary">Specify Category - {vendorData?.product_category_other}</span>
                                    </div>     
                                    {vendorData?.address_proof && (                  
                                        <div className="col-span-1 mt-3">
                                            <span className="block text-[14px] font-medium text-secondary">Address Proof (Utility Bill/Rent Agreement) - <img onClick={() => window.open(import.meta.env.VITE_API_URL+''+vendorData?.address_proof, '_blank')} src={import.meta.env.VITE_API_URL+''+vendorData?.address_proof ?? ''} alt="new-product-1" className="w-[50px] h-[50px] border-[1px] border-solid border-[#eee] rounded-[10px] inline mx-2 p-1"/>
                                            <span title="download" onClick={() => downloadImage(import.meta.env.VITE_API_URL + vendorData?.address_proof)}>
                                                <i className="ri-download-fill"></i>
                                            </span></span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 max-w-[300px] mx-auto">
                                    <button
                                        className="bg-green-700 text-white block mx-auto my-3 w-min px-4 py-1 rounded-md"
                                        onClick={() => onApprove(vendorData)}
                                    >
                                        Approve
                                    </button>
                                    <button
                                        className="bg-red-500 text-white block mx-auto my-3 w-min px-4 py-1 rounded-md"
                                        onClick={() => onDecline(vendorData)}
                                    >
                                        Decline
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewUserRequest;