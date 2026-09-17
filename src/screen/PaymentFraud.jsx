import Header from "@/components/Home/Header";
import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentFraud() {
  return (
    <div className="min-h-screen bg-gray-50 pt-32">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-emerald-700 font-bold">Payment & UPI Fraud</span>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
        
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-extrabold mb-6"
          >
            Payment Fraud
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-lg md:text-xl max-w-3xl text-white/90 leading-relaxed"
          >
            Payment fraud is rising rapidly in the digital world—impacting individuals 
            and businesses through unauthorized transactions, identity theft, and scams.
            Our mission is to help you stay aware, protected, and prepared.
          </motion.p>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="#F9FAFB"
            />
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">

        {/* Understanding Section */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-6"
          >
            Understanding Payment Fraud
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-gray-700 leading-relaxed text-lg mb-8 max-w-3xl"
          >
            Payment fraud takes multiple forms, and recognizing them early helps individuals stay protected.
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Credit Card Fraud",
                desc: "Unauthorized use of stolen card information to make purchases or withdraw money."
              },
              {
                title: "Phishing Scams",
                desc: "Fake emails, websites, and messages designed to steal financial information."
              },
              {
                title: "Online Transaction Fraud",
                desc: "Manipulating online payment platforms to complete unauthorized transactions."
              },
              {
                title: "Identity Theft",
                desc: "Using stolen personal details to open accounts or carry out fraudulent payments."
              },
              {
                title: "Fraudulent Payment Requests",
                desc: "Scammers impersonating officials or companies requesting money transfers."
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all"
              >
                <h3 className="text-xl font-semibold text-emerald-600 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-gray-200"></div>

        {/* How We Help Section */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
          >
            How We Help
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: "Immediate Response",
                desc: "Guidance on freezing accounts, alerting your bank, and securing compromised data."
              },
              {
                title: "Legal Assistance",
                desc: "Support in filing formal complaints and connecting with legal professionals."
              },
              {
                title: "Education & Prevention",
                desc: "Workshops, training, and awareness materials to help prevent fraud incidents."
              },
              {
                title: "Ongoing Support",
                desc: "Continued monitoring and protective guidance even after the fraud is resolved."
              }
            ].map((help, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-gray-50 p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all"
              >
                <h3 className="text-xl font-semibold text-emerald-600 mb-2">
                  {help.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{help.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
