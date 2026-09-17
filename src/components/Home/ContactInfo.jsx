// src/components/Home/ContactInfo.jsx
import React from "react";
import { MapPin, Phone, Mail } from "lucide-react";

const ContactInfo = () => (
  <aside className="space-y-6">
    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-2">Contact Us</h3>
      <p className="text-gray-600">
        Call us 24/7: <a href="tel:+919310597258" className="text-emerald-600">+91 93105 97258</a>
      </p>
      <p className="text-gray-600">
        Email: <a href="mailto:support@cyberawareness.ngo" className="text-emerald-600">support@cyberawareness.ngo</a>
      </p>
      <p className="mt-3 text-gray-600">
        <MapPin className="inline w-4 h-4 mr-1 text-emerald-600" /> Patti Mundala, Town Khekra, District Baghpat, UP - 250101
      </p>
    </div>

    <div className="bg-white p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold">Why Choose Us</h3>
      <ul className="mt-3 space-y-2 text-gray-600">
        <li>24/7 Support</li>
        <li>Expert Team</li>
        <li>Personalized Assistance</li>
        <li>Confidential & Secure</li>
      </ul>
    </div>
  </aside>
);

export default ContactInfo;
