'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Pill } from '@/components/ui'

interface NewsletterSubscriber {
  id: string
  email: string
  name: string
  status: 'subscribed' | 'unsubscribed'
  ipAddress: string
  userAgent?: string
  subscribedAt: string
  unsubscribedAt?: string
}

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState<'all' | 'subscribed' | 'unsubscribed'>('all')

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/newsletter-subscribers')
      const data = await response.json()

      if (data.success) {
        setSubscribers(data.data || [])
      } else {
        setError(data.error || 'Failed to load subscribers')
      }
    } catch (err) {
      setError('Failed to fetch subscribers')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleUnsubscribe = async (email: string) => {
    if (!confirm('Unsubscribe this user?')) return

    try {
      const response = await fetch('/api/newsletter-subscribers', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, status: 'unsubscribed' }),
      })

      if (response.ok) {
        fetchSubscribers()
      } else {
        alert('Failed to unsubscribe')
      }
    } catch (err) {
      alert('Error unsubscribing user')
      console.error(err)
    }
  }

  const handleDelete = async (email: string) => {
    if (!confirm('Delete this subscriber permanently?')) return

    try {
      const response = await fetch(`/api/newsletter-subscribers?email=${encodeURIComponent(email)}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSubscribers()
      } else {
        alert('Failed to delete subscriber')
      }
    } catch (err) {
      alert('Error deleting subscriber')
      console.error(err)
    }
  }

  const filtered = subscribers.filter((sub) => {
    const matchesSearch =
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || sub.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const activeCount = subscribers.filter(s => s.status === 'subscribed').length
  const unsubscribedCount = subscribers.filter(s => s.status === 'unsubscribed').length

  return (
    <div className="space-y-8">
      <header>
        <h1 className="font-display text-[30px] leading-tight text-ink">Newsletter Subscribers</h1>
        <p className="mt-1.5 text-[14px] text-muted">
          Manage your newsletter subscriber list
        </p>
      </header>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="label">Total Subscribers</p>
          <p className="mt-2 font-display text-[34px] leading-none text-ink">{subscribers.length}</p>
        </div>
        <div className="card p-5">
          <p className="label">Active</p>
          <p className="mt-2 font-display text-[34px] leading-none text-ink">{activeCount}</p>
        </div>
        <div className="card p-5">
          <p className="label">Unsubscribed</p>
          <p className="mt-2 font-display text-[34px] leading-none text-ink">{unsubscribedCount}</p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-5 space-y-4">
        <div>
          <label className="block text-[12px] font-semibold text-muted mb-2">Search</label>
          <input
            type="text"
            placeholder="Search by email or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-rule text-[14px] outline-none focus:border-gold-500"
          />
        </div>

        <div>
          <label className="block text-[12px] font-semibold text-muted mb-2">Filter by Status</label>
          <div className="flex gap-2">
            {(['all', 'subscribed', 'unsubscribed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-[14px] font-semibold transition ${
                  filterStatus === status
                    ? 'bg-ink text-white'
                    : 'border border-rule text-ink hover:border-ink/25'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted">Loading subscribers...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-muted">
            {subscribers.length === 0 ? 'No subscribers yet' : 'No results matching filters'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[14px]">
              <thead>
                <tr className="border-b border-rule">
                  <th className="px-5 py-4 text-left font-semibold text-ink">Email</th>
                  <th className="px-5 py-4 text-left font-semibold text-ink">Name</th>
                  <th className="px-5 py-4 text-left font-semibold text-ink">Status</th>
                  <th className="px-5 py-4 text-left font-semibold text-ink">Subscribed</th>
                  <th className="px-5 py-4 text-center font-semibold text-ink">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-rule hover:bg-mist/50 transition">
                    <td className="px-5 py-3">
                      <a href={`mailto:${subscriber.email}`} className="text-gold-600 hover:text-gold-700">
                        {subscriber.email}
                      </a>
                    </td>
                    <td className="px-5 py-3 text-muted">{subscriber.name || '—'}</td>
                    <td className="px-5 py-3">
                      <Pill status={subscriber.status === 'subscribed' ? 'published' : 'draft'} />
                    </td>
                    <td className="px-5 py-3 text-muted text-[13px]">
                      {new Date(subscriber.subscribedAt).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-5 py-3 text-center space-x-2">
                      {subscriber.status === 'subscribed' ? (
                        <button
                          onClick={() => handleUnsubscribe(subscriber.email)}
                          className="text-[12px] text-red-600 hover:text-red-700 font-semibold"
                        >
                          Unsubscribe
                        </button>
                      ) : (
                        <span className="text-[12px] text-muted">Unsubscribed</span>
                      )}
                      <button
                        onClick={() => handleDelete(subscriber.email)}
                        className="text-[12px] text-gray-500 hover:text-gray-700 ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
