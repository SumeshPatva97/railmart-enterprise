import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  ShieldCheck,
  Eye,
  Database,
  Lock,
  Share2,
  Cookie,
  UserCheck,
  Calendar,
  ArrowLeft,
  HelpCircle,
  ExternalLink,
  MessageSquare,
  FileText,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Privacy Policy | D ENTERPRISE TEAM',
  description: 'Privacy Policy detailing data protection, collection practices, cookie policy, and user rights on D ENTERPRISE TEAM website.',
};

const privacySections = [
  { id: 'overview', title: '1. Overview & Privacy Commitment', icon: Eye },
  { id: 'collection', title: '2. Information We Collect', icon: Database },
  { id: 'usage', title: '3. How We Use Your Information', icon: UserCheck },
  { id: 'security', title: '4. Data Security & Encryption', icon: Lock },
  { id: 'third-party', title: '5. Third-Party Disclosures & Payments', icon: Share2 },
  { id: 'cookies', title: '6. Cookies & Local Storage', icon: Cookie },
  { id: 'rights', title: '7. Your Data Rights & Choices', icon: ShieldCheck },
  { id: 'retention', title: '8. Data Retention', icon: FileText },
  { id: 'updates', title: '9. Changes to Privacy Policy', icon: Calendar },
  { id: 'contact', title: '10. Privacy Contact & Support', icon: HelpCircle },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">

        {/* Top Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full">
            <Calendar className="w-3.5 h-3.5" /> Effective: August 17, 2026
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" /> Data Protection Guarantee
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Privacy <span className="text-emerald-400">Policy</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl">
              At <strong className="text-white">D ENTERPRISE TEAM</strong> (Domain: <em>denterpriese.softvps.in</em>), we respect your privacy and are committed to safeguarding your personal data. This Privacy Policy explains how we collect, process, protect, and handle your information when using our store and services.
            </p>
          </div>
        </div>

        {/* Quick Table of Contents */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" /> Table of Contents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {privacySections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="flex items-center gap-2.5 p-2 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700/50"
              >
                <sec.icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{sec.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Privacy Content */}
        <div className="space-y-8 text-sm leading-relaxed">

          {/* Section 1 */}
          <section id="overview" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Eye className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">1. Overview & Privacy Commitment</h2>
            </div>
            <p>
              Your trust is paramount. D ENTERPRISE TEAM adheres to stringent data protection standards. We collect only the essential personal details required to process software licenses, process transactions, deliver Tatkal tool keys, and provide customer support.
            </p>
            <p>
              We <strong className="text-emerald-400">never sell, rent, or trade</strong> your personal information or contact details to third-party marketing brokers.
            </p>
          </section>

          {/* Section 2 */}
          <section id="collection" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Database className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">2. Information We Collect</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-emerald-400 uppercase">A. Information Provided By You</h3>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5">
                  <li>Full Name and Email Address</li>
                  <li>WhatsApp / Phone Number</li>
                  <li>Account Passwords (Encrypted & Hashed)</li>
                  <li>Support communication & inquiry notes</li>
                </ul>
              </div>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
                <h3 className="text-xs font-bold text-emerald-400 uppercase">B. Technical & Transactional Data</h3>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1.5">
                  <li>Order ID, payment metadata & invoice records</li>
                  <li>Software License Activation logs & Key status</li>
                  <li>IP address, browser type & session identifiers</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section id="usage" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">3. How We Use Your Information</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li><strong className="text-white">Order Fulfillment:</strong> To deliver purchased software license keys (GADAR, STAR_TS, PRO MAX, HITMAN, SUPERMAN, BTS, PANDA, etc.) and VPS configurations.</li>
              <li><strong className="text-white">Account Security:</strong> Verifying logins, sending OTP authentication codes, and resetting passwords securely.</li>
              <li><strong className="text-white">Customer Support:</strong> Providing 7:30 AM to 12:00 AM dedicated support via WhatsApp and live chat.</li>
              <li><strong className="text-white">System Optimization:</strong> Monitoring system uptime, speed performance, and preventing fraudulent transactions.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section id="security" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">4. Data Security & Encryption Controls</h2>
            </div>
            <p>
              We implement industry-standard technical measures to secure your data:
            </p>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2 text-xs text-slate-300">
              <p>• All traffic is encrypted in transit using 256-bit SSL (HTTPS).</p>
              <p>• Sensitive user passwords are cryptographically hashed using salt algorithms (bcrypt).</p>
              <p>• Databases are hosted in secure enterprise environments with strict access controls.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section id="third-party" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Share2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">5. Third-Party Services & Payment Gateways</h2>
            </div>
            <p>
              We partner with trusted third-party providers for payment gateway processing (e.g. Razorpay, UPI channels) and communication channels.
            </p>
            <p className="text-xs text-slate-400">
              Payment details (such as credit card numbers or UPI PINs) are processed directly by PCI-DSS compliant payment gateways and are never stored on our servers.
            </p>
          </section>

          {/* Section 6 */}
          <section id="cookies" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Cookie className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">6. Cookies & Local Storage</h2>
            </div>
            <p>
              We use essential cookies and browser local storage to maintain session states, save items in your shopping cart, and keep you authenticated securely.
            </p>
            <p className="text-xs text-slate-400">
              You can control or disable cookies via your browser settings, though certain interactive portal features may require cookies to function properly.
            </p>
          </section>

          {/* Section 7 */}
          <section id="rights" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">7. Your Data Rights & Choices</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li><strong className="text-white">Access & Correction:</strong> You may review and update your profile details inside your Account dashboard.</li>
              <li><strong className="text-white">Data Removal:</strong> You may request deletion of your account or non-financial records by contacting customer support.</li>
              <li><strong className="text-white">Opt-out:</strong> You may request to stop receiving promotional announcements via WhatsApp or email.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="retention" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">8. Data Retention Policy</h2>
            </div>
            <p>
              We retain transactional data, order history, and license key assignments for as long as necessary to comply with accounting standards, fulfill warranty support, and resolve dispute inquiries.
            </p>
          </section>

          {/* Section 9 */}
          <section id="updates" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Calendar className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">9. Changes to Privacy Policy</h2>
            </div>
            <p>
              We may update this Privacy Policy from time to time to reflect technological changes or statutory legal updates. Any modifications will be posted here with the updated effective date.
            </p>
          </section>

          {/* Section 10 */}
          <section id="contact" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">10. Privacy Contact & Support</h2>
            </div>
            <p>
              If you have any questions or concerns regarding our privacy practices or wish to exercise your data rights:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-emerald-400 font-bold uppercase">Customer Support Desk</span>
                <p className="text-sm font-semibold text-white">WhatsApp / Call: +91 8521012621</p>
                <p className="text-xs text-slate-400">Support Hours: 7:30 AM to 12:00 AM</p>
              </div>
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-emerald-400 font-bold uppercase">Official Web Portal</span>
                <p className="text-sm font-semibold text-white">denterpriese.softvps.in</p>
                <p className="text-xs text-slate-400">D ENTERPRISE TEAM Privacy Desk</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Banner Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-emerald-500/10 via-slate-900 to-amber-500/10 border border-slate-800 rounded-2xl p-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-white">Read our Terms & Conditions</h3>
            <p className="text-xs text-slate-400">Check our full customer agreement and software licensing rules.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/terms"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Terms & Conditions <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <a
              href="https://wa.me/918521012621"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
            >
              <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Privacy Desk
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
