'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

export default function HomePage() {
  const [farmCount, setFarmCount] = useState(0)
  const [bookingCount, setBookingCount] = useState(0)

  useEffect(() => {
    fetchStats()
  }, [])

  async function fetchStats() {
    const { count: farms } = await supabase
      .from('farms')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')
    const { count: bookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
    if (farms) setFarmCount(farms)
    if (bookings) setBookingCount(bookings)
  }

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <nav className="bg-[#1a3d2b] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#40916c] rounded-lg flex items-center justify-center text-xl">🌿</div>
          <span className="font-bold text-white text-lg">AgroPro Safaris</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/farms" className="text-white/80 hover:text-white text-sm">Explore Farms</Link>
          <Link href="/register-farm" className="bg-[#e9a825] text-white px-4 py-2 rounded-full text-sm font-semibold">Register Farm</Link>
        </div>
      </nav>

      <section className="min-h-screen bg-gradient-to-br from-[#1a3d2b] to-[#2d6a4f] flex items-center justify-center text-center px-6">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-sm px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-[#e9a825] animate-pulse"></span>
            Now live in Kenya
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover Kenya&apos;s
            <br/>
            <span className="text-[#e9a825]">Hidden Farm Gems</span>
          </h1>
          <p className="text-white/70 text-lg mb-10 max-w-xl mx-auto">
            Book authentic farm experiences, stays, and agrotourism adventures across Kenya.
          </p>
          <div className="bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2 max-w-2xl mx-auto shadow-xl mb-12">
            <input className="flex-1 px-4 py-3 text-sm outline-none text-gray-700 rounded-xl" placeholder="Where? e.g. Kiambu, Nakuru..."/>
            <select className="flex-1 px-4 py-3 text-sm outline-none text-gray-500 rounded-xl bg-white border border-gray-100 text-gray-900">
              <option>Any farm type</option>
              <option>Coffee Farm</option>
              <option>Tea Farm</option>
              <option>Dairy Farm</option>
              <option>Organic Farm</option>
              <option>Beekeeping</option>
            </select>
            <Link href="/farms" className="bg-[#2d6a4f] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#40916c] transition text-center">
              Search
            </Link>
          </div>

          {/* DYNAMIC STATS */}
          <div className="flex items-center justify-center gap-12 flex-wrap">
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{farmCount}</div>
              <div className="text-white/50 text-xs uppercase tracking-wider mt-1">Verified Farms</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">{bookingCount}</div>
              <div className="text-white/50 text-xs uppercase tracking-wider mt-1">Bookings Made</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-white">Kenya</div>
              <div className="text-white/50 text-xs uppercase tracking-wider mt-1">First Market</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-[#40916c] text-xs font-bold uppercase tracking-widest">Featured farms</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-12">Verified Farm Experiences</h2>
          <FeaturedFarms />
          <div className="mt-10">
            <Link href="/farms" className="border-2 border-[#2d6a4f] text-[#2d6a4f] px-8 py-3 rounded-full font-semibold hover:bg-[#2d6a4f] hover:text-white transition inline-block">
              View All Farms
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#1a3d2b] text-center">
        <div className="max-w-4xl mx-auto">
          <span className="text-[#e9a825] text-xs font-bold uppercase tracking-widest">Simple process</span>
          <h2 className="text-4xl font-bold text-white mt-2 mb-12">How AgroPro Safaris Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { num:'1', title:'Discover a Farm', desc:'Browse verified farms across Kenya filtered by type, location and price.' },
              { num:'2', title:'Book & Pay', desc:'Choose your dates, select activities, and pay securely via M-Pesa or card.' },
              { num:'3', title:'Experience', desc:'Arrive at a verified quality-checked farm and enjoy authentic rural Kenya.' },
              { num:'4', title:'Share Your Story', desc:'Leave a review and help other visitors discover the best farms.' },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="w-10 h-10 rounded-full bg-[#e9a825] flex items-center justify-center font-bold text-white mx-auto mb-4">{s.num}</div>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-white/50 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#fffbeb] text-center">
        <div className="max-w-2xl mx-auto">
          <span className="text-[#40916c] text-xs font-bold uppercase tracking-widest">For farm owners</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Turn Your Farm Into a Destination</h2>
          <p className="text-gray-500 mb-8">Join Kenya&apos;s first agrotourism marketplace. Free 2-month trial.</p>
          <div className="flex justify-center flex-wrap gap-4 mb-8 text-sm text-gray-600">
            <span>✅ Free 2-month trial</span>
            <span>💰 Only $5/month after</span>
            <span>🤝 We visit &amp; verify you</span>
            <span>📱 Your own dashboard</span>
          </div>
          <Link href="/register-farm" className="bg-[#2d6a4f] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#40916c] transition inline-block">
            Register My Farm
          </Link>
        </div>
      </section>

      <footer className="bg-[#0f2419] text-white/40 py-12 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-[#40916c] rounded-lg flex items-center justify-center">🌿</div>
              <span className="font-bold text-white">AgroPro Safaris</span>
            </div>
            <p className="text-sm">Kenya&apos;s first verified agrotourism marketplace.</p>
            <div className="flex gap-3 mt-4">
              {['📘','📸','🐦'].map((s,i) => (
                <a key={i} href="#" className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition">{s}</a>
              ))}
            </div>
          </div>
          {[
            { title:'Explore', links:['All Farms','Coffee Farms','Dairy Farms','Farm Stays'] },
            { title:'Farm Owners', links:['Register Farm','How It Works','Pricing','Dashboard'] },
            { title:'Contact', links:['agroprosafaris@gmail.com','0710 701 013','WhatsApp Us','About Us'] },
          ].map((col, i) => (
            <div key={i}>
              <h4 className="text-white font-semibold text-sm mb-3 uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((l, j) => <li key={j}><a href="#" className="text-sm hover:text-white transition">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-xs">
          © 2025 AgroPro Safaris. Made with ❤️ in Kenya.
        </div>
      </footer>
    </main>
  )
}

function FeaturedFarms() {
  const [farms, setFarms] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from('farms')
      .select('*')
      .eq('status', 'approved')
      .limit(3)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setFarms(data) })
  }, [])

  const emojis: Record<string, string> = {
    Coffee:'☕', Tea:'🍵', Dairy:'🐄', Organic:'🥬',
    Avocado:'🥑', Beekeeping:'🐝', Poultry:'🐔', Fish:'🐟',
    Hydroponic:'💧', 'Eco Lodge':'🏡', Educational:'📚', Mixed:'🌾'
  }

  if (farms.length === 0) return (
    <div className="text-gray-400 py-10">Loading farms...</div>
  )

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {farms.map(farm => {
        const slug = farm.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        const emoji = emojis[farm.type] || '🌾'
        return (
          <Link href={`/farms/${slug}`} key={farm.id}
            className="bg-[#faf8f4] rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition text-left">
            <div className="h-48 bg-gradient-to-br from-[#2d6a4f] to-[#52b788] flex items-center justify-center text-6xl">
              {emoji}
            </div>
            <div className="p-5">
              <div className="text-xs text-gray-400 mb-1">📍 {farm.county}</div>
              <h3 className="font-bold text-gray-900 text-lg mb-1">{farm.name}</h3>
              <div className="text-xs text-gray-400 mb-3">{farm.type} Farm</div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="text-sm">⭐ <strong>{farm.avg_rating || '—'}</strong></div>
                <div className="font-bold text-[#2d6a4f]">KES {farm.price_per_person?.toLocaleString()}<span className="text-xs text-gray-400 font-normal ml-1">/ person</span></div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}