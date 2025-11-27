"use client";
import { useState } from "react";
import EmpressNavbar from "../components/EmpressNavbar";
import Footer from "../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
        
        // Hide success message after 5 seconds
        setTimeout(() => setSuccess(false), 5000);
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <EmpressNavbar />
    <section className="bg-black text-white min-h-screen py-16 px-6 md:px-20 flex flex-col">
      <h1 className="text-4xl md:text-6xl font-bold text-center">
        NEED A HAND?
      </h1>

      <div className="flex-1 grid md:grid-cols-2 gap-6 md:gap-16 items-center">
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Contact Us</h2>
            <p className="mb-1">info@empresspc.com</p>
            <p className="mb-1">+91-98765-43210</p>
            <p>
              MS-101, Sector D, Aliganj<br />
              Lucknow, Uttar Pradesh 226024
            </p>
          </div>

          <div className="w-full h-96 rounded-md overflow-hidden">
            <iframe
              title="map"
              className="w-full h-full border-none"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1779.1757173569677!2d80.93914200662265!3d26.89233959639682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399957e2ed209839%3A0x18c74c3fa5f0c56a!2sEmpress%20Computers%20(empresspc.in)!5e0!3m2!1sen!2sin!4v1749731724272!5m2!1sen!2sin"
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>
        
        <div className="w-full max-w-md mx-auto space-y-6">
          <h2 className="text-2xl font-semibold text-white">Send Us a Message</h2>
          
          {/* Success Message */}
          {success && (
            <div className="bg-green-500 bg-opacity-20 border border-green-500 text-green-400 px-4 py-3 rounded-md">
              <p className="font-semibold">Message sent successfully!</p>
              <p className="text-sm">We'll get back to you soon.</p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-500 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded-md">
              <p className="font-semibold">Error:</p>
              <p className="text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                required
                placeholder="First name *"
                className="bg-transparent border border-purple-500 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                onChange={handleChange}
                disabled={loading}
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                required
                placeholder="Last name *"
                className="bg-transparent border border-purple-500 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
                onChange={handleChange}
                disabled={loading}
              />
            </div>
            
            <input
              type="email"
              name="email"
              value={formData.email}
              required
              placeholder="Email *"
              className="w-full bg-transparent border border-purple-500 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              disabled={loading}
            />
            
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              placeholder="Phone"
              className="w-full bg-transparent border border-purple-500 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              onChange={handleChange}
              disabled={loading}
            />
            
            <textarea
              name="message"
              value={formData.message}
              rows="4"
              required
              placeholder="Leave us a message *"
              className="w-full bg-transparent border border-purple-500 rounded-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-vertical"
              onChange={handleChange}
              disabled={loading}
            ></textarea>
            
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-semibold py-2 px-6 rounded-md transition-all duration-300 ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              } text-white`}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Submit'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
}