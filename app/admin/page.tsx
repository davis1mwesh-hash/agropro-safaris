'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const ADMIN_PASSWORD = 'agropro2025'

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [page, setPage] = useState('dashboard')
  const [farms, setFarms] = useState<any[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
const [events, setEvents] = useState<any[]>([])

  useEffect(() => {
    if (authed) {
      fetchFarms()
      fetchBookings()
      fetchEvents()
    }
  }, [authed])

  async function fetchFarms() {
    const { data } = await supabase
      .from('farms')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setFarms(data)
  }

  async function fetchBookings() {
    const { data } = await supabase
      .from('bookings')
      .select('*, farms(name)')
      .order('created_at', { ascending: false })
    if (data) setBookings(data)
  }

  async function fetchEvents() {
    const { data } = await supabase
      .from('events')
      .select('*, farms(name)')
      .order('created_at', { ascending: false })
    if (data) setEvents(data)
  }

  async function approveEvent(id: string) {
    await supabase.from('events').update({ status: 'approved' }).eq('id', id)
    fetchEvents()
  }

  async function rejectEvent(id: string) {
    await supabase.from('events').update({ status: 'rejected' }).eq('id', id)
    fetchEvents()
  }

  async function deleteEvent(id: string) {
    if (!confirm('Delete this event?')) return
    await supabase.from('events').delete().eq('id', id)
    fetchEvents()
  }
  async function approveFarm(id: string) {
    setLoading(true)
    await supabase.from('farms').update({ status: 'approved' }).eq('id', id)
    await fetchFarms()
    setLoading(false)
  }

  async function rejectFarm(id: string) {
    setLoading(true)
    await supabase.from('farms').update({ status: 'rejected' }).eq('id', id)
    await fetchFarms()
    setLoading(false)
  }

  async function deleteFarm(id: string, name: string) {
    if (!confirm(`Permanently delete "${name}"? This cannot be undone.`)) return
    setLoading(true)
    await supabase.from('farms').delete().eq('id', id)
    await fetchFarms()
    setLoading(false)
  }

  async function markPaid(bookingId: string) {
    await supabase.from('bookings').update({ payout_status: 'paid' }).eq('id', bookingId)
    fetchBookings()
  }

  function doLogin() {
    if (password === ADMIN_PASSWORD) {
      setAuthed(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  const pending = farms.filter(f => f.status === 'pending')
  const approved = farms.filter(f => f.status === 'approved')
  const rejected = farms.filter(f => f.status === 'rejected')
  const totalRevenue = bookings.reduce((sum, b) => sum + (b.total_amount || 0), 0)
  const totalCommission = Math.round(totalRevenue * 0.1)

  if (!authed) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a3d2b] to-[#2d6a4f] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full shadow-xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#1a3d2b] rounded-xl flex items-center justify-center text-3xl mx-auto mb-3">🌿</div>
            <h1 className="text-xl font-bold text-gray-900">AgroPro Safaris</h1>
            <p className="text-gray-400 text-sm">Admin Portal</p>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-xl mb-4 text-center">
              Incorrect password
            </div>
          )}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doLogin()}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c] text-gray-900"
              placeholder="Enter admin password"
            />
          </div>
          <button onClick={doLogin}
            className="w-full bg-[#1a3d2b] text-white py-3 rounded-xl font-semibold hover:bg-[#2d6a4f] transition">
            Sign In →
          </button>
          <p className="text-xs text-gray-400 text-center mt-4">🔒 Private — not linked on public site</p>
        </div>
      </main>
    )
  }

  const navItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'registrations', icon: '📋', label: 'Registrations', count: pending.length, color: 'red' },
    { id: 'farms', icon: '🌾', label: 'Active Farms' },
    { id: 'bookings', icon: '📅', label: 'Bookings' },
    { id: 'payouts', icon: '💰', label: 'Payouts', count: bookings.filter(b => b.payout_status !== 'paid').length, color: 'amber' },
    { id: 'events', icon: '🎪', label: 'Events', count: events.filter(e => e.status === 'pending').length, color: 'red' },
  ]

  return (
    <main className="min-h-screen bg-[#f7f6f3] flex">

      {/* SIDEBAR */}
      <aside className="w-56 bg-[#1a3d2b] min-h-screen flex flex-col fixed top-0 left-0 bottom-0 z-50">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#40916c] rounded-lg flex items-center justify-center text-base">🌿</div>
            <div>
              <div className="text-white font-bold text-sm">AgroPro</div>
              <div className="text-[#e9a825] text-xs font-bold">ADMIN</div>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                page === item.id ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}>
              <span>{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.count ? (
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  item.color === 'red' ? 'bg-red-500 text-white' : 'bg-[#e9a825] text-[#1a1a1a]'
                }`}>{item.count}</span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-1">
          <a href="/" target="_blank"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white transition">
            🌐 View Public Site
          </a>
          <button onClick={() => setAuthed(false)}
            className="w-full text-white/40 hover:text-white text-xs py-2 transition text-left px-3">
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="ml-56 flex-1 p-8">

        {/* TOPBAR */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-xl font-bold text-gray-900 capitalize">{page}</h1>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400">
              {new Date().toLocaleDateString('en-KE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <button onClick={() => { fetchFarms(); fetchBookings() }}
              className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-900 transition">
              ↻ Refresh
            </button>
          </div>
        </div>

        {/* DASHBOARD */}
        {page === 'dashboard' && (
          <div>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Active Farms', value: approved.length, icon: '🌾', color: 'text-green-700' },
                { label: 'Pending Approval', value: pending.length, icon: '⏳', color: 'text-red-600' },
                { label: 'Total Bookings', value: bookings.length, icon: '📅', color: 'text-blue-600' },
                { label: 'Your Commission', value: `KES ${totalCommission.toLocaleString()}`, icon: '💰', color: 'text-green-700' },
              ].map((k, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="text-2xl mb-2">{k.icon}</div>
                  <div className={`text-2xl font-bold mb-1 ${k.color}`}>{k.value}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">{k.label}</div>
                </div>
              ))}
            </div>

            {pending.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 mb-6">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">🔔 Farms Awaiting Approval ({pending.length})</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {pending.map(farm => (
                    <div key={farm.id} className="px-6 py-4 flex items-center justify-between flex-wrap gap-3">
                      <div>
                        <div className="font-semibold text-gray-900">{farm.name}</div>
                        <div className="text-sm text-gray-400">{farm.type} · {farm.county} · Visit: {farm.visit_date} · {farm.visit_time}</div>
                        <div className="text-sm text-gray-400">📞 {farm.host_phone} · ✉️ {farm.host_email}</div>
                      </div>
                      <div className="flex gap-2">
                        <a href={`https://wa.me/${farm.host_phone?.replace(/\s/g, '').replace(/^0/, '254')}`}
                          target="_blank"
                          className="bg-[#f0faf2] text-[#2d6a4f] border border-[#d8f3dc] px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-[#2d6a4f] hover:text-white transition">
                          💬 WhatsApp
                        </a>
                        <button onClick={() => approveFarm(farm.id)}
                          className="bg-green-50 text-green-700 border border-green-200 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-green-700 hover:text-white transition">
                          ✓ Approve
                        </button>
                        <button onClick={() => rejectFarm(farm.id)}
                          className="bg-red-50 text-red-600 border border-red-200 px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-red-600 hover:text-white transition">
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pending.length === 0 && (
              <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400 mb-6">
                <div className="text-4xl mb-3">✅</div>
                <p>No pending farm registrations</p>
              </div>
            )}

            {/* Recent bookings */}
            <div className="bg-white rounded-xl border border-gray-100">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Recent Bookings</h2>
              </div>
              {bookings.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No bookings yet</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-3 text-left">Visitor</th>
                      <th className="px-6 py-3 text-left">Farm</th>
                      <th className="px-6 py-3 text-left">Date</th>
                      <th className="px-6 py-3 text-left">Amount</th>
                      <th className="px-6 py-3 text-left">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.slice(0, 5).map(b => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-sm text-gray-900">{b.visitor_name}</div>
                          <div className="text-xs text-gray-400">{b.visitor_phone}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-800">{b.farms?.name || '—'}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{b.visit_date}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-[#2d6a4f]">KES {b.total_amount?.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                          }`}>{b.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* REGISTRATIONS */}
        {page === 'registrations' && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">All Farm Registrations ({farms.length})</h2>
            </div>
            {farms.length === 0 ? (
              <div className="p-10 text-center text-gray-400">No registrations yet</div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">Farm</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">County</th>
                    <th className="px-6 py-3 text-left">Contact</th>
                    <th className="px-6 py-3 text-left">Visit Date</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {farms.map(farm => (
                    <tr key={farm.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 text-sm">{farm.name}</div>
                        <div className="text-xs text-gray-400">{farm.location}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{farm.type}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{farm.county}</td>
                      <td className="px-6 py-4">
                        <div className="text-xs text-gray-800">{farm.host_phone}</div>
                        <div className="text-xs text-gray-400">{farm.host_email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{farm.visit_date}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          farm.status === 'approved' ? 'bg-green-100 text-green-700' :
                          farm.status === 'rejected' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {farm.status === 'approved' ? '✓ Approved' :
                           farm.status === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2 flex-wrap">
                          {farm.status === 'pending' && (
                            <>
                              <button onClick={() => approveFarm(farm.id)}
                                className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-green-700 hover:text-white transition">
                                ✓ Approve
                              </button>
                              <button onClick={() => rejectFarm(farm.id)}
                                className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-red-600 hover:text-white transition">
                                ✗ Reject
                              </button>
                            </>
                          )}
                          {farm.status === 'rejected' && (
                            <button onClick={() => approveFarm(farm.id)}
                              className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-green-700 hover:text-white transition">
                              ✓ Approve
                            </button>
                          )}
                          <a href={`https://wa.me/${farm.host_phone?.replace(/\s/g, '').replace(/^0/, '254')}`}
                            target="_blank"
                            className="bg-[#f0faf2] text-[#2d6a4f] px-2 py-1 rounded-lg text-xs font-semibold hover:bg-[#2d6a4f] hover:text-white transition">
                            💬
                          </a>
                          <button onClick={() => deleteFarm(farm.id, farm.name)}
                            className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-red-600 hover:text-white transition">
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ACTIVE FARMS */}
        {page === 'farms' && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Active Farms ({approved.length})</h2>
            </div>
            {approved.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <div className="text-4xl mb-3">🌾</div>
                <p>No approved farms yet.</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">Farm</th>
                    <th className="px-6 py-3 text-left">Type</th>
                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-left">M-Pesa</th>
                    <th className="px-6 py-3 text-left">Open Days</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {approved.map(farm => (
                    <tr key={farm.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 text-sm">{farm.name}</div>
                        <div className="text-xs text-gray-400">{farm.county}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{farm.type}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#2d6a4f]">
                        KES {farm.price_per_person?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{farm.mpesa_number || '—'}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {farm.open_days?.join(' · ')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button onClick={() => rejectFarm(farm.id)}
                            className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-yellow-700 hover:text-white transition">
                            Suspend
                          </button>
                          <button onClick={() => deleteFarm(farm.id, farm.name)}
                            className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-red-600 hover:text-white transition">
                            🗑 Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* BOOKINGS */}
        {page === 'bookings' && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">All Bookings ({bookings.length})</h2>
            </div>
            {bookings.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <div className="text-4xl mb-3">📅</div>
                <p>No bookings yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">Visitor</th>
                    <th className="px-6 py-3 text-left">Farm</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Guests</th>
                    <th className="px-6 py-3 text-left">Total</th>
                    <th className="px-6 py-3 text-left">Commission</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-sm text-gray-900">{b.visitor_name}</div>
                        <div className="text-xs text-gray-400">{b.visitor_phone}</div>
                        <div className="text-xs text-gray-400">{b.visitor_email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{b.farms?.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{b.visit_date}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{b.guests}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">KES {b.total_amount?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#2d6a4f]">
                        KES {Math.round((b.total_amount || 0) * 0.1).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          b.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-blue-50 text-blue-600'
                        }`}>{b.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* PAYOUTS */}
        {page === 'payouts' && (
          <div>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total Collected', value: `KES ${totalRevenue.toLocaleString()}`, color: 'text-gray-900' },
                { label: 'Your Commission (10%)', value: `KES ${totalCommission.toLocaleString()}`, color: 'text-green-700' },
                { label: 'Owed to Farms (90%)', value: `KES ${Math.round(totalRevenue * 0.9).toLocaleString()}`, color: 'text-orange-600' },
              ].map((k, i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className={`text-2xl font-bold mb-1 ${k.color}`}>{k.value}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">{k.label}</div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Payout Tracker</h2>
                <p className="text-sm text-gray-400 mt-1">Mark as paid after sending M-Pesa to farm</p>
              </div>
              {bookings.length === 0 ? (
                <div className="p-10 text-center text-gray-400">No payouts yet</div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                      <th className="px-6 py-3 text-left">Farm</th>
                      <th className="px-6 py-3 text-left">Visitor</th>
                      <th className="px-6 py-3 text-left">Total</th>
                      <th className="px-6 py-3 text-left">Farm Gets (90%)</th>
                      <th className="px-6 py-3 text-left">Payout Status</th>
                      <th className="px-6 py-3 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {bookings.map(b => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">{b.farms?.name || '—'}</td>
                        <td className="px-6 py-4 text-sm text-gray-800">{b.visitor_name}</td>
                        <td className="px-6 py-4 text-sm font-semibold">KES {b.total_amount?.toLocaleString()}</td>
                        <td className="px-6 py-4 text-sm font-semibold text-orange-600">
                          KES {Math.round((b.total_amount || 0) * 0.9).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                            b.payout_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {b.payout_status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {b.payout_status !== 'paid' ? (
                            <button onClick={() => markPaid(b.id)}
                              className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-700 hover:text-white transition">
                              ✓ Mark Paid
                            </button>
                          ) : (
                            <span className="text-xs text-gray-400">Done</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
{/* EVENTS */}
        {page === 'events' && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-900">Farm Events ({events.length})</h2>
                <p className="text-sm text-gray-400 mt-1">Review and approve events submitted by farms</p>
              </div>
            </div>
            {events.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <div className="text-4xl mb-3">🎪</div>
                <p>No events submitted yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">Event</th>
                    <th className="px-6 py-3 text-left">Farm</th>
                    <th className="px-6 py-3 text-left">Date</th>
                    <th className="px-6 py-3 text-left">Price</th>
                    <th className="px-6 py-3 text-left">Attendees</th>
                    <th className="px-6 py-3 text-left">Status</th>
                    <th className="px-6 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {events.map(event => (
                    <tr key={event.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-sm text-gray-900">{event.title}</div>
                        <div className="text-xs text-gray-400">{event.event_type}</div>
                        <div className="text-xs text-gray-500 mt-1 max-w-xs">{event.description}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{event.farms?.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">
                        {event.event_date}<br/>
                        <span className="text-xs text-gray-400">{event.event_time}</span>
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#2d6a4f]">
                        {event.price === 0 ? 'FREE' : `KES ${event.price?.toLocaleString()}`}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">Max {event.max_attendees}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          event.status === 'approved' ? 'bg-green-100 text-green-700' :
                          event.status === 'rejected' ? 'bg-red-100 text-red-600' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {event.status === 'approved' ? '✓ Live' :
                           event.status === 'rejected' ? '✗ Rejected' : '⏳ Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {event.status === 'pending' && (
                            <>
                              <button onClick={() => approveEvent(event.id)}
                                className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-green-700 hover:text-white transition">
                                ✓ Approve
                              </button>
                              <button onClick={() => rejectEvent(event.id)}
                                className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-red-600 hover:text-white transition">
                                ✗ Reject
                              </button>
                            </>
                          )}
                          {event.status === 'approved' && (
                            <button onClick={() => rejectEvent(event.id)}
                              className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-yellow-700 hover:text-white transition">
                              Suspend
                            </button>
                          )}
                          <button onClick={() => deleteEvent(event.id)}
                            className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-red-600 hover:text-white transition">
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </main>
  )
}