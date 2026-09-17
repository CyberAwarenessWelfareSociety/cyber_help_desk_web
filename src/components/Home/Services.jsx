// src/components/Home/Services.jsx
import React from "react";

const services = [
  { id: "olx", title: "OLX Fraud", excerpt: "OLX fraud is a growing concern. We help victims take legal & technical steps." },
  { id: "payment", title: "Payment Fraud", excerpt: "Payment fraud affects individuals and businesses. We guide recovery and prevention." },
  { id: "banking", title: "Banking Fraud", excerpt: "Banking fraud is a serious threat — we help secure your finances." },
  { id: "job", title: "Online Job Fraud", excerpt: "We help job seekers identify scams and assist in reporting and recovery." },
  { id: "stalking", title: "Cyber Stalking", excerpt: "A serious form of harassment. We provide legal guidance & victim support." },
  { id: "ransomware", title: "Ransomware", excerpt: "Ransomware locks your files or systems. We assist with containment and prevention guidance." },
];

const Services = () => (
  <section id="services" className="max-w-7xl mx-auto px-6 py-12">

    <div className="mb-8">
      <h2 className="text-3xl font-bold">What We Do</h2>
      <p className="text-gray-600 mt-2">We help victims of cybercrime and educate communities to prevent future incidents.</p>
    </div>

    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => (
        <article key={s.id} className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{s.title}</h3>
            <div className="text-emerald-600 font-bold">Read More</div>
          </div>
          <p className="text-gray-600 mt-3">{s.excerpt}</p>
          <div className="mt-4 flex items-center justify-between">
            <a href={`#${s.id}`} className="text-emerald-600 font-medium hover:underline">
              Read More →
            </a>
            <div className="text-xs text-gray-400">Trusted Support</div>
          </div>
        </article>
      ))}
    </div>
  </section>
);

export default Services;
