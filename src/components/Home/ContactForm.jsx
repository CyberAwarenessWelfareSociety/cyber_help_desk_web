import { useState } from "react";
import { toast } from "sonner";
import { services } from "../../constants/data";
import {
  Send,
  Shield,
  Lock,
  AlertCircle,
  Clock,
  CheckCircle2,
  Phone,
} from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    requirement: "",
    message: "",
    isUrgent: false,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Full name is required";

    if (!form.email.trim()) newErrors.email = "Email address is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      newErrors.email = "Please enter a valid email address";

    if (!form.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(form.phone.replace(/[^0-9]/g, "")))
      newErrors.phone = "Enter a valid 10-digit mobile number";

    if (!form.requirement) newErrors.requirement = "Please select the type of cyber incident";

    if (!form.message.trim())
      newErrors.message = "Please provide brief details of what happened";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("https://api.cyberawareness.ngo/api/create-Enquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          subject:
            services.find((x) => x.id === form.requirement)?.title ||
            form.requirement ||
            "Cyber Incident Report",
          message: `${form.isUrgent ? "[URGENT INCIDENT < 2 HRS] " : ""}${form.message} (Phone: ${form.phone})`,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Unable to submit enquiry");
      }

      toast.success("Incident Report Submitted Confidentially", {
        description:
          "Our NGO Cyber Desk has received your request. A counselor will review it immediately. If urgent, please also dial 1930.",
      });

      setForm({
        name: "",
        email: "",
        phone: "",
        requirement: "",
        message: "",
        isUrgent: false,
      });
      setErrors({});
    } catch (error) {
      toast.error("Submission failed", {
        description: error.message || "Please call our helpline directly at +91 93105 97258",
      });
    }

    setSubmitting(false);
  };

  return (
    <div className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-xl font-bold text-slate-900">
            Confidential Incident Intake Form
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Free NGO triage & victim assistance
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full text-xs font-semibold border border-emerald-200">
          <Lock className="w-3.5 h-3.5" />
          <span>Strict Privacy</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Urgent Checkbox */}
        <label className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200 cursor-pointer transition hover:bg-red-100/60">
          <input
            type="checkbox"
            checked={form.isUrgent}
            onChange={(e) => setForm({ ...form, isUrgent: e.target.checked })}
            className="mt-1 h-4 w-4 rounded border-red-300 text-red-600 focus:ring-red-500"
          />
          <div className="text-xs">
            <span className="font-bold text-red-800">
              🚨 Emergency: This incident occurred within the last 2 hours
            </span>
            <p className="text-red-700 mt-0.5">
              Check this box for priority triage. Please also dial 1930 immediately to freeze bank accounts.
            </p>
          </div>
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Your Full Name *
            </label>
            <input
              placeholder="e.g. Anjali Sharma"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border text-sm ${
                errors.name ? "border-red-500 bg-red-50/20" : "border-slate-200 bg-slate-50"
              } focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border text-sm ${
                errors.email ? "border-red-500 bg-red-50/20" : "border-slate-200 bg-slate-50"
              } focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Contact Mobile Number (10 digits) *
            </label>
            <input
              type="tel"
              placeholder="e.g. 9876543210"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={`w-full px-4 py-3 rounded-xl border text-sm ${
                errors.phone ? "border-red-500 bg-red-50/20" : "border-slate-200 bg-slate-50"
              } focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Incident Type Select */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Type of Cyber Incident *
          </label>
          <select
            value={form.requirement}
            onChange={(e) => setForm({ ...form, requirement: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm ${
              errors.requirement ? "border-red-500 bg-red-50/20" : "border-slate-200 bg-slate-50"
            } focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500`}
          >
            <option value="">Select the incident category...</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({s.severity})
              </option>
            ))}
            <option value="other">Other Cyber Fraud / Incident</option>
          </select>
          {errors.requirement && (
            <p className="text-red-500 text-xs mt-1">{errors.requirement}</p>
          )}
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Brief Incident Summary & Details *
          </label>
          <textarea
            rows={4}
            placeholder="Please mention: approximate loss amount, date/time, platform (WhatsApp, OLX, Bank), and whether you have screenshots or transaction IDs..."
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            className={`w-full px-4 py-3 rounded-xl border text-sm ${
              errors.message ? "border-red-500 bg-red-50/20" : "border-slate-200 bg-slate-50"
            } focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none`}
          />
          {errors.message && (
            <p className="text-red-500 text-xs mt-1">{errors.message}</p>
          )}
        </div>

        {/* Privacy Note */}
        <div className="flex items-start gap-2 text-xs text-slate-500">
          <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          <span>
            We respect your privacy. All information submitted is protected by strict NGO confidentiality
            and used solely to assist your case. We never share your data.
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white py-4 rounded-xl font-bold text-base shadow-lg hover:shadow-xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (
            <span>Transmitting Securely...</span>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Submit Confidential Report to NGO Desk</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
