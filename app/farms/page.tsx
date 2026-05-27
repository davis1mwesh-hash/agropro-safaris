'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const categories = [
  {icon:'🌿', name:'All'},
  {icon:'☕', name:'Coffee'},
  {icon:'🍵', name:'Tea'},
  {icon:'🐄', name:'Dairy'},
  {icon:'🥬', name:'Organic'},
  {icon:'🥑', name:'Avocado'},
  {icon:'🐝', name:'Beekeeping'},
  {icon:'🐔', name:'Poultry'},
  {icon:'🐟', name:'Fish'},
  {icon:'💧', name:'Hydroponic'},
  {icon:'🏡', name:'Eco Lodge'},
  {icon:'📚', name:'Educational'},
]

const emojis: Record<string, string> = {
  Coffee:'☕', Tea:'🍵', Dairy:'🐄', Organic:'🥬',
  Avocado:'🥑', Beekeeping:'🐝', Poultry:'🐔', Fish:'🐟',
  Hydroponic:'💧', 'Eco Lodge':'🏡', Educational:'📚', Mixed:'🌾'
}

export default function FarmsPage() {
  const [active, setActive] = useState('All')
  const [search, setSearch] = useState('')
  const [farms, setFarms] = useState<any[]>([])
  const [tours, setTours] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { 
    fetchFarms()
    fetchTours()
  }, [])

  async function fetchTours() {
    const { data } = await supabase
      .from('tours')
      .select('*')
      .eq('status', 'active')
      .order('tour_date', { ascending: true })
    if (data) setTours(data)
  }

  async function fetchFarms() {
    const { data } = await supabase
      .from('farms')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
    if (data) setFarms(data)
    setLoading(false)
  }

  const filtered = farms.filter(f => {
    const matchCat = active === 'All' || f.type?.toLowerCase().includes(active.toLowerCase())
    const matchSearch = f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.county?.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <main className="min-h-screen bg-[#faf8f4]">
      <nav className="bg-[#1a3d2b] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#40916c] rounded-lg flex items-center justify-center text-xl">🌿</div>
          <span className="font-bold text-white text-lg">AgroPro Safaris</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/farms" className="text-white text-sm font-semibold border-b-2 border-[#e9a825]">Explore Farms</Link>
          <Link href="/register-farm" className="bg-[#e9a825] text-white px-4 py-2 rounded-full text-sm font-semibold">Register Farm</Link>
        </div>
      </nav>

      <div className="bg-[#1a3d2b] px-6 pb-10 pt-4">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Explore Farms</h1>
          <p className="text-white/60 mb-6">Every farm personally visited and verified by AgroPro Safaris</p>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search by farm name or location..."
            className="w-full max-w-lg px-4 py-3 rounded-xl text-sm outline-none text-gray-700"/>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8">
          {categories.map(c => (
            <button key={c.name} onClick={() => setActive(c.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border transition ${
                active === c.name ? 'bg-[#2d6a4f] text-white border-[#2d6a4f]' : 'bg-white text-gray-600 border-gray-200 hover:border-[#40916c]'
              }`}>
              {c.icon} {c.name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-gray-500"><strong className="text-gray-900">{filtered.length}</strong> farms available</p>
          <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 outline-none bg-white text-gray-900">
            <option>Top rated</option>
            <option>Price: Low to High</option>
            <option>Newest</option>
          </select>
        </div>

        {loading && (
          <div className="text-center py-20 text-gray-400">
            <div className="text-4xl mb-3">🌾</div>
            <p>Loading farms...</p>
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌾</div>
            <p className="text-gray-500">No farms found.</p>
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map(farm => {
              const slug = farm.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
              const emoji = emojis[farm.type] || '🌾'
              return (
                <Link href={`/farms/${slug}`} key={farm.id}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition group">
                  <div className="h-48 bg-gradient-to-br from-[#2d6a4f] to-[#52b788] flex items-center justify-center text-6xl relative">
                    {emoji}
                    <span className="absolute top-3 left-3 bg-white text-[#2d6a4f] text-xs font-bold px-3 py-1 rounded-full">{farm.type} Farm</span>
                  </div>
                  <div className="p-5">
                    <div className="text-xs text-gray-400 mb-1">📍 {farm.county}</div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-[#2d6a4f] transition">{farm.name}</h3>
                    <p className="text-xs text-gray-500 mb-3 line-clamp-2">{farm.description}</p>
                    <div className="text-xs text-[#40916c] font-medium mb-3">✅ Open: {farm.open_days?.join(' · ')}</div>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="text-sm">⭐ <strong>{farm.avg_rating || '—'}</strong> <span className="text-gray-400">({farm.total_reviews || 0})</span></div>
                      <div className="text-right">
                        <div className="font-bold text-[#2d6a4f]">KES {farm.price_per_person?.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">per person</div>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {tours.length > 0 && (
          <div className="mt-16 mb-8">
            <div className="text-center mb-8">
              <span className="text-[#40916c] text-xs font-bold uppercase tracking-widest">Organised by AgroPro Safaris</span>
              <h2 className="text-3xl font-bold text-gray-900 mt-2">Upcoming Farm Tours</h2>
              <p className="text-gray-500 mt-2 text-sm">Curated farm tour experiences across Kenya</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {tours.map(tour => (
                <div key={tour.id} className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition">
                  {tour.poster_url ? (
                    <img src={tour.poster_url} className="w-full h-48 object-cover"/>
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-[#1a3d2b] to-[#52b788] flex items-center justify-center text-6xl">🚜</div>
                  )}
                  <div className="p-5">
                    <div className="text-xs text-[#40916c] font-bold mb-1">📅 {tour.tour_date} · {tour.tour_time}</div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{tour.title}</h3>
                    <div className="text-xs text-gray-400 mb-2">📍 {tour.county}{tour.location ? ` · ${tour.location}` : ''}</div>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">{tour.description}</p>
                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div>
                        <div className="font-bold text-[#2d6a4f]">KES {tour.price?.toLocaleString()}</div>
                        <div className="text-xs text-gray-400">per person · Max {tour.max_participants}</div>
                      </div>
                      <a href={`https://wa.me/254710701013?text=Hi! I want to book the ${tour.title} tour on ${tour.tour_date}.`}
                        target="_blank"
                        className="bg-[#2d6a4f] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#40916c] transition">
                        Book Tour
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 bg-[#1a3d2b] rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-2">Own a farm?</h3>
          <p className="text-white/60 mb-6 text-sm">Join AgroPro Safaris and turn your farm into a destination.</p>
          <Link href="/register-farm" className="bg-[#e9a825] text-white px-6 py-3 rounded-full font-semibold hover:bg-[#f4c84a] transition inline-block">
            🌾 Register My Farm
          </Link>
        </div>
      </div>

      <footer className="bg-[#0f2419] text-white/40 py-8 px-6 mt-12 text-center text-sm">
        © 2025 AgroPro Safaris. Made with ❤️ in Kenya.
      </footer>
    </main>
  )
}