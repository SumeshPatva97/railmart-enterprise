'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    q: 'Are all products compliant with RDSO & Indian Railways specifications?',
    a: 'Yes. All track tools, signaling lamps, and locomotive electrical spares listed on RailMart are manufactured according to standard RDSO (Research Designs and Standards Organisation) and IS guidelines. Test certificates are provided with every shipment.',
  },
  {
    q: 'How does GST tax credit invoicing work for corporate orders?',
    a: 'During checkout, enter your company GSTIN and billing address. Instant 18% GST tax invoices are generated automatically with your order confirmation and available for download anytime in your account dashboard.',
  },
  {
    q: 'What payment methods are supported for heavy machinery?',
    a: 'We support online payments via Razorpay (Netbanking, UPI, Corporate Credit Cards), Stripe, Cash on Delivery for eligible items, and NEFT/RTGS direct bank transfers for bulk procurement orders.',
  },
  {
    q: 'What is the standard delivery timeline for site dispatch?',
    a: 'In-stock equipment is dispatched within 24 hours. Transit times vary from 2 to 5 business days across pan-India railway workshops and contractor sites via insured logistics lines.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-slate-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-railway-400 uppercase tracking-widest">Need Clarification?</span>
          <h2 className="text-3xl font-extrabold text-white mt-1">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between text-white font-bold text-sm gap-4 hover:text-railway-400 transition-colors"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-railway-400 flex-shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 mt-1 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
