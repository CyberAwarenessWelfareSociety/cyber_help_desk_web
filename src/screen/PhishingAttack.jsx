import Header from "@/components/Home/Header";
import { motion } from "framer-motion";
import { ChevronRight, AlertTriangle, Mail, MessageSquare, Phone, Target, Shield, ExternalLink, PhoneCall } from "lucide-react";
import { Link } from "react-router-dom";

export default function PhishingAttack() {
  return (
    <div className="pt-32 min-h-screen bg-gray-50">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-gray-600 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-emerald-700 font-bold">Phishing & Fake Links</span>
      </div>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 flex items-center gap-4">
              <AlertTriangle className="w-12 h-12 md:w-16 md:h-16" />
              Phishing Attack
            </h1>
            <p className="text-lg md:text-xl max-w-4xl leading-relaxed opacity-95">
              Phishing attacks are one of the most common and dangerous forms of cybercrime, 
              targeting individuals and organizations to steal sensitive information. These attacks 
              typically involve fraudulent communications that appear to come from legitimate sources, 
              such as banks, email providers, or well-known companies.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">

        {/* How Phishing Works */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-8"
          >
            How Phishing Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg text-gray-700 leading-relaxed max-w-4xl"
          >
            Phishing attacks usually involve sending emails, text messages, or social media messages 
            that impersonate a trusted entity. These messages often contain urgent or enticing language, 
            prompting the recipient to click on malicious links or download attachments.
            <br /><br />
            The links may lead to fake websites designed to look identical to genuine ones, where victims 
            are tricked into entering login credentials, credit card details, or other sensitive data. 
            Alternatively, attachments may install malware that silently steals information from your device.
          </motion.p>
        </section>

        <hr className="border-gray-200" />

        {/* Common Phishing Tactics */}
        <section>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-10"
          >
            Common Phishing Tactics
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Email Phishing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="p-4 bg-red-100 rounded-xl group-hover:bg-red-500 transition-colors">
                  <Mail className="w-8 h-8 text-red-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Email Phishing</h3>
                  <p className="text-gray-600 leading-relaxed">
                    The most common type — fraudulent emails pretending to be from banks, PayPal, Amazon, 
                    or your email provider asking you to "verify account details" or "reset your password" 
                    urgently.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Spear Phishing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="p-4 bg-orange-100 rounded-xl group-hover:bg-orange-500 transition-colors">
                  <Target className="w-8 h-8 text-orange-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Spear Phishing</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Highly targeted attacks using personal information (your name, job, colleagues) 
                    gathered from social media or data leaks to make the message extremely convincing.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Smishing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="p-4 bg-purple-100 rounded-xl group-hover:bg-purple-500 transition-colors">
                  <MessageSquare className="w-8 h-8 text-purple-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Smishing (SMS Phishing)</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Text messages claiming to be from your bank, delivery service (DHL, FedEx), 
                    or even government agencies with urgent links to "claim a package" or "pay a fine".
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Vishing */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="group p-8 bg-white rounded-2xl border border-gray-200 hover:border-emerald-500 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start gap-5">
                <div className="p-4 bg-blue-100 rounded-xl group-hover:bg-blue-500 transition-colors">
                  <Phone className="w-8 h-8 text-blue-600 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">Vishing (Voice Phishing)</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Phone calls from scammers pretending to be tech support, IRS, or bank fraud departments 
                    pressuring you to give remote access or payment details immediately.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <hr className="border-gray-200" />

        {/* Immediate Action CTA */}
        <section className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-12 text-white text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Shield className="w-20 h-20 mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-extrabold mb-6">
              Think You've Been Targeted by Phishing?
            </h2>
            <p className="text-xl mb-10 max-w-3xl mx-auto opacity-95">
              Don't wait — every minute counts. Our cyber experts are ready to help you secure your accounts, 
              remove threats, and report the attack.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/contact" className="inline-flex items-center gap-3 bg-white text-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition">
                <PhoneCall className="w-5 h-5" />
                Get Emergency Help Now
              </a>
              <a href="/report" className="inline-flex items-center gap-3 border-2 border-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition">
                <ExternalLink className="w-5 h-5" />
                Report Phishing Attack
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}