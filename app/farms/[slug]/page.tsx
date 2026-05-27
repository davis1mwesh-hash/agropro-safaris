'use client'
import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const emojis: Record<string, string> = {
  Coffee:'☕', Tea:'🍵', Dairy:'🐄', Organic:'🥬',
  Avocado:'🥑', Beekeeping:'🐝', Poultry:'🐔', Fish:'🐟',
  Hydroponic:'💧', 'Eco Lodge':'🏡', Educational:'📚', Mixed:'🌾'
}

export default function FarmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [farm, setFarm] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [guests, setGuests] = useState(1)
  const [date, setVisitDate] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [booked, setBooked] = useState(false)
  const [events, setEvents] = useState<any[]>([])

  useEffect(() => { fetchFarm() }, [slug])

  async function fetchFarm() {
    const { data } = await supabase
      .from('farms')
      .select('*')
      .eq('status', 'approved')
    if (data) {
      const found = data.find(f => {
        const farmSlug = f.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        return farmSlug === slug
      })
      setFarm(found || null)
      if (found) fetchEvents(found.id)
    }
    setLoading(false)
  }

  async function fetchEvents(farmId: string) {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('farm_id', farmId)
      .eq('status', 'approved')
      .order('event_date', { ascending: true })
    if (data) setEvents(data)
  }

  const total = farm ? farm.price_per_person * guests : 0
  const yourShare = Math.round(total * 0.9)

  async function handleBook() {
    if (!name || !phone || !date) {
      alert('Please fill in your name, phone, and visit date.')
      return
    }
    await supabase.from('bookings').insert([{
      farm_id: farm.id,
      visitor_name: name,
      visitor_phone: phone,
      visitor_email: email,
      visit_date: date,
      guests,
      total_amount: total,
      farm_share: yourShare,
      commission: total - yourShare,
      status: 'pending',
      payout_status: 'unpaid',
    }])
    setBooked(true)
  }

  if (loading) return (
    <main className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
      <div className="text-center text-gray-400">
        <div className="text-5xl mb-4">🌾</div>
        <p>Loading farm...</p>
      </div>
    </main>
  )

  if (!farm) return (
    <main className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl mb-4">🌾</div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Farm not found</h1>
        <Link href="/farms" className="text-[#2d6a4f] font-semibold">← Back to farms</Link>
      </div>
    </main>
  )

  const emoji = emojis[farm.type] || '🌾'

  if (booked) return (
    <main className="min-h-screen bg-[#faf8f4] flex items-center justify-center px-6">
      <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-lg">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking Request Sent!</h2>
        <p className="text-gray-500 mb-6">
          Thank you <strong>{name}</strong>! Your booking for <strong>{farm.name}</strong> on <strong>{date}</strong> for <strong>{guests} guest{guests > 1 ? 's' : ''}</strong> has been received.
          <br/><br/>
          AgroPro Safaris will contact you on <strong>{phone}</strong> within 24 hours.
        </p>
        <div className="bg-[#f0faf2] rounded-xl p-4 mb-6 text-left text-gray-900">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Total</span>
            <span className="font-bold">KES {total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Contact</span>
            <span className="font-bold">{phone}</span>
          </div>
        </div>
        <a href={`https://wa.me/254710701013?text=Hi! I booked ${farm.name} for ${date}. My name is ${name}.`}
          target="_blank"
          className="bg-[#25d366] text-white px-6 py-3 rounded-full font-semibold inline-block mb-4 hover:bg-[#20bd5a] transition w-full">
          💬 WhatsApp Us to Confirm
        </a>
        <Link href="/farms" className="text-[#2d6a4f] text-sm font-semibold block">← Explore more farms</Link>
      </div>
    </main>
  )

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <nav className="bg-[#1a3d2b] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#40916c] rounded-lg flex items-center justify-center text-xl">🌿</div>
          <span className="font-bold text-white text-lg">AgroPro Safaris</span>
        </Link>
        <Link href="/farms" className="text-white/70 hover:text-white text-sm">← Back to farms</Link>
      </nav>

      <div className="h-72 md:h-80 bg-gradient-to-br from-[#1a3d2b] to-[#52b788] flex items-center justify-center text-9xl relative">
        {emoji}
        <div className="absolute bottom-4 left-6 flex gap-2">
          <span className="bg-white text-[#2d6a4f] text-xs font-bold px-3 py-1 rounded-full">{farm.type} Farm</span>
          <span className="bg-[#e9a825] text-white text-xs font-bold px-3 py-1 rounded-full">✓ Verified</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{farm.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              <span>📍 {farm.location || farm.county}</span>
              <span>⭐ {farm.avg_rating || '—'} ({farm.total_reviews || 0} reviews)</span>
              <span>👥 Up to {farm.max_visitors} visitors</span>
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">About this farm</h2>
            <p className="text-gray-600 leading-relaxed">{farm.description}</p>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Open days</h2>
            <div className="flex gap-2 flex-wrap">
              {farm.open_days?.map((day: string) => (
                <span key={day} className="bg-[#2d6a4f] text-white px-4 py-2 rounded-full text-sm font-semibold">{day}</span>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Accommodation</h2>
            <p className="text-gray-600">{farm.accommodation || 'Contact us for details'}</p>
          </div>

          {events.length > 0 && (
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-4">🎪 Upcoming Events</h2>
              <div className="space-y-4">
                {events.map(event => (
                  <div key={event.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-md transition">
                    {event.poster_url && (
                      <img src={event.poster_url} alt={event.title}
                        className="w-full h-48 object-cover"/>
                    )}
                    {!event.poster_url && (
                      <div className="w-full h-24 bg-gradient-to-br from-[#1a3d2b] to-[#52b788] flex items-center justify-center text-4xl">
                        🎪
                      </div>
                    )}
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-bold text-gray-900 text-lg">{event.title}</h3>
                        <span className="bg-[#e9a825] text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
                          {event.price === 0 ? 'FREE' : `KES ${event.price?.toLocaleString()}`}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <span>📅 {event.event_date}</span>
                        <span>🕐 {event.event_time}</span>
                        <span>👥 Max {event.max_attendees}</span>
                      </div>
                      <p className="text-sm text-gray-500 mb-4">{event.description}</p>
                      <a href={`https://wa.me/254710701013?text=Hi! I'm interested in the ${event.title} event at ${farm.name} on ${event.event_date}.`}
                        target="_blank"
                        className="w-full bg-[#2d6a4f] text-white py-2.5 rounded-xl font-semibold hover:bg-[#40916c] transition text-sm text-center block">
                        Book This Event
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md sticky top-6">
            <div className="text-2xl font-bold text-[#2d6a4f] mb-1">
              KES {farm.price_per_person?.toLocaleString()}
              <span className="text-sm font-normal text-gray-400 ml-1">/ person</span>
            </div>
            <div className="text-sm text-gray-500 mb-5">⭐ {farm.avg_rating || '—'} · {farm.total_reviews || 0} reviews</div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Your Name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#40916c] text-gray-900"
                  placeholder="Full name"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#40916c] text-gray-900"
                  placeholder="07XX XXX XXX"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#40916c] text-gray-900"
                  placeholder="you@email.com"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Visit Date</label>
                <input type="date" value={date} onChange={e => setVisitDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#40916c] text-gray-900"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Guests</label>
                <select value={guests} onChange={e => setGuests(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#40916c] bg-white text-gray-900">
                  {[1,2,3,4,5,6,7,8,9,10,15,20].map(n => (
                    <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">KES {farm.price_per_person?.toLocaleString()} × {guests}</span>
                <span className="font-semibold text-gray-900">KES {total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Platform fee (10%)</span>
                <span>Included</span>
              </div>
            </div>
            <button onClick={handleBook}
              className="w-full bg-[#2d6a4f] text-white py-3 rounded-xl font-semibold hover:bg-[#40916c] transition mb-3">
              Request Booking
            </button>
            <p className="text-xs text-gray-400 text-center">Contacted within 24 hours to confirm payment via M-Pesa.</p>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <a href="https://wa.me/254710701013" target="_blank" className="text-sm text-[#25d366] font-semibold">💬 Questions? WhatsApp us</a>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#0f2419] text-white/40 py-8 px-6 text-center text-sm mt-12">
        © 2025 AgroPro Safaris. Made with ❤️ in Kenya.
      </footer>
    </main>
  )
}