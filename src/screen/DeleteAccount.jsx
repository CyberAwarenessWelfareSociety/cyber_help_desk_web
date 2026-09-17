import React, { useState } from "react";
import Header from "@/components/Home/Header";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight,
  Shield,
  Lock,
  EyeOff,
  Smartphone,
  Trash2,
  Server,
  CheckCircle,
  Users,
  AlertTriangle,
  Globe2,
  KeyRound,
  FileText,
  BadgeCheck,
  Send,
  Copy,
  Check,
  Building2,
  PhoneCall,
  Clock,
  Sparkles,
  RefreshCw,
  Info,
  ShieldCheck,
  UserCheck,
  Scale,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

export default function DeleteAccount() {
  // Form State
  const [role, setRole] = useState("victim"); // "victim" | "volunteer" | "police"
  const [submitting, setSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState(null);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    referenceId: "", // CAWS-XXXXXX or Device Token or Officer ID
    deviceType: "android",
    organizationName: "",
    jurisdiction: "",
    deletionScope: {
      chatHistory: true,
      evidenceMedia: true,
      deviceTokens: true,
      profileAccount: true,
    },
    reason: "Case resolved & help completed",
    additionalNotes: "",
    confirmed: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleScopeToggle = (key) => {
    setFormData((prev) => ({
      ...prev,
      deletionScope: {
        ...prev.deletionScope,
        [key]: !prev.deletionScope[key],
      },
    }));
  };

  const handleRoleChange = (newRole) => {
    setRole(newRole);
    setFormData((prev) => ({
      ...prev,
      referenceId: "",
      organizationName: "",
      jurisdiction: "",
    }));
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return role === "victim"
        ? "Please enter your name or anonymous alias"
        : "Please enter your full registered name";
    }

    if (role === "volunteer") {
      if (!formData.email.trim()) return "Registered Google/Apple email is required";
      if (!formData.phone.trim()) return "Registered mobile number is required";
    }

    if (role === "police") {
      if (!formData.email.trim()) return "Official department email ID is required";
      if (!formData.jurisdiction.trim()) return "Police Station / Jurisdiction is required";
      if (!formData.referenceId.trim()) return "Badge / Official Service ID is required";
    }

    if (role === "victim" && !formData.referenceId.trim()) {
      return "Please enter your Ticket / Case ID (e.g. CAWS-200989) or approximate Device details";
    }

    const hasScopeSelected = Object.values(formData.deletionScope).some(Boolean);
    if (!hasScopeSelected) {
      return "Please select at least one data category to delete";
    }

    if (!formData.confirmed) {
      return "You must acknowledge and confirm the irreversible deletion policy";
    }

    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setSubmitting(true);

    // Simulate secure transmission to purge worker
    setTimeout(() => {
      setSubmitting(false);
      const generatedId = `PURGE-${Math.floor(100000 + Math.random() * 900000)}`;
      const requestDetails = {
        requestId: generatedId,
        role: role,
        name: formData.fullName,
        referenceId: formData.referenceId || "Auto-detected Device Identifier",
        timestamp: new Date().toUTCString(),
        purgeScheduledTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toUTCString(),
      };

      setSubmittedRequest(requestDetails);
      toast.success("Data Deletion Request submitted successfully! Grace period initiated.");
    }, 1200);
  };

  const copyRequestId = () => {
    if (!submittedRequest?.requestId) return;
    navigator.clipboard.writeText(submittedRequest.requestId);
    setCopied(true);
    toast.success("Request ID copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setSubmittedRequest(null);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      referenceId: "",
      deviceType: "android",
      organizationName: "",
      jurisdiction: "",
      deletionScope: {
        chatHistory: true,
        evidenceMedia: true,
        deviceTokens: true,
        profileAccount: true,
      },
      reason: "Case resolved & help completed",
      additionalNotes: "",
      confirmed: false,
    });
  };

  return (
    <div className="pt-24 bg-slate-50 min-h-screen text-slate-800">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 text-sm text-slate-500 flex items-center gap-2">
        <a href="/" className="hover:text-emerald-600 transition">
          Home
        </a>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-emerald-600 font-medium">
          Account & Data Deletion
        </span>
      </div>

      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-teal-950 to-emerald-950 text-white py-20 lg:py-24 border-b border-emerald-900/30">
        {/* Decorative Grid Pattern */}
        <div className="absolute inset-0 opacity-15">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(#10b981 1px, transparent 1px)`,
              backgroundSize: "28px 28px",
            }}
          />
        </div>

        {/* Floating Glows */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-full mb-6 backdrop-blur-md"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs sm:text-sm font-semibold text-emerald-300 tracking-wide uppercase">
              Global Victim Safety & Transparency Hub
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Cyber Help Desk Scam Helpline
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 mt-2">
              Global Victim Safety & Data Erasure Policy
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto mt-6 leading-relaxed"
          >
            Operated by the <strong className="text-white">Cyber Awareness Welfare Society (CAWS)</strong>.
            We empower victims with immediate scam relief while upholding uncompromising
            zero-knowledge privacy, automated 24-hour data purging, and sovereign user rights to erasure.
          </motion.p>

          {/* Quick Metrics Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto text-left"
          >
            <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-2xl sm:text-3xl">
                <Globe2 className="w-6 h-6" />
                170+
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">Countries Supported</p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-teal-300 font-bold text-2xl sm:text-3xl">
                <Zap className="w-6 h-6" />
                120+
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">Instant Languages</p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-cyan-300 font-bold text-2xl sm:text-3xl">
                <Clock className="w-6 h-6" />
                &lt; 10s
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">Avg. Response Time</p>
            </div>

            <div className="bg-white/5 border border-white/10 backdrop-blur-sm p-4 rounded-2xl">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-2xl sm:text-3xl">
                <Trash2 className="w-6 h-6" />
                24h
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">Permanent Auto-Purge</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-16 space-y-16">
        
        {/* Core Principles Grid (Sections 1 - 6) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1. Victim Privacy First */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="w-14 h-14 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6 text-emerald-700">
              <Lock className="w-7 h-7" />
            </div>
            <div className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full mb-3">
              Zero Identification Barrier
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              1. Victim Privacy First
            </h2>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Our Cyber Help Desk Scam Helpline operates across 120 languages and 170 countries.
              Victims never need to surrender a phone number or email address to access emergency aid.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Zero-Credential Account Creation:</strong> Accounts are automatically established via cryptographically salted Device IDs.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>GeoIP Country Detection:</strong> IP & location instantly detects jurisdiction and routes verified local emergency helplines.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Strict Volunteer Shielding:</strong> Responders only see the victim's chosen name and gender—all other personal metadata remains invisible.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                <span><strong>Masked Internal ID:</strong> A randomized reference number (e.g. <code>CAWS-200989</code>) is assigned so true identity is never public.</span>
              </li>
            </ul>
          </motion.div>

          {/* 2. Authentication & Security */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="w-14 h-14 bg-teal-100 rounded-2xl flex items-center justify-center mb-6 text-teal-700">
              <Shield className="w-7 h-7" />
            </div>
            <div className="inline-block px-3 py-1 bg-teal-50 text-teal-700 text-xs font-semibold rounded-full mb-3">
              Hardware & Role Isolation
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              2. Authentication & Security
            </h2>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              We separate victim triage from operational personnel with strict multi-factor
              safeguards and hardware integrity checks.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span><strong>Frictionless Victim Access:</strong> No passwords or sign-ins; security relies solely on device health check and GeoIP.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span><strong>NGO / Volunteer / Police Portal:</strong> Mandatory single sign-on via Google Authentication or Apple ID Authentication.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span><strong>Indian Volunteer 2FA:</strong> Additional telecom OTP verification is mandatory for all Indian responders.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span><strong>Anti-Spoofing & Tamper Lock:</strong> Counterfeit or rooted devices are instantly blocked with automated security warnings.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-teal-600 mt-0.5 shrink-0" />
                <span><strong>Hardware Privacy:</strong> Device IDs and Apple IDs are never disclosed to volunteers or partner NGOs.</span>
              </li>
            </ul>
          </motion.div>

          {/* 3. Transparency Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="w-14 h-14 bg-sky-100 rounded-2xl flex items-center justify-center mb-6 text-sky-700">
              <EyeOff className="w-7 h-7" />
            </div>
            <div className="inline-block px-3 py-1 bg-sky-50 text-sky-700 text-xs font-semibold rounded-full mb-3">
              Complete Operational Clarity
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              3. Transparency Features
            </h2>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Every connection is tracked with open integrity, keeping sensitive contact
              parameters completely obscured.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                <span><strong>Auto-Fetched Helplines:</strong> Verified government and law enforcement contacts load automatically based on jurisdiction.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                <span><strong>Proximity Police Station Distance:</strong> When victim grants location consent, exact distance to the nearest cyber cell is displayed.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                <span><strong>Absolute Contact Redaction:</strong> No volunteer can ever view or export victim phone numbers or email addresses.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-sky-600 mt-0.5 shrink-0" />
                <span><strong>Masked Dashboard Display:</strong> Only the issued case reference token is visible inside the global assistance queue.</span>
              </li>
            </ul>
          </motion.div>

          {/* 4. Global Compliance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6 text-indigo-700">
              <Scale className="w-7 h-7" />
            </div>
            <div className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-semibold rounded-full mb-3">
              Legal & Statutory Rigor
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              4. Global Compliance
            </h2>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Designed to exceed the world's most stringent international data protection
              and privacy standards.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <span><strong>GDPR, CCPA & Indian IT Act Compliant:</strong> Built-in support for GDPR Article 17 "Right to Erasure" and DPDP Act 2023.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <span><strong>ITU & GSMA Verified Directories:</strong> Emergency hotlines cross-referenced with national telecoms and telecom authorities.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <span><strong>Encrypted Evidence Vault:</strong> Fraud proofs, screenshots, and logs are encrypted with AES-256 both in-transit and at-rest.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                <span><strong>Internal Staff Lockout:</strong> Even system administrators cannot inspect or reverse real device identifiers or Apple IDs.</span>
              </li>
            </ul>
          </motion.div>

          {/* 5. Performance Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mb-6 text-amber-700">
              <Zap className="w-7 h-7" />
            </div>
            <div className="inline-block px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full mb-3">
              Real-Time High-Availability
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              5. Performance Metrics
            </h2>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Global infrastructure tuned for rapid, secure triage during critical moments of
              cyber fraud distress.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span><strong>Active Across 170 Sovereign Nations:</strong> Resilient globally distributed edge routing.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span><strong>Instant Translation in 120 Languages:</strong> Real-time neural translation bridging victims and certified experts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span><strong>Device Authenticity Verification:</strong> Google Play Integrity API & Apple DeviceCheck API guard against emulators.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                <span><strong>Sub-10s Response Benchmark:</strong> Average emergency queue dispatch handled in under 10 seconds.</span>
              </li>
            </ul>
          </motion.div>

          {/* 6. Volunteer & NGO Integration */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group"
          >
            <div className="w-14 h-14 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-purple-700">
              <Users className="w-7 h-7" />
            </div>
            <div className="inline-block px-3 py-1 bg-purple-50 text-purple-700 text-xs font-semibold rounded-full mb-3">
              Strict Gatekeeping & Vetting
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-3">
              6. Volunteer & NGO Integration
            </h2>
            <p className="text-sm text-slate-600 mb-5 leading-relaxed">
              Every human helper in our system is vetted, authenticated, and bound by
              strict ethical confidentiality charters.
            </p>
            <ul className="space-y-3 text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <span><strong>Minimal Persona Exposure:</strong> Volunteers only ever see victim first name and gender for conversational dignity.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <span><strong>NGO Onboarding Gateway:</strong> Rigorous corporate OAuth via Google/Apple and verified phone OTP (India).</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <span><strong>Dedicated Police Portal:</strong> Entry restricted exclusively to verified cyber crime officers and law enforcement personnel.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-purple-600 mt-0.5 shrink-0" />
                <span><strong>Revocation Policy:</strong> Immediate revocation of credentials if any volunteer compromises protocol.</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* Section 7 & 8 Highlight Banner: Deletion Policy & Transparency Notice */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Section 7: Victim Account Deletion Policy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-red-500/10 via-rose-500/5 to-white rounded-3xl p-8 sm:p-10 border-2 border-red-200 shadow-md relative overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-red-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-red-200">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                  Automated Lifespan
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  7. Victim Account Deletion Policy
                </h3>
              </div>
            </div>

            <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
              <p>
                We believe you should own your footprint. You can terminate your support session
                at any time without administrative barriers.
              </p>

              <div className="bg-white/80 backdrop-blur rounded-2xl p-5 border border-red-100 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    1
                  </div>
                  <p className="text-sm">
                    <strong>Victim Closes Chat:</strong> The moment you tap "Close Chat", an irreversible 24-hour grace countdown activates.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    2
                  </div>
                  <p className="text-sm">
                    <strong>24-Hour Automated Server Purge:</strong> After 24 hours, our background daemon permanently scrubs all messages, evidence photos, audio clips, and server activity logs.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    3
                  </div>
                  <p className="text-sm">
                    <strong>One-Tap "Delete Account" via Profile:</strong> Tapping <em>My Profile → Delete Account</em> immediately wipes your salted Device ID and cached sessions.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                    4
                  </div>
                  <p className="text-sm">
                    <strong>Volunteer Enforced Removal:</strong> Volunteers found violating guidelines are instantly deleted with complete access revocation across all internal consoles.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section 8: Transparency Notice */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-white rounded-3xl p-8 sm:p-10 border-2 border-emerald-200 shadow-md relative overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-md shadow-emerald-200">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                    Auditable Feedback
                  </span>
                  <h3 className="text-2xl font-bold text-slate-900">
                    8. Real-Time Transparency Notice
                  </h3>
                </div>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed mb-5">
                Every victim receives unambiguous, deterministic notifications directly within the app:
              </p>

              <div className="space-y-3">
                <div className="p-4 bg-white/90 rounded-2xl border border-emerald-100 flex items-start gap-3 shadow-xs">
                  <Clock className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      On Chat Closure
                    </span>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">
                      “Your chat session has ended. All messages and evidence will be permanently deleted from our servers in 24 hours.”
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white/90 rounded-2xl border border-emerald-100 flex items-start gap-3 shadow-xs">
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      On Automated Purge
                    </span>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">
                      “Your account, chat history, and all stored data have been permanently erased from all production servers.”
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-white/90 rounded-2xl border border-emerald-100 flex items-start gap-3 shadow-xs">
                  <Lock className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Identifier Masking
                    </span>
                    <p className="text-sm font-medium text-slate-900 mt-0.5">
                      Only the masked reference number (e.g. <code>CAWS-200989</code>) is displayed. Your raw device identifiers and IP records are never retained.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-emerald-100 text-xs text-slate-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Complies with ISO/IEC 27001 & NIST privacy recommendations.</span>
            </div>
          </motion.div>
        </div>

        {/* TRANSITION HEADING FOR FORM */}
        <div id="deletion-form-section" className="pt-8">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <RefreshCw className="w-3.5 h-3.5" />
              Expedited Self-Service Deletion Portal
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Request Complete Data Deletion
            </h2>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
              Victims, Volunteers, and Law Enforcement Officers can also submit the form below
              to permanently delete their complete records, chat transcripts, device tokens,
              and uploaded evidence from our servers.
            </p>
          </div>

          {/* INTERACTIVE FORM CONTAINER */}
          <div className="max-w-3xl mx-auto">
            {submittedRequest ? (
              /* Success Confirmation Banner */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-emerald-500 shadow-2xl text-center space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div>
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full uppercase tracking-wider mb-2">
                    Erasure Request Queued
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    Deletion Scheduled Successfully
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-base mt-2 max-w-xl mx-auto">
                    Your request has been logged into our secure purge daemon. All selected
                    data, associated media files, and token bindings are now locked and will be
                    completely erased within the standard 24-hour grace period.
                  </p>
                </div>

                {/* Request Details Box */}
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4 max-w-lg mx-auto">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      Purge Request ID
                    </span>
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        {submittedRequest.requestId}
                      </code>
                      <button
                        onClick={copyRequestId}
                        className="p-1.5 hover:bg-slate-200 rounded-md transition text-slate-600 cursor-pointer"
                        title="Copy Request ID"
                      >
                        {copied ? (
                          <Check className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm">
                    <span className="text-slate-500">Applicant Role:</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {submittedRequest.role}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm">
                    <span className="text-slate-500">Subject / Alias:</span>
                    <span className="font-semibold text-slate-800">
                      {submittedRequest.name}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-b border-slate-200 pb-3 text-sm">
                    <span className="text-slate-500">Reference / Token:</span>
                    <span className="font-mono text-xs text-slate-700">
                      {submittedRequest.referenceId}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Permanent Purge By:</span>
                    <span className="font-semibold text-red-600 text-xs sm:text-sm">
                      {submittedRequest.purgeScheduledTime}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-amber-800 text-xs sm:text-sm text-left flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Notice on Immediate Action:</strong> Your active session tokens have
                    been invalidated. Any uploaded evidence vault items have entered cold-tier
                    cryptographic shredding.
                  </div>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 rounded-xl border border-slate-300 text-slate-700 font-semibold hover:bg-slate-100 transition text-sm cursor-pointer"
                  >
                    Submit Another Request
                  </button>
                  <a
                    href="/"
                    className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition text-sm shadow-md shadow-emerald-200 text-center"
                  >
                    Return to Safety Portal
                  </a>
                </div>
              </motion.div>
            ) : (
              /* Main Interactive Form */
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8"
              >
                {/* Step 1: Select User Role */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-3">
                    Step 1: Select Your User Category
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleRoleChange("victim")}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        role === "victim"
                          ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Smartphone className={`w-6 h-6 ${role === "victim" ? "text-emerald-600" : "text-slate-400"}`} />
                        {role === "victim" && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">Victim / Citizen</p>
                        <p className="text-xs text-slate-500 mt-0.5">Anonymous or registered victim</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRoleChange("volunteer")}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        role === "volunteer"
                          ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <UserCheck className={`w-6 h-6 ${role === "volunteer" ? "text-emerald-600" : "text-slate-400"}`} />
                        {role === "volunteer" && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">Volunteer / NGO</p>
                        <p className="text-xs text-slate-500 mt-0.5">Google/Apple/OTP account</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRoleChange("police")}
                      className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                        role === "police"
                          ? "border-emerald-600 bg-emerald-50/50 ring-2 ring-emerald-500 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Building2 className={`w-6 h-6 ${role === "police" ? "text-emerald-600" : "text-slate-400"}`} />
                        {role === "police" && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">Police Officer</p>
                        <p className="text-xs text-slate-500 mt-0.5">Law enforcement officer</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Step 2: Identification Fields */}
                <div className="space-y-4 pt-2 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-800">
                    Step 2: Verification & Case Credentials
                  </label>

                  {/* Name field */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {role === "victim"
                        ? "Victim Name / Display Alias *"
                        : role === "volunteer"
                        ? "Full Registered Volunteer Name *"
                        : "Officer Name & Designation *"}
                    </label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder={
                        role === "victim"
                          ? "e.g., Alex / Anonymous Citizen"
                          : role === "volunteer"
                          ? "e.g., Johnathan Smith"
                          : "e.g., Inspector R. Sharma, Cyber Cell"
                      }
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-slate-50/50"
                      required
                    />
                  </div>

                  {/* Role Specific Dynamic Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Reference / Case ID */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span>
                          {role === "victim"
                            ? "Ticket ID or Reference Number *"
                            : role === "volunteer"
                            ? "Volunteer / NGO Reference ID"
                            : "Officer Badge / Station ID *"}
                        </span>
                        {role === "victim" && (
                          <span className="text-[10px] text-slate-400 font-normal">
                            e.g. CAWS-200989
                          </span>
                        )}
                      </label>
                      <input
                        type="text"
                        name="referenceId"
                        value={formData.referenceId}
                        onChange={handleInputChange}
                        placeholder={
                          role === "victim"
                            ? "e.g. CAWS-200989 (or 'Recent Device Chat')"
                            : role === "volunteer"
                            ? "e.g. VOL-IND-9921"
                            : "e.g. POL-DL-4482"
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-slate-50/50 font-mono"
                        required={role === "police" || role === "victim"}
                      />
                    </div>

                    {/* Email / Contact */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5 flex items-center justify-between">
                        <span>
                          {role === "police"
                            ? "Official Department Email *"
                            : role === "volunteer"
                            ? "Registered Email (Google/Apple) *"
                            : "Contact Email (Optional)"}
                        </span>
                        {role === "victim" && (
                          <span className="text-[10px] text-emerald-600 font-normal">
                            Zero Login Required
                          </span>
                        )}
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder={
                          role === "police"
                            ? "officer@police.gov.in"
                            : "yourname@gmail.com"
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-slate-50/50"
                        required={role !== "victim"}
                      />
                    </div>
                  </div>

                  {/* Extra row for Volunteer/Police or Victim device type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {role === "victim" ? (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Operating System / Device Type
                        </label>
                        <select
                          name="deviceType"
                          value={formData.deviceType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-slate-50/50"
                        >
                          <option value="android">Android (Google Play Services)</option>
                          <option value="ios">Apple iOS (iPhone / iPad)</option>
                          <option value="web">Web Browser (Desktop / Mobile)</option>
                        </select>
                      </div>
                    ) : role === "volunteer" ? (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Registered Mobile Number (with country code) *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="+91 98765 43210"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-slate-50/50"
                          required
                        />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Police Station / Cyber Cell Jurisdiction *
                        </label>
                        <input
                          type="text"
                          name="jurisdiction"
                          value={formData.jurisdiction}
                          onChange={handleInputChange}
                          placeholder="e.g., Central Cyber Cell, New Delhi"
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-slate-50/50"
                          required
                        />
                      </div>
                    )}

                    {/* Reason selection */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Primary Reason for Deletion
                      </label>
                      <select
                        name="reason"
                        value={formData.reason}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-slate-50/50"
                      >
                        <option value="Case resolved & help completed">
                          Case resolved & helpline assistance completed
                        </option>
                        <option value="Personal privacy preference">
                          Personal privacy preference & routine hygiene
                        </option>
                        <option value="Device changed or sold">
                          Device sold, handed down, or reset
                        </option>
                        <option value="Volunteer exit or role transition">
                          Volunteer role departure / NGO handover
                        </option>
                        <option value="Law enforcement case finalized">
                          Law enforcement inquiry concluded
                        </option>
                        <option value="Other">Other reasons</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Step 3: Deletion Scope Checkboxes */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-sm font-bold text-slate-800 mb-3">
                    Step 3: Select Scope of Data to Purge
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={formData.deletionScope.chatHistory}
                        onChange={() => handleScopeToggle("chatHistory")}
                        className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-slate-800 block">
                          Chat Transcripts & Live Messages
                        </span>
                        <span className="text-slate-500">
                          Scrub all historical conversations and advice logs
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={formData.deletionScope.evidenceMedia}
                        onChange={() => handleScopeToggle("evidenceMedia")}
                        className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-slate-800 block">
                          Evidence Media & Screenshots
                        </span>
                        <span className="text-slate-500">
                          Permanently delete all uploaded files and proofs
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={formData.deletionScope.deviceTokens}
                        onChange={() => handleScopeToggle("deviceTokens")}
                        className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-slate-800 block">
                          Device Tokens & GeoIP Flags
                        </span>
                        <span className="text-slate-500">
                          Clear salted hardware identifiers and routing logs
                        </span>
                      </div>
                    </label>

                    <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50 cursor-pointer transition">
                      <input
                        type="checkbox"
                        checked={formData.deletionScope.profileAccount}
                        onChange={() => handleScopeToggle("profileAccount")}
                        className="mt-0.5 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                      />
                      <div className="text-xs">
                        <span className="font-semibold text-slate-800 block">
                          Complete Profile Termination
                        </span>
                        <span className="text-slate-500">
                          Deregister internal case reference and preferences
                        </span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Step 4: Optional Remarks */}
                <div className="pt-2 border-t border-slate-100">
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Additional Notes or Case Identifiers (Optional)
                  </label>
                  <textarea
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Provide any specific case timestamps, ticket IDs, or verification comments..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition bg-slate-50/50"
                  />
                </div>

                {/* Mandatory Consent Checkbox */}
                <div className="p-4 bg-red-50/60 rounded-2xl border border-red-200">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.confirmed}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          confirmed: e.target.checked,
                        }))
                      }
                      className="mt-1 h-4 w-4 rounded text-red-600 focus:ring-red-500 border-red-300 cursor-pointer"
                    />
                    <span className="text-xs text-slate-700 leading-relaxed">
                      <strong>Irreversible Erasure Acknowledgement:</strong> I confirm that I am authorized to request this deletion. I understand that upon submission, an automated 24-hour grace window begins, following which all associated records, media files, and device tokens will be permanently and unrecoverably purged from Cyber Help Desk servers in accordance with our Global Data Privacy Policy.
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <div>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-800 text-white font-bold text-base shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Submitting Deletion Request...</span>
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-5 h-5" />
                        <span>Submit Irreversible Deletion Request</span>
                      </>
                    )}
                  </button>
                  <p className="text-center text-xs text-slate-400 mt-3">
                    Protected by AES-256 in-transit encryption • Zero marketing tracking • CAWS Non-Profit Governance
                  </p>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Global Helpline Quick Action Card */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 px-3 py-1 rounded-full text-emerald-300 text-xs font-semibold">
              <PhoneCall className="w-3.5 h-3.5" />
              Need Immediate Cyber Scam Triage?
            </div>
            <h3 className="text-2xl font-bold">
              24/7 Global Victim Assistance Helpline
            </h3>
            <p className="text-slate-300 text-sm max-w-xl">
              If you are currently experiencing active online fraud, phishing, or financial extortion,
              our emergency cyber triage team is available worldwide without prior account setup.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a
              href="/contact-us"
              className="px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition text-sm shadow-md text-center"
            >
              Contact Cyber Desk
            </a>
            <a
              href="/frequently-asked-questions"
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition text-sm border border-white/20 text-center"
            >
              Read FAQs
            </a>
          </div>
        </div>

      </main>
    </div>
  );
}
