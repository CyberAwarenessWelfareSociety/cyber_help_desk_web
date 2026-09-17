import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, AlertTriangle, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

export default function ServiceCard({
  title,
  desc,
  icon: Icon,
  color,
  link,
  badge,
  severity,
  index,
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative bg-white rounded-3xl p-7 shadow-sm hover:shadow-2xl transition-all duration-300 border border-slate-200/80 hover:border-emerald-300 flex flex-col justify-between overflow-hidden"
    >
      {/* Glow highlight */}
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-5 group-hover:opacity-15 rounded-bl-full transition-opacity`}
      />

      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-5">
          <div
            className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color || "from-emerald-600 to-teal-700"} p-2.5 text-white shadow-md flex items-center justify-center transition-transform group-hover:scale-105 duration-300`}
          >
            {Icon ? (
              React.isValidElement(Icon) ? (
                Icon
              ) : (
                <Icon className="w-6 h-6" />
              )
            ) : null}
          </div>
          <span className="text-[11px] font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 text-right">
            {badge}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-700 transition-colors">
          {title}
        </h3>

        {/* Severity */}
        {severity && (
          <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-rose-600">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{severity}</span>
          </div>
        )}

        {/* Description */}
        <p className="text-slate-600 text-sm leading-relaxed mb-6">
          {desc ||
            "Professional recovery, legal reporting, and prevention guidance from certified cyber experts."}
        </p>
      </div>

      {/* Footer Link & Action */}
      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <Link
          to={link || "/contact-us"}
          className="text-emerald-600 hover:text-emerald-700 font-bold text-sm inline-flex items-center gap-1.5 group-hover:gap-2.5 transition-all"
        >
          <span>Learn & Get Support</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
        <span className="text-[11px] text-slate-400 font-medium">100% Free</span>
      </div>
    </motion.article>
  );
}