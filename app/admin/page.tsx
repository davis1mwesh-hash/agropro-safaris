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

  useEffect(() => {
    if (authed) {
      fetchFarms()
      fetchBookings()
    }
  }, [authed])

  async function fetchFarms() {
    const { data } = await supabase.from('farms').select('*').order('created_at', { ascending: false })
    if (data) setFarms(data)
  }

  async function fetchBookings() {
    const { data } = await supabase
      .from('bookings')
      .select('*, farms(name)')
      .order('created_at', { ascending: false })
    if (data) setBookings(data)
  }

  async function approveFarm(id: string) {
    setLoading(true)
    await supabase.from('farms').update({ status: 'approved' }).eq('id', id)
    await fetchFarms()
    setLoading(false)
  }

  async function rejectFarm(id: string) {
    await supabase.from('farms').update({ status: 'rejected' }).eq('id', id)
    fetchFarms()
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
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c]"
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

  return (
    <main className="min-h-screen bg-[#f7f6f3] flex">

      {/* SIDEBAR */}
      <aside className="w-56 bg-[#1a3d2b] min-h-screen flex flex-col fixed top-0 left-0 bottom-0">
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
          {[
            {id:'dashboard', icon:'📊', label:'Dashboard'},
            {id:'registrations', icon:'📋', label:'Registrations', count:pending.length},
            {id:'farms', icon:'🌾', label:'Active Farms'},
            {id:'bookings', icon:'📅', label:'Bookings'},
            {id:'payouts', icon:'💰', label:'Payouts'},
          ].map(item => (
            <button key={item.id}
              onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                page === item.id ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}>
              <span>{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.count ? (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{item.count}</span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={() => setAuthed(false)}
            className="w-full text-white/40 hover:text-white text-xs py-2 transition">
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
            <span className="text-sm text-gray-400">{new Date().toLocaleDateString('en-KE', {weekday:'long', year:'numeric', month:'long', day:'numeric'})}</span>
            <a href="/" target="_blank" className="text-sm border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-900 transition">
              🌐 View Site
            </a>
          </div>
        </div>

        {/* DASHBOARD */}
        {page === 'dashboard' && (
          <div>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                {label:'Active Farms', value:approved.length, icon:'🌾', color:'text-green-700'},
                {label:'Pending Approval', value:pending.length, icon:'⏳', color:'text-red-600'},
                {label:'Total Bookings', value:bookings.length, icon:'📅', color:'text-blue-600'},
                {label:'Total Farms', value:farms.length, icon:'📊', color:'text-gray-700'},
              ].map((k,i) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="text-2xl mb-2">{k.icon}</div>
                  <div className={`text-3xl font-bold mb-1 ${k.color}`}>{k.value}</div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">{k.label}</div>
                </div>
              ))}
            </div>

            {/* PENDING FARMS */}
            {pending.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-100 mb-6">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h2 className="font-bold text-gray-900">🔔 Farms Awaiting Approval</h2>
                </div>
                <div className="divide-y divide-gray-50">
                  {pending.map(farm => (
                    <div key={farm.id} className="px-6 py-4 flex items-center justify-between">
                      <div>
                        <div className="font-semibold text-gray-900">{farm.name}</div>
                        <div className="text-sm text-gray-400">{farm.type} · {farm.county} · Visit: {farm.visit_date}</div>
                        <div className="text-sm text-gray-400">📞 {farm.host_phone} · ✉️ {farm.host_email}</div>
                      </div>
                      <div className="flex gap-2">
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
          </div>
        )}

        {/* REGISTRATIONS */}
        {page === 'registrations' && (
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Farm Registrations</h2>
              <button onClick={fetchFarms} className="text-sm text-[#2d6a4f] hover:underline">↻ Refresh</button>
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
                        {farm.status === 'pending' && (
                          <div className="flex gap-2">
                            <button onClick={() => approveFarm(farm.id)}
                              className="bg-green-50 text-green-700 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-green-700 hover:text-white transition">
                              ✓
                            </button>
                            <button onClick={() => rejectFarm(farm.id)}
                              className="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-xs font-semibold hover:bg-red-600 hover:text-white transition">
                              ✗
                            </button>
                            <a href={`https://wa.me/${farm.host_phone?.replace(/\s/g,'').replace(/^0/,'254')}`}
                              target="_blank"
                              className="bg-[#f0faf2] text-[#2d6a4f] px-2 py-1 rounded-lg text-xs font-semibold hover:bg-[#2d6a4f] hover:text-white transition">
                              💬
                            </a>
                          </div>
                        )}
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
                <p>No approved farms yet. Approve registrations to see them here.</p>
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
                      <td className="px-6 py-4 text-sm text-gray-800">{farm.mpesa_number}</td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {farm.open_days?.join(' · ')}
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
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">All Bookings ({bookings.length})</h2>
              <button onClick={fetchBookings} className="text-sm text-[#2d6a4f] hover:underline">↻ Refresh</button>
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
                    <th className="px-6 py-3 text-left">Amount</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-sm text-gray-900">{b.visitor_name}</div>
                        <div className="text-xs text-gray-400">{b.visitor_phone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-800">{b.farms?.name || '—'}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{b.visit_date}</td>
                      <td className="px-6 py-4 text-sm text-gray-800">{b.guests}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#2d6a4f]">
                        KES {b.total_amount?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-blue-50 text-blue-600 text-xs font-bold px-2 py-1 rounded-full">
                          {b.status}
                        </span>
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
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Payouts</h2>
              <p className="text-sm text-gray-400 mt-1">Track what you owe farms after taking your 10% commission</p>
            </div>
            {bookings.length === 0 ? (
              <div className="p-10 text-center text-gray-400">
                <div className="text-4xl mb-3">💰</div>
                <p>No payouts yet</p>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 text-xs text-gray-400 uppercase tracking-wider">
                    <th className="px-6 py-3 text-left">Booking</th>
                    <th className="px-6 py-3 text-left">Total Collected</th>
                    <th className="px-6 py-3 text-left">Your 10%</th>
                    <th className="px-6 py-3 text-left">Farm Share (90%)</th>
                    <th className="px-6 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-800">{b.visitor_name}</td>
                      <td className="px-6 py-4 text-sm font-semibold">KES {b.total_amount?.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#2d6a4f]">
                        KES {Math.round(b.total_amount * 0.1)?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-orange-600">
                        KES {Math.round(b.total_amount * 0.9)?.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          b.payout_status === 'paid'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {b.payout_status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                        </span>
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
