import { motion } from "framer-motion";
import { Quote, Star, ShieldCheck, Heart, MessageSquare } from "lucide-react";

const testimonials = [
  {
    quote:
      "I lost ₹75,000 to an OLX fake buyer scam within seconds. I was terrified until I called the CAWS hotline. Their team guided me within 20 minutes on how to report to 1930 and helped freeze the beneficiary mule account. I recovered over 80% of my hard-earned savings.",
    author: "Ramesh K.",
    location: "Pune, Maharashtra",
    category: "Marketplace Fraud Recovery",
    stars: 5,
  },
  {
    quote:
      "When someone started blackmailing me with morphed photos on Instagram, I was in tears and afraid of society. The CAWS counselors handled my case with 100% confidential empathy, helped preserve technical evidence, and guided me to the cyber cell without judgment.",
    author: "College Student (Identity Protected)",
    location: "New Delhi",
    category: "Cyber Blackmail & Harassment",
    stars: 5,
  },
  {
    quote:
      "As a senior citizen, I was tricked into downloading a screen-sharing app by a fake bank caller. CAWS volunteers calmly walked me through locking my netbanking, blocking my SIM, and saving my retirement pension funds from being wiped out.",
    author: "S. P. Verma (Retired Govt. Official)",
    location: "Lucknow, Uttar Pradesh",
    category: "Banking & Screen-Share Scam",
    stars: 5,
  },
  {
    quote:
      "CAWS organized an eye-opening cybersecurity workshop for over 800 students at our university campus. Their live demonstrations on deepfakes, phishing links, and ethical hacking were extraordinary. India needs more NGOs like this.",
    author: "Dr. Sunita Murthy",
    location: "Academic Director, Bengaluru",
    category: "Cyber Awareness Workshop",
    stars: 5,
  },
];

export default function SurvivorVoicesSection() {
  return (
    <section className="py-24 bg-slate-900 text-white relative overflow-hidden border-t border-slate-800">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
            <span>Survivor Voices & Community Trust</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Real Stories of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
              Recovery, Hope & Safety
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Every day, our dedicated NGO volunteers and certified advisors turn panic
            into relief. Here is what citizens say about our welfare assistance.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {testimonials.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-3xl p-8 flex flex-col justify-between hover:border-emerald-500/40 hover:bg-slate-800 transition-all duration-300 group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(item.stars)].map((_, s) => (
                      <Star key={s} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                    {item.category}
                  </span>
                </div>

                <Quote className="w-8 h-8 text-slate-600 mb-2 opacity-50 group-hover:text-emerald-400 transition-colors" />

                <p className="text-slate-200 text-sm sm:text-base leading-relaxed italic mb-6">
                  "{item.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-700/60 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">
                    {item.author}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {item.location}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Case</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
