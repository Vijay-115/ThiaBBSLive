export default function ContactUs() {
    return (
        <div className="flex flex-col items-center px-6 py-12">
            {/* Header */}
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Get in Touch</h1>
            <p className="text-gray-600 text-center max-w-lg mb-8">
                Need help? Contact us via phone, email, or live chat!
            </p>

            {/* Contact Info & Form */}
            <div className="grid lg:grid-cols-2 gap-10 w-full max-w-5xl">
                {/* Contact Info */}
                <div className="bg-gray-100 p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Contact Information</h2>
                    <div className="space-y-4">
                        <p className="flex items-center text-gray-700">
                        <i className="ri-phone-line leading-[0] text-[18px] text-primary mr-2"></i>
                            <a href="tel:+914134068916" className="hover:underline">+91 413 406 8916</a>
                        </p>
                        <p className="flex items-center text-gray-700">
                        <i className="ri-whatsapp-line leading-[0] text-[18px] text-primary mr-2"></i>
                            <a href="https://wa.me/9600729596" className="hover:underline">+91 9600729596</a>
                        </p>
                        <p className="flex items-center text-gray-700">
                        <i className="ri-mail-line leading-[0] text-[18px] text-primary mr-2"></i> 
                            <a href="mailto:info@bbscart.com" className="hover:underline">info@bbscart.com</a>
                        </p>
                        <p className="flex items-center text-gray-700">
                        <i className="ri-map-pin-line leading-[0] text-[18px] text-primary mr-2"></i> 
                            No: 20, 100 Feet Road, Ellaipillaichavady, Puducherry, 605005, India
                        </p>
                    </div>
                    <div className="w-full h-44 rounded-lg overflow-hidden shadow-lg mt-3">
                        <iframe 
                            title="Google Map"
                            className="w-full h-full"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3105.111111333881!2d77.59456631541396!3d12.971598320957213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c0344f9f%3A0x21aa123456789abc!2sThiaworld%20Jewellery!5e0!3m2!1sen!2sin!4v1645010000000"
                            allowFullScreen=""
                            loading="lazy"
                        ></iframe>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">Send Us a Message</h2>
                    <form className="space-y-4">
                        <input type="text" placeholder="Your Name" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" />
                        <input type="email" placeholder="Your Email" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400" />
                        <textarea placeholder="Your Message" rows="6" className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-400"></textarea>
                        <button type="submit" className="bg-gradient-to-r dark:text-gray-300 from-logoSecondary to-logoPrimary shadow-lg mt-6 p-2 text-white rounded-lg w-full hover:scale-105 hover:from-logoPrimary hover:to-logoSecondary transition duration-300 ease-in-out">
                            Send Us a Message 
                        </button>
                    </form>
                </div>
            </div>

            {/* Social Media Panel */}
            <div className="flex space-x-6 mt-8">
                <a href="https://www.facebook.com/profile.php?id=100090804256179" className="text-blue-600 text-3xl">
                    <i className="ri-facebook-circle-fill"></i>
                </a>
                <a href="https://www.instagram.com/bbscart/?hl=en#" className="text-pink-500 text-3xl">
                    <i className="ri-instagram-fill"></i>
                </a>
                <a href="https://wa.me/914134068916" className="text-green-500 text-3xl">
                    <i className="ri-whatsapp-fill"></i>
                </a>
            </div>

            {/* FAQ Section */}
            <div className="max-w-4xl mt-10 text-left">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    <details className="bg-gray-100 p-4 rounded-lg cursor-pointer" open>
                        <summary className="font-semibold">How long does shipping take?</summary>
                        <p className="text-gray-600 mt-2">Shipping typically takes 7-10 business days, depending on your location.</p>
                    </details>
                    <details className="bg-gray-100 p-4 rounded-lg cursor-pointer">
                        <summary className="font-semibold">Can I return a product?</summary>
                        <p className="text-gray-600 mt-2">Yes, you can return eligible products within 7 days of delivery.</p>
                    </details>
                    <details className="bg-gray-100 p-4 rounded-lg cursor-pointer">
                        <summary className="font-semibold">How can I track my order?</summary>
                        <p className="text-gray-600 mt-2">You will receive a tracking number via email once your order is shipped.</p>
                    </details>
                </div>
            </div>
        </div>
    );
}