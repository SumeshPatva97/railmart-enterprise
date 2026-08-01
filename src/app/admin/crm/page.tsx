'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  Briefcase,
  UserCheck,
  HelpCircle,
  Calendar,
  Download,
  Plus,
  MessageSquare,
  FileSpreadsheet,
} from 'lucide-react';

export default function EnterpriseCRMPage() {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'leads' | 'tickets' | 'reminders' | 'reports'>('leads');
  const [loading, setLoading] = useState(true);

  // Add lead modal
  const [showAddLead, setShowAddLead] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    source: 'Website Inquiry',
    notes: '',
  });

  // Reply / Staff note modal
  const [activeTicket, setActiveTicket] = useState<any | null>(null);
  const [replyMsg, setReplyMsg] = useState('');
  const [staffNote, setStaffNote] = useState('');

  useEffect(() => {
    async function loadCRMData() {
      if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPPORT')) return;
      setLoading(true);
      try {
        const [leadRes, tktRes, remRes] = await Promise.all([
          fetch('/api/crm/leads'),
          fetch('/api/crm/tickets'),
          fetch('/api/crm/reminders'),
        ]);

        if (leadRes.ok) setLeads((await leadRes.json()).leads || []);
        if (tktRes.ok) setTickets((await tktRes.json()).tickets || []);
        if (remRes.ok) setReminders((await remRes.json()).reminders || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadCRMData();
  }, [user]);

  const handleUpdateLeadStatus = async (leadId: string, status: string) => {
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status }),
      });
      if (res.ok) {
        setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, status } : l)));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crm/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLead),
      });
      if (res.ok) {
        const data = await res.json();
        setLeads((prev) => [data.lead, ...prev]);
        setShowAddLead(false);
        setNewLead({ name: '', email: '', phone: '', company: '', source: 'Website Inquiry', notes: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendTicketReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket) return;
    try {
      const res = await fetch(`/api/crm/tickets/${activeTicket.id}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: replyMsg || undefined,
          internalNote: staffNote || undefined,
        }),
      });
      if (res.ok) {
        alert('Ticket reply / note saved successfully.');
        setActiveTicket(null);
        setReplyMsg('');
        setStaffNote('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPPORT')) {
    return <div className="min-h-screen bg-slate-950 py-20 text-center text-rose-400 font-bold">Access Denied. Staff CRM permissions required.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* CRM Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-emerald-400" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Enterprise CRM & Support Hub</h1>
            </div>
            <p className="text-slate-400 text-xs mt-1">Lead pipeline, customer 360 desk, internal staff notes, and CSV reports exporter.</p>
          </div>
        </div>

        {/* Tabs Navigation (Responsive scrollable) */}
        <div className="flex items-center gap-2 border-b border-slate-800 mb-8 overflow-x-auto pb-2 scrollbar-none whitespace-nowrap">
          <button
            onClick={() => setActiveTab('leads')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'leads' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Lead Management ({leads.length})
          </button>
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'tickets' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" /> Support Desk ({tickets.length})
          </button>
          <button
            onClick={() => setActiveTab('reminders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'reminders' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" /> Reminders Calendar ({reminders.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'reports' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> Export CSV Reports
          </button>
        </div>

        {/* Tab 1: Lead Pipeline */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <h3 className="text-sm font-bold text-white">Railway Contractor Leads & Inquiries</h3>
              <button
                onClick={() => setShowAddLead(true)}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 w-full sm:w-auto justify-center"
              >
                <Plus className="w-4 h-4" /> Capture New Lead
              </button>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-x-auto w-full shadow-xl">
              <table className="w-full text-left text-xs text-slate-300 min-w-[640px]">
                <thead className="bg-slate-950 text-slate-400 uppercase font-bold border-b border-slate-800">
                  <tr>
                    <th className="p-4">Contractor / Lead</th>
                    <th className="p-4">Company</th>
                    <th className="p-4">Contact</th>
                    <th className="p-4">Pipeline Status</th>
                    <th className="p-4">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-800/40">
                      <td className="p-4 font-bold text-white">{l.name}</td>
                      <td className="p-4">{l.company || 'Individual Contractor'}</td>
                      <td className="p-4">
                        <p>{l.email}</p>
                        <p className="text-[10px] text-slate-400">{l.phone}</p>
                      </td>
                      <td className="p-4">
                        <select
                          value={l.status}
                          onChange={(e) => handleUpdateLeadStatus(l.id, e.target.value)}
                          className="bg-slate-950 border border-slate-800 text-[11px] font-bold text-white px-2 py-1 rounded-lg"
                        >
                          <option value="NEW">NEW</option>
                          <option value="CONTACTED">CONTACTED</option>
                          <option value="QUALIFIED">QUALIFIED</option>
                          <option value="CONVERTED">CONVERTED</option>
                          <option value="LOST">LOST</option>
                        </select>
                      </td>
                      <td className="p-4 text-slate-400">{l.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Support Tickets Thread */}
        {activeTab === 'tickets' && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-white">Customer Support Ticket Desk</h3>

            <div className="space-y-4">
              {tickets.map((tkt) => (
                <div key={tkt.id} className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-2xl space-y-3">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white flex flex-wrap items-center gap-2">
                        <span>{tkt.ticketNumber}: {tkt.subject}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-amber-500/20 text-amber-400">
                          {tkt.status}
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">User: {tkt.user?.name} ({tkt.user?.email})</p>
                    </div>

                    <button
                      onClick={() => setActiveTicket(tkt)}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 w-full sm:w-auto justify-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> Staff Reply
                    </button>
                  </div>

                  {tkt.messages && (
                    <div className="bg-slate-950 p-3 rounded-xl space-y-2 text-xs text-slate-300">
                      {tkt.messages.map((m: any) => (
                        <p key={m.id}>
                          <strong className={m.senderType === 'AGENT' ? 'text-emerald-400' : 'text-railway-400'}>
                            [{m.senderType}]:
                          </strong>{' '}
                          {m.message}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: CSV Reports Exporter */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-white">Orders & Revenue CSV</h4>
              <p className="text-xs text-slate-400">Export complete order list with tax amounts, payment status, and customer details.</p>
              <a
                href="/api/crm/export?type=orders"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Orders CSV
              </a>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-white">CRM Leads CSV</h4>
              <p className="text-xs text-slate-400">Export lead pipeline data for sales follow-ups and marketing analytics.</p>
              <a
                href="/api/crm/export?type=leads"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Leads CSV
              </a>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-white">Product Inventory CSV</h4>
              <p className="text-xs text-slate-400">Export current product catalog, stock counts, SKUs, and categories.</p>
              <a
                href="/api/crm/export?type=products"
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-2"
              >
                <Download className="w-4 h-4" /> Download Inventory CSV
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {showAddLead && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Capture Railway Lead</h3>
            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Contractor Name</label>
                <input
                  type="text"
                  value={newLead.name}
                  onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 block mb-1">Email</label>
                  <input
                    type="email"
                    value={newLead.email}
                    onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Phone</label>
                  <input
                    type="text"
                    value={newLead.phone}
                    onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLead(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Staff Reply Modal */}
      {activeTicket && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white">Staff Reply for #{activeTicket.ticketNumber}</h3>
            <form onSubmit={handleSendTicketReply} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Customer Reply</label>
                <textarea
                  rows={3}
                  value={replyMsg}
                  onChange={(e) => setReplyMsg(e.target.value)}
                  placeholder="Type visible message to customer..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>
              <div>
                <label className="text-amber-400 block mb-1 font-bold">Internal Staff Note (Private)</label>
                <textarea
                  rows={2}
                  value={staffNote}
                  onChange={(e) => setStaffNote(e.target.value)}
                  placeholder="Note for internal staff audit only..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white"
                />
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTicket(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold">
                  Send Response
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
