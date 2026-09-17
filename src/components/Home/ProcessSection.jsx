import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Phone, FileCheck2, Scale, HeartHandshake, CheckCircle } from "lucide-react";
import { processSteps } from "../../constants/data";

export default function ProcessSection() {
  return (
    <section id="process" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
        >
          <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-200 text-emerald-800 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Victim-Centric Resolution</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
            How Our NGO{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600">
              Supports Your Recovery
            </span>
          </h2>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Navigating cyber fraud or digital harassment can feel overwhelming.
            We provide a structured, compassionate, and transparent process from panic to resolution.
          </p>
        </motion.div>

        {/* 4 Process Cards with Connectors */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {processSteps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative bg-slate-50 rounded-3xl p-7 border border-slate-200/80 hover:border-emerald-400 hover:shadow-xl hover:bg-white transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                      {Icon ? (
                        React.isValidElement(Icon) ? (
                          Icon
                        ) : (
                          <Icon className="w-7 h-7" />
                        )
                      ) : null}
                    </div>
                    <span className="text-3xl font-black text-slate-200 group-hover:text-emerald-500 transition-colors">
                      0{i + 1}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-emerald-700 transition-colors">
                    {step.title}
                  </h4>

                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-200/60 mt-6 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    Phase 0{i + 1}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    Action Plan →
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}