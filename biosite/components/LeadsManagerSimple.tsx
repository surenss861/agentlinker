'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MessageSquare, Calendar, Eye, CheckCircle, XCircle, Plus, Clock, Lock } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import type { Lead } from '@/lib/hooks/useRealtimeLeads'
import { useSubscription } from '@/lib/hooks/useSubscription'

interface LeadStats {
  total: number
  thisMonth: number
  conversionRate: number
  averageResponseTime: number
  pipelineBreakdown: {
    new: number
    contacted: number
    scheduled: number
    closed: number
    lost: number
  }
  leadsBySource: Record<string, number>
  dailyLeads: { date: string; count: number }[]
}

interface LeadsManagerProps {
  leads: Lead[]
  stats: LeadStats
  loading: boolean
  onStatusChange: (leadId: string, status: string) => void
  onDeleteLead: (leadId: string) => void
}

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  new: {
    label: 'New',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: '🆕'
  },
  contacted: {
    label: 'Contacted',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: '📞'
  },
  scheduled: {
    label: 'Scheduled',
    color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    icon: '📅'
  },
  closed: {
    label: 'Closed',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: '🎉'
  },
  lost: {
    label: 'Lost',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: '❌'
  },
  // Legacy support (in case old statuses exist)
  pending: {
    label: 'New',
    color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    icon: '🆕'
  },
  confirmed: {
    label: 'Contacted',
    color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    icon: '📞'
  },
  cancelled: {
    label: 'Lost',
    color: 'bg-red-500/20 text-red-400 border-red-500/30',
    icon: '❌'
  },
  completed: {
    label: 'Closed',
    color: 'bg-green-500/20 text-green-400 border-green-500/30',
    icon: '🎉'
  }
}

export default function LeadsManagerSimple({ leads, stats, loading, onStatusChange, onDeleteLead }: LeadsManagerProps) {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards')
  const { subscription, hasFeature } = useSubscription()
  const [statusFilter, setStatusFilter] = useState<string>('all')

  // Limit leads for free users
  const maxLeadsForFree = 5
  const displayLeads = hasFeature('analytics') 
    ? leads 
    : leads.slice(0, maxLeadsForFree)

  const filteredLeads = displayLeads.filter(lead => 
    statusFilter === 'all' || lead.status === statusFilter
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F3C77E] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading leads...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Leads</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">This month: {stats.thisMonth}</p>
            </div>
            <MessageSquare className="w-10 h-10 text-[#F3C77E]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Conversion Rate</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.conversionRate.toFixed(1)}%</p>
              <p className="text-xs text-green-400 mt-1">Above average</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Avg Response</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.averageResponseTime.toFixed(1)}h</p>
              <p className="text-xs text-blue-400 mt-1">Fast response</p>
            </div>
            <Clock className="w-10 h-10 text-blue-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Pipeline</p>
              <p className="text-sm text-gray-300 mt-2">
                🟡 {stats.pipelineBreakdown.new} New<br/>
                🔵 {stats.pipelineBreakdown.contacted} Contacted<br/>
                🟢 {stats.pipelineBreakdown.closed} Closed
              </p>
            </div>
            <Calendar className="w-10 h-10 text-purple-400" />
          </div>
        </motion.div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'cards' 
                ? 'bg-[#F3C77E] text-[#080705]' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              viewMode === 'table' 
                ? 'bg-[#F3C77E] text-[#080705]' 
                : 'bg-white/5 text-gray-400 hover:bg-white/10'
            }`}
          >
            Table
          </button>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:ring-2 focus:ring-[#F3C77E] focus:border-[#F3C77E]"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="scheduled">Scheduled</option>
          <option value="closed">Closed</option>
          <option value="lost">Lost</option>
        </select>
      </div>

      {/* Leads Display */}
      <AnimatePresence mode="wait">
        {filteredLeads.length > 0 ? (
          <motion.div
            key="leads"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 gap-4"
          >
            {filteredLeads.map((lead, index) => {
              const config = statusConfig[lead.status] || statusConfig['new'] // Fallback to 'new' if status is unknown
              return (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-md rounded-xl p-6 border border-white/10 hover:bg-white/8 transition-all cursor-pointer"
                  onClick={() => setSelectedLead(lead)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{lead.client_name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${config.color}`}>
                          {config.icon} {config.label}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        {lead.client_email && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Mail className="w-4 h-4" />
                            {hasFeature('analytics') ? (
                              lead.client_email
                            ) : (
                              <span className="text-gray-500 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                {lead.client_email.substring(0, 3)}***@***.***
                              </span>
                            )}
                          </div>
                        )}
                        {lead.client_phone && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Phone className="w-4 h-4" />
                            {hasFeature('analytics') ? (
                              lead.client_phone
                            ) : (
                              <span className="text-gray-500 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                ***-***-{lead.client_phone.slice(-4)}
                              </span>
                            )}
                          </div>
                        )}
                        {lead.message && (
                          <div className="flex items-start gap-2 text-gray-400 mt-3">
                            <MessageSquare className="w-4 h-4 mt-0.5" />
                            {hasFeature('analytics') ? (
                              <p className="line-clamp-2">{lead.message}</p>
                            ) : (
                              <p className="line-clamp-2 text-gray-500 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Message hidden - Upgrade to view
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right text-sm text-gray-400">
                      <p>{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</p>
                      {lead.source && (
                        <p className="text-xs mt-1">via {lead.source}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        if (!hasFeature('analytics')) {
                          alert('Upgrade to Pro to contact leads')
                          return
                        }
                        window.location.href = `mailto:${lead.client_email}`
                      }}
                      className={`px-4 py-2 rounded-lg text-sm transition-all ${
                        hasFeature('analytics')
                          ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                          : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                      }`}
                      disabled={!hasFeature('analytics')}
                    >
                      {hasFeature('analytics') ? '📧 Email' : '🔒 Email'}
                    </button>
                    {lead.client_phone && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!hasFeature('analytics')) {
                            alert('Upgrade to Pro to contact leads')
                            return
                          }
                          window.location.href = `tel:${lead.client_phone}`
                        }}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                          hasFeature('analytics')
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!hasFeature('analytics')}
                      >
                        {hasFeature('analytics') ? '📞 Call' : '🔒 Call'}
                      </button>
                    )}
                    {lead.status === 'new' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (!hasFeature('analytics')) {
                            alert('Upgrade to Pro to manage leads')
                            return
                          }
                          onStatusChange(lead.id, 'contacted')
                        }}
                        className={`px-4 py-2 rounded-lg text-sm transition-all ${
                          hasFeature('analytics')
                            ? 'bg-[#F3C77E]/20 text-[#F3C77E] hover:bg-[#F3C77E]/30'
                            : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                        }`}
                        disabled={!hasFeature('analytics')}
                      >
                        {hasFeature('analytics') ? '✓ Mark Contacted' : '🔒 Mark Contacted'}
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12 bg-white/5 rounded-2xl border border-white/10 max-w-2xl mx-auto"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#F3C77E]/20 to-[#912F40]/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <MessageSquare className="w-10 h-10 text-[#F3C77E]" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">Start Receiving Leads</h3>
            <p className="text-gray-300 mb-6 text-lg px-6">
              Share your AgentLinker page to start receiving showing requests from interested buyers
            </p>
            
            {/* Onboarding Steps */}
            <div className="bg-black/30 rounded-xl p-6 mb-6 text-left max-w-md mx-auto">
              <h4 className="text-white font-semibold mb-3 text-center">How to get leads:</h4>
              <ol className="space-y-2 text-gray-300 text-sm">
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#F3C77E]/20 rounded-full flex items-center justify-center text-[#F3C77E] text-xs font-bold">1</span>
                  <span>Add your property listings in the Listings section</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#F3C77E]/20 rounded-full flex items-center justify-center text-[#F3C77E] text-xs font-bold">2</span>
                  <span>Share your unique AgentLinker profile link on social media, email signatures, and marketing materials</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-[#F3C77E]/20 rounded-full flex items-center justify-center text-[#F3C77E] text-xs font-bold">3</span>
                  <span>When buyers submit showing requests, they'll appear here in real-time</span>
                </li>
              </ol>
            </div>

            <a
              href="/dashboard/listings"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#912F40] to-[#702632] hover:from-[#702632] hover:to-[#912F40] text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Your First Listing
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Free user limit message */}
      {!hasFeature('analytics') && leads.length > maxLeadsForFree && (
        <div className="mt-6 p-4 bg-gradient-to-r from-[#F3C77E]/20 to-[#912F40]/20 border border-[#F3C77E]/30 rounded-xl">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[#F3C77E]" />
            <div>
              <h3 className="text-white font-semibold">Showing {maxLeadsForFree} of {leads.length} leads</h3>
              <p className="text-gray-300 text-sm">Upgrade to Pro to see all leads and manage them</p>
            </div>
          </div>
        </div>
      )}

      {/* Simple Lead Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-b from-[#080705] to-[#1A0E10] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/10"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{selectedLead.client_name}</h2>
                  <p className="text-gray-400">{formatDistanceToNow(new Date(selectedLead.created_at), { addSuffix: true })}</p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Contact Info */}
              <div className="space-y-4 mb-6">
                {selectedLead.client_email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-[#F3C77E]" />
                    {hasFeature('analytics') ? (
                      <a href={`mailto:${selectedLead.client_email}`} className="text-gray-300 hover:text-white">
                        {selectedLead.client_email}
                      </a>
                    ) : (
                      <span className="text-gray-500 flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        {selectedLead.client_email.substring(0, 3)}***@***.***
                      </span>
                    )}
                  </div>
                )}
                {selectedLead.client_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-[#F3C77E]" />
                    {hasFeature('analytics') ? (
                      <a href={`tel:${selectedLead.client_phone}`} className="text-gray-300 hover:text-white">
                        {selectedLead.client_phone}
                      </a>
                    ) : (
                      <span className="text-gray-500 flex items-center gap-2">
                        <Lock className="w-3 h-3" />
                        ***-***-{selectedLead.client_phone.slice(-4)}
                      </span>
                    )}
                  </div>
                )}
                {!hasFeature('analytics') && (
                  <p className="text-[#F3C77E] text-sm">Upgrade to Pro to view full contact information</p>
                )}
              </div>

              {/* Message */}
              {selectedLead.message && (
                <div className="bg-white/5 rounded-lg p-4 mb-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Message</h3>
                  {hasFeature('analytics') ? (
                    <p className="text-white">{selectedLead.message}</p>
                  ) : (
                    <p className="text-gray-500 flex items-center gap-2">
                      <Lock className="w-3 h-3" />
                      <span>Message hidden - Upgrade to Pro to view</span>
                    </p>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <select
                  value={selectedLead.status}
                  onChange={(e) => {
                    if (!hasFeature('analytics')) {
                      alert('Upgrade to Pro to manage leads')
                      return
                    }
                    onStatusChange(selectedLead.id, e.target.value)
                  }}
                  className={`flex-1 px-4 py-3 border rounded-lg text-white focus:ring-2 ${
                    hasFeature('analytics')
                      ? 'bg-white/5 border-white/10 focus:ring-[#F3C77E]'
                      : 'bg-gray-500/20 border-gray-500/30 cursor-not-allowed'
                  }`}
                  disabled={!hasFeature('analytics')}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="closed">Closed</option>
                  <option value="lost">Lost</option>
                </select>
                <button
                  onClick={() => {
                    if (!hasFeature('analytics')) {
                      alert('Upgrade to Pro to manage leads')
                      return
                    }
                    if (confirm('Delete this lead?')) {
                      onDeleteLead(selectedLead.id)
                      setSelectedLead(null)
                    }
                  }}
                  className={`px-6 py-3 rounded-lg transition-all ${
                    hasFeature('analytics')
                      ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                      : 'bg-gray-500/20 text-gray-500 cursor-not-allowed'
                  }`}
                  disabled={!hasFeature('analytics')}
                >
                  {hasFeature('analytics') ? 'Delete' : '🔒 Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
