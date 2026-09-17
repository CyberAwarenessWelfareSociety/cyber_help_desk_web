import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  CheckCircle,
  FileText,
  Gavel,
  IndianRupee,
  Lock,
  Target,
  Users,
} from "lucide-react";

const termsSections = [
  {
    icon: Target,
    title: "1. Purpose of the App",
    points: [
      "Promote cyber awareness among Indian citizens",
      "Help identify and avoid digital fraud",
      "Facilitate complaint filing & public service camps",
      "Assist law enforcement with citizen-submitted data",
    ],
    note: "For informational and public service purposes only.",
  },
  {
    icon: Users,
    title: "2. User Types",
    points: [
      "Common Citizens → Mobile verification (name/email optional)",
      "Police Personnel → Station details + phone verification",
    ],
    note: "All data stored securely and used only for service delivery.",
  },
  {
    icon: Lock,
    title: "3. Data Privacy & Storage",
    points: [
      "Only essential data stored",
      "Search history not retained",
      "Account deletion available anytime",
      "No sensitive data collected without consent",
    ],
  },
  {
    icon: AlertCircle,
    title: "4. Data Source Disclaimer",
    points: [
      "Data from public domains & authorized aggregators",
      "For awareness only — not legal evidence",
      "Accuracy not guaranteed",
      "Independent verification recommended",
    ],
  },
  {
    icon: Gavel,
    title: "5. Limitation of Liability",
    points: [
      "No liability for losses from data reliance",
      "Service interruptions beyond control",
      "User assumes full responsibility",
    ],
  },
  {
    icon: IndianRupee,
    title: "6. Refund, Cancellation & Tax Policy",
    points: [
      "Donations → Non-refundable | 12A exempt | 80G pending",
      "Paid Services → 18% GST applies | Invoice issued",
      "Event Cancellation: 50% (>30 days), 25% (15–30 days), 0% (<15 days)",
      "Membership fees → Non-refundable",
    ],
  },
];

export default function TermsDialog({ open, onOpenChange, onAgree }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-hidden p-0 bg-white rounded-2xl gap-0 [&_[data-slot=dialog-close]]:text-white [&_[data-slot=dialog-close]]:opacity-90 hover:[&_[data-slot=dialog-close]]:opacity-100">
        <DialogHeader className="px-6 py-5 pr-12 border-b bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            <DialogTitle className="text-white text-xl">
              Terms & Conditions
            </DialogTitle>
          </div>
          <DialogDescription className="text-white/80 text-sm">
            By using our services, you agree to these terms. We are committed
            to transparency, user privacy, and serving India’s digital safety
            with integrity.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[52vh] px-6 py-5 space-y-5">
          <p className="text-sm text-gray-700 leading-relaxed">
            Developed and operated by{" "}
            <span className="font-semibold text-emerald-700">
              Cyber Awareness Welfare Society (CAWS)
            </span>
            , a registered non-profit dedicated to cyber awareness and victim
            support across India.
          </p>

          {termsSections.map((section) => (
            <div
              key={section.title}
              className="rounded-xl border border-gray-100 bg-gray-50 p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <section.icon className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="font-bold text-gray-900">{section.title}</h3>
              </div>
              <ul className="space-y-2">
                {section.points.map((point) => (
                  <li key={point} className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-gray-700 leading-relaxed">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
              {section.note && (
                <p className="mt-3 text-xs italic text-gray-600">
                  {section.note}
                </p>
              )}
            </div>
          ))}
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-white sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition"
          >
            Close
          </button>
          {onAgree && (
            <button
              type="button"
              onClick={onAgree}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition"
            >
              I Agree
            </button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
