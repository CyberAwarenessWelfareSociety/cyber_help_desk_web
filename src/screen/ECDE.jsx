import Header from "@/components/Home/Header";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  ChevronRight, Shield, GitBranch, Lock, Zap, 
  Server, Code2, Workflow, Activity, CheckCircle 
} from "lucide-react";

export default function ECDE() {
  return (
    <div className="pt-32 bg-gray-50 min-h-screen">
      <Header />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4 text-sm text-gray-600 flex items-center gap-2">
        <Link to="/" className="hover:text-emerald-600 transition">Home</Link>
        <ChevronRight className="w-4 h-4 text-slate-400" />
        <span className="text-emerald-700 font-bold">Certified DevSecOps Engineer (E|CDE)</span>
      </div>

      {/* Premium Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6"
              >
                <GitBranch className="w-5 h-5" />
                <span className="text-sm font-medium">EC-Council DevSecOps Certification</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight"
              >
                Certified DevSecOps
                <span className="block text-yellow-300 text-4xl md:text-5xl mt-2">
                  Engineer (E|CDE)
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed"
              >
                Shift security left. Automate compliance. Deliver secure code 
                at DevOps speed — without compromise.
              </motion.p>
            </div>

            {/* Right - Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { icon: Zap, value: "100%", label: "Automation Focus", color: "bg-yellow-500" },
                { icon: Workflow, value: "CI/CD", label: "Secure Pipelines", color: "bg-purple-500" },
                { icon: Shield, value: "Shift Left", label: "Security Built-in", color: "bg-emerald-500" },
                { icon: CheckCircle, value: "Real Labs", label: "Hands-on DevSecOps", color: "bg-cyan-500" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition"
                >
                  <div className={`${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-white/80">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#F9FAFB"/>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 space-y-20">

        {/* Program Overview */}
        <section>
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4"
            >
              <Workflow className="w-4 h-4" />
              <span className="text-sm font-semibold">Security at DevOps Velocity</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            >
              Secure Faster.<br />
              <span className="text-emerald-600">Deliver Safer.</span>
            </motion.h2>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100"
          >
            <p className="text-gray-700 text-lg leading-relaxed text-center max-w-4xl mx-auto">
              The <strong>Certified DevSecOps Engineer (E|CDE)</strong> bridges the gap between 
              development, security, and operations. Master automated security testing, 
              secure CI/CD pipelines, Infrastructure as Code, container security, and 
              real-time compliance — all in hands-on labs that simulate modern DevOps environments.
            </p>
          </motion.div>
        </section>

        {/* Key Skills & Modules */}
        <section>
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 bg-teal-100 text-teal-700 px-4 py-2 rounded-full mb-4"
            >
              <Code2 className="w-4 h-4" />
              <span className="text-sm font-semibold">Automation-First Security</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            >
              DevSecOps Domains You’ll Master
            </motion.h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: GitBranch, title: "Secure CI/CD Pipelines", color: "emerald" },
              { icon: Code2, title: "Infrastructure as Code (IaC) Security", color: "blue" },
              { icon: Server, title: "Container & Kubernetes Security", color: "purple" },
              { icon: Lock, title: "Secrets Management & Encryption", color: "red" },
              { icon: Activity, title: "Automated Vulnerability Scanning", color: "orange" },
              { icon: Shield, title: "SAST, DAST & SCA Integration", color: "teal" },
              { icon: Zap, title: "Security as Code Practices", color: "yellow" },
              { icon: Workflow, title: "Policy as Code & Compliance", color: "indigo" },
              { icon: CheckCircle, title: "Real-time Monitoring & Response", color: "green" },
            ].map((module, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl border-2 border-gray-100 shadow-lg hover:shadow-2xl transition group hover:-translate-y-2 hover:border-emerald-200"
              >
                <div className={`w-14 h-14 bg-${module.color}-100 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition`}>
                  <module.icon className={`w-7 h-7 text-${module.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}