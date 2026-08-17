import React from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  FileText,
  ShieldCheck,
  Lock,
  Scale,
  CreditCard,
  Headphones,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Calendar,
  ArrowLeft,
  HelpCircle,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Terms & Conditions | D ENTERPRISE TEAM',
  description: 'Terms and Conditions governing the use of D ENTERPRISE TEAM portal, Tatkal software tools, extensions, software licensing, and customer support.',
};

const sections = [
  { id: 'introduction', title: '1. Introduction & Agreement', icon: FileText },
  { id: 'accounts', title: '2. User Accounts & Security', icon: UserCheck },
  { id: 'services', title: '3. Products & Licensing Scope', icon: Lock },
  { id: 'payments', title: '4. Payments & Billing', icon: CreditCard },
  { id: 'usage', title: '5. Fair Usage & License Activation', icon: CheckCircle2 },
  { id: 'support', title: '6. Dedicated Support (7:30 AM - 12:00 AM)', icon: Headphones },
  { id: 'disclaimer', title: '7. Disclaimer & Limitation of Liability', icon: Scale },
  { id: 'intellectual-property', title: '8. Intellectual Property Rights', icon: ShieldCheck },
  { id: 'modifications', title: '9. Amendments & Policy Updates', icon: AlertCircle },
  { id: 'contact', title: '10. Governing Law & Contact', icon: HelpCircle },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-amber-400 transition-colors bg-slate-900/80 border border-slate-800 px-3 py-1.5 rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-full">
            <Calendar className="w-3.5 h-3.5" /> Last Updated: August 17, 2026
          </div>
        </div>

        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-10 shadow-2xl">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <ShieldCheck className="w-4 h-4" /> Official Customer Agreement
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Terms & <span className="text-amber-400">Conditions</span>
            </h1>
            <p className="text-slate-400 text-sm sm:text-base leading-relaxed max-w-3xl">
              Welcome to <strong className="text-white">D ENTERPRISE TEAM</strong>. These Terms & Conditions outline the rules, obligations, and legal guidelines governing your access to and use of our digital portal, Tatkal software solutions, VPS configurations, Tatkal booking ticket utility tools, and customer support services.
            </p>
          </div>
        </div>

        {/* Table of Contents / Quick Jump */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" /> Table of Contents
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {sections.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="flex items-center gap-2.5 p-2 rounded-lg text-slate-300 hover:text-amber-400 hover:bg-slate-800/60 transition-all border border-transparent hover:border-slate-700/50"
              >
                <sec.icon className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate">{sec.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm leading-relaxed">

          {/* Section 1 */}
          <section id="introduction" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">1. Introduction & Agreement</h2>
            </div>
            <p>
              By accessing, browsing, registering, or purchasing products on <strong className="text-white">D ENTERPRISE TEAM</strong> (Domain: <em>denterpriese.softvps.in</em>), you acknowledge that you have read, understood, and agreed to be bound by these Terms & Conditions.
            </p>
            <p>
              If you do not agree with any part of these terms, you must refrain from registering an account or placing orders on this portal. These terms apply to all visitors, registered users, agents, and buyers.
            </p>
          </section>

          {/* Section 2 */}
          <section id="accounts" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">2. User Accounts & Account Security</h2>
            </div>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>Users must provide accurate, current, and complete registration information (name, phone number, valid email).</li>
              <li>You are strictly responsible for maintaining the confidentiality of your account credentials, passwords, and verification OTPs.</li>
              <li>Sharing accounts, credentials, or activation keys with unauthorized third parties is strictly forbidden and may result in immediate account suspension without refund.</li>
              <li>You must immediately notify our support team if you suspect any unauthorized access to your user account.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section id="services" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">3. Products & Licensing Scope</h2>
            </div>
            <p>
              D ENTERPRISE TEAM specializes in providing specialized software utilities, high-speed Tatkal booking ticket extensions, VPS servers, proxy IP setups, and digital tools (including GADAR, STAR_TS, PRO MAX, HITMAN, SUPERMAN, BTS, PANDA, WINDOW TS, AVATAR, OCEAN EXTENSION, BINGO, RANGER).
            </p>
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <h3 className="font-semibold text-amber-400 text-xs uppercase tracking-wider">License Conditions:</h3>
              <p className="text-xs text-slate-300">
                Purchased software licenses grant a non-exclusive, non-transferable, limited license to run the software on designated devices for personal or specified commercial usage. Reverse engineering, cracking, reselling, or unauthorized duplication is strictly prohibited.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section id="payments" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                <CreditCard className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">4. Payments, Pricing & Order Processing</h2>
            </div>
            <p>
              All prices listed on our website are in Indian Rupees (INR) unless otherwise explicitly specified.
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>Payments are processed securely via verified digital payment gateways, UPI, or manual verification routes.</li>
              <li>Orders are fulfilled upon successful confirmation of payment receipt. Software access keys and setup guides are dispatched promptly via customer portal or WhatsApp support.</li>
              <li>We reserve the right to revise pricing or discount promotions at any time without prior notice.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section id="usage" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">5. Fair Usage & License Activation</h2>
            </div>
            <p>
              Customers must adhere to fair usage policies. Software keys are assigned per key/device policy. Any attempt to abuse software activations, automate key duplication, or overload servers will result in key revocation.
            </p>
          </section>

          {/* Section 6 */}
          <section id="support" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400 border border-emerald-500/20">
                <Headphones className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">6. Dedicated Customer Support Hours</h2>
            </div>
            <div className="bg-emerald-950/30 border border-emerald-800/40 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2 font-semibold text-emerald-400 text-sm">
                <Headphones className="w-4 h-4" /> Support Timings: 7:30 AM to 12:00 AM (IST)
              </div>
              <p className="text-xs text-slate-300">
                Our dedicated support desk (Super Master Bhimdada / D Enterprise Support) operates daily from 7:30 AM to 12:00 AM. Support inquiries submitted outside these hours will be handled promptly during the next operational window.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section id="disclaimer" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                <Scale className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">7. Disclaimer & Limitation of Liability</h2>
            </div>
            <p className="text-slate-300">
              Our tools and software are provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. While we strive to maximize speed, server stability, and software accuracy:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-300">
              <li>We do not guarantee 100% ticket confirmation, as railway server latency, quota availability, railway portal changes, and network conditions are outside our control.</li>
              <li>D ENTERPRISE TEAM shall not be liable for indirect, incidental, or consequential damages resulting from third-party server downtimes, Internet interruptions, or user input errors.</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section id="intellectual-property" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">8. Intellectual Property Rights</h2>
            </div>
            <p>
              All original content, branding, logos, code snippets, interface layouts, and software documentation on this portal belong exclusively to <strong className="text-white">D ENTERPRISE TEAM</strong>. Unauthorized reproduction, domain spoofing, or trademark misuse is strictly illegal.
            </p>
          </section>

          {/* Section 9 */}
          <section id="modifications" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">9. Amendments & Policy Updates</h2>
            </div>
            <p>
              We reserve the right to amend these Terms & Conditions at any time. Any changes will be posted on this page with an updated modification timestamp. Your continued use of the site after changes take effect signifies your consent to the updated terms.
            </p>
          </section>

          {/* Section 10 */}
          <section id="contact" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
                <HelpCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-white">10. Governing Law & Contact Information</h2>
            </div>
            <p>
              These Terms shall be governed by and construed in accordance with the laws of India. For any clarification, technical assistance, or inquiry regarding these terms:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase">Super Master Support</span>
                <p className="text-sm font-semibold text-white">WhatsApp / Call: +91 8521012621</p>
                <p className="text-xs text-slate-400">Available 7:30 AM to 12:00 AM</p>
              </div>
              <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs text-amber-400 font-bold uppercase">Official Domain</span>
                <p className="text-sm font-semibold text-white">denterpriese.softvps.in</p>
                <p className="text-xs text-slate-400">D ENTERPRISE TEAM Portal</p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer Banner Action */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-amber-500/10 via-slate-900 to-emerald-500/10 border border-slate-800 rounded-2xl p-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="text-base font-bold text-white">Have questions about our terms?</h3>
            <p className="text-xs text-slate-400">Our support team is ready to assist you on WhatsApp.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/privacy"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 transition-colors"
            >
              Privacy Policy <ExternalLink className="w-3.5 h-3.5" />
            </Link>
            <a
              href="https://wa.me/918521012621"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Contact Support
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
