import React from "react";
import { CheckCircle, Users, Award } from "lucide-react";
import playstore from "../../assets/playstore.png";
import appstore from "../../assets/appstore.png";

const Hero = () => (
  <section
    id="home"
    className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-8 items-center"
  >
    <div>
      <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">
        Welcome To <span className="text-emerald-600">Cyber Awareness NGO</span>
      </h1>

      <p className="mt-4 text-lg text-gray-600">
        We are dedicated to fostering global cyber welfare by empowering
        individuals and communities.
      </p>

      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <a
          className="bg-emerald-600 text-white px-6 py-3 rounded-full font-medium hover:bg-emerald-700 transition"
          href="#services"
        >
          Our Services
        </a>
        <a
          className="border border-emerald-600 text-emerald-600 px-6 py-3 rounded-full font-medium hover:bg-emerald-50 transition"
          href="#contact"
        >
          Request Help
        </a>
      </div>

      {/* Trust Badges */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 p-2 rounded-full">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="font-bold text-gray-900">24/7 Support</div>
            <div className="text-sm text-gray-500">Always available</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 p-2 rounded-full">
            <Users className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Expert Team</div>
            <div className="text-sm text-gray-500">Cyber & legal experts</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-emerald-50 p-2 rounded-full">
            <Award className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div className="font-bold text-gray-900">Proven Track Record</div>
            <div className="text-sm text-gray-500">Thousands helped</div>
          </div>
        </div>
      </div>

      {/* App Store Badges */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4">
        <a
          href="https://play.google.com/store/apps/details?id=com.cybercrime&pcampaignid=web_share"
          target="_blank"
          rel="noopener noreferrer"
          className="transform transition hover:scale-105"
        >
          <img
            src={playstore}
            alt="Get it on Google Play"
            className="h-12 sm:h-14 w-auto drop-shadow-md"
          />
        </a>

        <a
          href="https://apps.apple.com/in/app/cyber-help-desk/id6751521460"
          target="_blank"
          rel="noopener noreferrer"
          className="transform transition hover:scale-105"
        >
          <img
            src={appstore}
            alt="Download on the App Store"
            className="h-12 sm:h-14 w-auto drop-shadow-md"
          />
        </a>
      </div>

      {/* Contact Info */}
      <div className="mt-8 text-sm text-gray-600">
        <strong>Call Founder:</strong>{" "}
        <a href="tel:+919310597258" className="text-emerald-600 font-semibold hover:underline">
          +91 93105 97258
        </a>
      </div>
    </div>

    {/* Optional: Add an image/illustration on the right side later */}
    {/* <div className="hidden lg:block">
      <img src="/hero-illustration.svg" alt="Cyber Awareness" className="w-full" />
    </div> */}
  </section>
);

export default Hero;