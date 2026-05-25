'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

const DEMO_FARMS: Record<string, {password: string}> = {
  'kirinyaga coffee estate': { password: 'coffee2025' },
  'limuru green valley farm': { password: 'dairy2025' },
  'thika organic gardens': { password: 'organic2025' },
  'mwende farm': { password: 'mwende2025' },
  'big farm': { password: 'bigfarm2025' },
  'davi farm': { password: 'davifarm2025' },
  'kiganjo': { password: 'kiganjo2025' },
}

export default function FarmDashboard() {
  const [authed, setAuthed] = useState(false)
  const [farmName, setFarmName] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [page, setPage] = useState('overview')
  const [farm, setFarm] = useState<any>(null)
  const [bookings, setBookings] = useState<any[]>([])
  const [photos, setPhotos] = useState<string[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [editForm, setEditForm] = useState<any>({})
  const [eventForm, setEventForm] = useState({
    title: '', description: '', event_date: '',
    event_time: 'Full Day', price: '', max_attendees: '',
    event_type: 'Festival', poster_url: ''
  })
  const [events, setEvents] = useState<any[]>([])
  const [showEventForm, setShowEventForm] = useState(false)

  async function doLogin() {
    const key = farmName.toLowerCase().trim()
    const match = DEMO_FARMS[key]
    if (match && match.password === password) {
      const { data } = await supabase
        .from('farms')
        .select('*')
        .ilike('name', farmName.trim())
        .single()
      if (data) {
        setFarm(data)
        setEditForm(data)
        fetchBookings(data.id)
        fetchEvents(data.id)
      } else {
        setFarm({ name: farmName, type: 'Farm', county: 'Kenya', status: 'approved', price_per_person: 3500, avg_rating: 4.9 })
        setEditForm({ name: farmName, type: 'Farm', county: 'Kenya', price_per_person: 3500 })
      }
      setAuthed(true)
      setError(false)
    } else {
      setError(true)
    }
  }

  async function fetchBookings(farmId: string) {
    const { data } = await supabase.from('bookings').select('*').eq('farm_id', farmId)
    if (data) setBookings(data)
  }

  async function fetchEvents(farmId: string) {
    const { data } = await supabase.from('events').select('*').eq('farm_id', farmId)
    if (data) setEvents(data)
  }

  async function saveChanges() {
    setSaving(true)
    if (farm?.id) {
      await supabase.from('farms').update({
        ...editForm, status: 'pending'
      }).eq('id', farm.id)
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  async function submitEvent() {
    if (!eventForm.title || !eventForm.event_date || !eventForm.price) {
      alert('Please fill in event name, date, and price.')
      return
    }
    if (farm?.id) {
      await supabase.from('events').insert([{
        farm_id: farm.id,
        title: eventForm.title,
        description: eventForm.description,
        event_date: eventForm.event_date,
        event_time: eventForm.event_time,
        price: Number(eventForm.price),
        max_attendees: Number(eventForm.max_attendees),
        event_type: eventForm.event_type,
        poster_url: eventForm.poster_url,
        status: 'pending'
      }])
      fetchEvents(farm.id)
    }
    setShowEventForm(false)
    setEventForm({ title:'', description:'', event_date:'', event_time:'Full Day', price:'', max_attendees:'', event_type:'Festival', poster_url:'' })
    alert('✅ Event submitted for AgroPro Safaris approval!')
  }

  const totalEarned = bookings.reduce((sum, b) => sum + ((b.total_amount || 0) * 0.9), 0)

  const navItems = [
    { id: 'overview', icon: '📊', label: 'Overview' },
    { id: 'listing', icon: '🌾', label: 'My Listing' },
    { id: 'photos', icon: '📷', label: 'Photos' },
    { id: 'availability', icon: '📅', label: 'Open Days' },
    { id: 'events', icon: '🎪', label: 'Events' },
    { id: 'bookings', icon: '📋', label: 'Bookings' },
    { id: 'earnings', icon: '💰', label: 'Earnings' },
  ]

  if (!authed) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a3d2b] to-[#2d6a4f] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-10 max-w-sm w-full shadow-xl">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#1a3d2b] rounded-xl flex items-center justify-center text-3xl mx-auto mb-3">🌿</div>
            <h1 className="text-xl font-bold text-gray-900">Farm Portal</h1>
            <p className="text-gray-400 text-sm">AgroPro Safaris</p>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-2 rounded-xl mb-4 text-center">
              Incorrect farm name or password
            </div>
          )}
          <div className="space-y-3 mb-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Farm Name</label>
              <input value={farmName} onChange={e => setFarmName(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c] text-gray-900"
                placeholder="e.g. Kirinyaga Coffee Estate"/>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doLogin()}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c] text-gray-900"
                placeholder="Your password"/>
            </div>
          </div>
          <button onClick={doLogin}
            className="w-full bg-[#1a3d2b] text-white py-3 rounded-xl font-semibold hover:bg-[#2d6a4f] transition">
            Sign In →
          </button>
          <p className="text-xs text-gray-400 text-center mt-4">
            Need help? <a href="https://wa.me/254710701013" className="text-[#2d6a4f] font-semibold">WhatsApp us</a>
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f6f3] flex">

      {/* SIDEBAR - desktop only */}
      <aside className="w-56 bg-[#1a3d2b] min-h-screen flex-col fixed top-0 left-0 bottom-0 hidden md:flex">
        <div className="p-5 border-b border-white/10">
          <div className="text-white font-bold text-sm">{farm?.name}</div>
          <div className="text-white/40 text-xs mt-1">Farm Dashboard</div>
          <div className={`mt-2 text-xs font-bold px-2 py-0.5 rounded-full inline-block ${
            farm?.status === 'approved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
          }`}>
            {farm?.status === 'approved' ? '✓ Live' : '⏳ Pending'}
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition ${
                page === item.id ? 'bg-white/15 text-white' : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10 space-y-2">
          <a href="https://wa.me/254710701013" target="_blank"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-white/40 hover:text-white transition">
            💬 WhatsApp Support
          </a>
          <button onClick={() => setAuthed(false)}
            className="w-full text-white/40 hover:text-white text-xs py-2 transition text-left px-3">
            Sign out
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div className="md:ml-56 flex-1 flex flex-col min-h-screen">

        {/* TOPBAR */}
        <div className="bg-white border-b border-gray-100 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
          <div>
            <div className="text-base font-bold text-gray-900 capitalize">{page}</div>
            <div className="text-xs text-gray-400 hidden md:block">{farm?.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" target="_blank" className="text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500 hover:text-gray-900 transition">
              🌐 View listing
            </a>
            <button onClick={() => setAuthed(false)} className="md:hidden text-xs border border-gray-200 px-3 py-1.5 rounded-lg text-gray-500">
              Sign out
            </button>
          </div>
        </div>

        {/* MOBILE NAV */}
        <div className="md:hidden bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto">
          {navItems.map(item => (
            <button key={item.id} onClick={() => setPage(item.id)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                page === item.id ? 'bg-[#2d6a4f] text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              {item.icon} {item.label}
            </button>
          ))}
        </div>

        <div className="p-4 md:p-8 flex-1">

          {/* OVERVIEW */}
          {page === 'overview' && (
            <div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Bookings', value: bookings.length, icon: '📅', color: 'text-blue-600' },
                  { label: 'Earned (KES)', value: Math.round(totalEarned).toLocaleString(), icon: '💰', color: 'text-green-700' },
                  { label: 'Rating', value: farm?.avg_rating || '—', icon: '⭐', color: 'text-yellow-600' },
                  { label: 'Status', value: farm?.status === 'approved' ? 'Live' : 'Pending', icon: '🌐', color: farm?.status === 'approved' ? 'text-green-700' : 'text-yellow-600' },
                ].map((k, i) => (
                  <div key={i} className="bg-white rounded-xl p-4 border border-gray-100">
                    <div className="text-xl mb-1">{k.icon}</div>
                    <div className={`text-xl font-bold mb-1 ${k.color}`}>{k.value}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">{k.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
                <h2 className="font-bold text-gray-900 mb-3">Recent Bookings</h2>
                {bookings.length === 0 ? (
                  <div className="text-center py-6 text-gray-400 text-sm">No bookings yet</div>
                ) : (
                  <div className="space-y-2">
                    {bookings.slice(0,3).map(b => (
                      <div key={b.id} className="flex items-center justify-between py-2 border-b border-gray-50">
                        <div className="text-sm text-gray-600">{b.visit_date} · {b.guests} guests</div>
                        <div className="text-sm font-semibold text-[#2d6a4f]">KES {b.total_amount?.toLocaleString()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-[#1a3d2b] rounded-xl p-5 text-center">
                <p className="text-white font-semibold mb-3">Need help?</p>
                <a href="https://wa.me/254710701013" target="_blank"
                  className="bg-[#25d366] text-white px-5 py-2 rounded-full text-sm font-semibold inline-block">
                  💬 WhatsApp AgroPro Safaris
                </a>
              </div>
            </div>
          )}

          {/* MY LISTING */}
          {page === 'listing' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-bold text-gray-900">My Listing</h1>
                <div className="flex items-center gap-2">
                  {saved && <span className="text-green-600 text-xs font-semibold">✓ Submitted</span>}
                  <button onClick={saveChanges} disabled={saving}
                    className="bg-[#2d6a4f] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#40916c] transition disabled:opacity-50">
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-800 mb-4">
                ⏳ Changes need AgroPro Safaris approval before going live.
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Farm Name</label>
                    <input value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#40916c] text-gray-900"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Farm Type</label>
                    <input value={editForm.type || ''} onChange={e => setEditForm({...editForm, type: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#40916c] text-gray-900"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">County</label>
                    <input value={editForm.county || ''} onChange={e => setEditForm({...editForm, county: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#40916c] text-gray-900"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Price Per Person (KES)</label>
                    <input type="number" value={editForm.price_per_person || ''} onChange={e => setEditForm({...editForm, price_per_person: e.target.value})}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#40916c] text-gray-900"/>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Location</label>
                  <input value={editForm.location || ''} onChange={e => setEditForm({...editForm, location: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#40916c] text-gray-900"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Description</label>
                  <textarea value={editForm.description || ''} onChange={e => setEditForm({...editForm, description: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#40916c] resize-none h-24 text-gray-900"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">M-Pesa Number for Payouts</label>
                  <input value={editForm.mpesa_number || ''} onChange={e => setEditForm({...editForm, mpesa_number: e.target.value})}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#40916c] text-gray-900"
                    placeholder="e.g. 0712 345 678"/>
                </div>
              </div>
            </div>
          )}

          {/* PHOTOS */}
          {page === 'photos' && (
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-4">Farm Photos</h1>
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-sm text-yellow-800 mb-4">
                  ⏳ Photos reviewed by AgroPro Safaris before appearing on listing. Max 5 photos.
                </div>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                  {photos.map((photo, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden border border-gray-200 relative">
                      <img src={photo} className="w-full h-full object-cover"/>
                      <button onClick={() => setPhotos(photos.filter((_,j) => j !== i))}
                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
                    </div>
                  ))}
                  {photos.length < 5 && (
                    <label className="aspect-square rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#40916c] hover:bg-[#f0faf2] transition">
                      <span className="text-2xl text-gray-300 mb-1">+</span>
                      <span className="text-xs text-gray-400">Add photo</span>
                      <input type="file" accept="image/*" className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          const reader = new FileReader()
                          reader.onload = ev => setPhotos([...photos, ev.target?.result as string])
                          reader.readAsDataURL(file)
                        }}/>
                    </label>
                  )}
                </div>
                <p className="text-xs text-gray-400">{photos.length}/5 photos · Each reviewed within 24 hours</p>
              </div>
            </div>
          )}

          {/* OPEN DAYS */}
          {page === 'availability' && (
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-4">Open Days</h1>
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Public Holidays'].map(day => {
                    const isOpen = editForm.open_days?.includes(day)
                    return (
                      <button key={day} type="button"
                        onClick={() => {
                          const days = editForm.open_days || []
                          setEditForm({...editForm, open_days: isOpen ? days.filter((d:string) => d !== day) : [...days, day]})
                        }}
                        className={`px-4 py-2.5 rounded-xl text-sm border transition font-medium ${
                          isOpen ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]' : 'bg-white text-gray-600 border-gray-200'
                        }`}>
                        {day}
                      </button>
                    )
                  })}
                </div>
                <button onClick={saveChanges}
                  className="bg-[#2d6a4f] text-white px-6 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#40916c] transition">
                  Save Open Days
                </button>
              </div>
            </div>
          )}

          {/* EVENTS */}
          {page === 'events' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-lg font-bold text-gray-900">Events</h1>
                <button onClick={() => setShowEventForm(true)}
                  className="bg-[#2d6a4f] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#40916c] transition">
                  + Create Event
                </button>
              </div>

              {showEventForm && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <div className="bg-white rounded-2xl p-5 max-w-md w-full max-h-[90vh] overflow-y-auto">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="font-bold text-gray-900">Create Event</h2>
                      <button onClick={() => setShowEventForm(false)} className="text-gray-400 hover:text-gray-600">✕</button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Event Name *</label>
                        <input value={eventForm.title} onChange={e => setEventForm({...eventForm, title: e.target.value})}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#40916c] text-gray-900"
                          placeholder="e.g. Coffee Harvest Festival"/>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Date *</label>
                          <input type="date" value={eventForm.event_date} onChange={e => setEventForm({...eventForm, event_date: e.target.value})}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#40916c] text-gray-900"/>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Time</label>
                          <select value={eventForm.event_time} onChange={e => setEventForm({...eventForm, event_time: e.target.value})}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#40916c] bg-white text-gray-900">
                            <option>Full Day</option>
                            <option>Morning</option>
                            <option>Midday</option>
                            <option>Afternoon</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Description</label>
                        <textarea value={eventForm.description} onChange={e => setEventForm({...eventForm, description: e.target.value})}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#40916c] resize-none h-20 text-gray-900"
                          placeholder="What will visitors experience?"/>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Price (KES) *</label>
                          <input type="number" value={eventForm.price} onChange={e => setEventForm({...eventForm, price: e.target.value})}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#40916c] text-gray-900"
                            placeholder="0 for free"/>
                        </div>
                        <div>
                          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Max Attendees</label>
                          <input type="number" value={eventForm.max_attendees} onChange={e => setEventForm({...eventForm, max_attendees: e.target.value})}
                            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#40916c] text-gray-900"
                            placeholder="e.g. 30"/>
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Event Type</label>
                        <select value={eventForm.event_type} onChange={e => setEventForm({...eventForm, event_type: e.target.value})}
                          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-[#40916c] bg-white text-gray-900">
                          <option>Festival</option>
                          <option>Workshop</option>
                          <option>Harvest</option>
                          <option>Family Day</option>
                          <option>School Program</option>
                          <option>Corporate</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Event Poster</label>
                        {eventForm.poster_url ? (
                          <div className="relative">
                            <img src={eventForm.poster_url} className="w-full h-36 object-cover rounded-xl border border-gray-200"/>
                            <button onClick={() => setEventForm({...eventForm, poster_url: ''})}
                              className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">✕</button>
                          </div>
                        ) : (
                          <label className="w-full h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#40916c] hover:bg-[#f0faf2] transition">
                            <span className="text-2xl mb-1">🖼️</span>
                            <span className="text-xs text-gray-400">Click to upload poster</span>
                            <span className="text-xs text-gray-300 mt-1">JPG, PNG — max 5MB</span>
                            <input type="file" accept="image/*" className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return }
                                const fileName = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
                                const { error } = await supabase.storage.from('event-poster').upload(fileName, file)
                                if (error) { alert('Upload failed: ' + error.message); return }
                                const { data: urlData } = supabase.storage.from('event-poster').getPublicUrl(fileName)
                                setEventForm({...eventForm, poster_url: urlData.publicUrl})
                              }}/>
                          </label>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-3 mt-5">
                      <button onClick={() => setShowEventForm(false)}
                        className="flex-1 border border-gray-200 text-gray-500 py-2.5 rounded-xl text-sm font-semibold">
                        Cancel
                      </button>
                      <button onClick={submitEvent}
                        className="flex-1 bg-[#e9a825] text-white py-2.5 rounded-xl text-sm font-semibold">
                        Submit for Approval
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {events.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 p-10 text-center text-gray-400">
                  <div className="text-4xl mb-3">🎪</div>
                  <p className="text-sm mb-2">No events yet</p>
                  <p className="text-xs">Events appear on your public listing after approval</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {events.map(event => (
                    <div key={event.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                      {event.poster_url && (
                        <img src={event.poster_url} className="w-full h-36 object-cover"/>
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-gray-900">{event.title}</h3>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            event.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {event.status === 'approved' ? '✓ Live' : '⏳ Pending'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">📅 {event.event_date} · {event.event_time}</p>
                        <p className="text-xs text-gray-500">{event.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-bold text-[#2d6a4f] text-sm">
                            {event.price === 0 ? 'FREE' : `KES ${event.price?.toLocaleString()}`}
                          </span>
                          <span className="text-xs text-gray-400">Max {event.max_attendees}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* BOOKINGS */}
          {page === 'bookings' && (
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-4">Bookings</h1>
              <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
                {bookings.length === 0 ? (
                  <div className="p-10 text-center text-gray-400">
                    <div className="text-4xl mb-3">📅</div>
                    <p>No bookings yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-50">
                    {bookings.map(b => (
                      <div key={b.id} className="p-4 flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-gray-900">{b.visit_date}</div>
                          <div className="text-xs text-gray-400">{b.guests} guests</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#2d6a4f]">KES {Math.round((b.total_amount||0)*0.9).toLocaleString()}</div>
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            b.payout_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {b.payout_status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EARNINGS */}
          {page === 'earnings' && (
            <div>
              <h1 className="text-lg font-bold text-gray-900 mb-4">Earnings & Payouts</h1>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {[
                  { label: 'Total Collected', value: `KES ${bookings.reduce((s,b) => s + (b.total_amount||0), 0).toLocaleString()}`, color: 'text-gray-900' },
                  { label: 'Your Earnings (90%)', value: `KES ${Math.round(bookings.reduce((s,b) => s + (b.total_amount||0)*0.9, 0)).toLocaleString()}`, color: 'text-green-700' },
                  { label: 'AgroPro Commission', value: `KES ${Math.round(bookings.reduce((s,b) => s + (b.total_amount||0)*0.1, 0)).toLocaleString()}`, color: 'text-gray-500' },
                ].map((k,i) => (
                  <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                    <div className={`text-2xl font-bold mb-1 ${k.color}`}>{k.value}</div>
                    <div className="text-xs text-gray-400 uppercase tracking-wider">{k.label}</div>
                  </div>
                ))}
              </div>
              <div className="bg-[#1a3d2b] rounded-xl p-6 text-center">
                <h2 className="text-white font-bold mb-2">Request a Payout</h2>
                <p className="text-white/60 text-sm mb-4">
                  AgroPro Safaris pays 50% before each visit and 50% after. Request your available balance anytime.
                </p>
                <a href="https://wa.me/254710701013?text=Hi! I would like to request a payout for my farm."
                  target="_blank"
                  className="bg-[#25d366] text-white px-6 py-2.5 rounded-full text-sm font-semibold inline-block hover:bg-[#20bd5a] transition">
                  💬 Request Payout via WhatsApp
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}