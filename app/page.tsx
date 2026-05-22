import Link from 'next/link'

export default function HomePage() {
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
            <select className="flex-1 px-4 py-3 text-sm outline-none text-gray-500 rounded-xl bg-white border border-gray-100">
              <option>Any farm type</option>
              <option>Coffee Farm</option>
              <option>Tea Farm</option>
              <option>Dairy Farm</option>
              <option>Organic Farm</option>
            </select>
            <Link href="/farms" className="bg-[#2d6a4f] text-white px-6 py-3 rounded-xl text-sm font-semibold hover:bg-[#40916c] transition text-center">
              Search
            </Link>
          </div>
          <div className="flex items-center justify-center gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-white">3</div>
              <div className="text-white/50 text-xs uppercase tracking-wider mt-1">Verified Farms</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">100%</div>
              <div className="text-white/50 text-xs uppercase tracking-wider mt-1">Verified</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white">Kenya</div>
              <div className="text-white/50 text-xs uppercase tracking-wider mt-1">First Market</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-[#40916c] text-xs font-bold uppercase tracking-widest">Featured farms</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-12">Verified Farm Experiences</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {emoji:'☕', name:'Kirinyaga Coffee Estate', type:'Coffee Farm', location:'Kirinyaga County', price:'KES 3,500', rating:'4.9', slug:'kirinyaga-coffee-estate'},
              {emoji:'🐄', name:'Limuru Green Valley Farm', type:'Dairy Farm', location:'Kiambu County', price:'KES 2,500', rating:'4.7', slug:'limuru-green-valley'},
              {emoji:'🥬', name:'Thika Organic Gardens', type:'Organic Farm', location:'Thika, Kiambu', price:'KES 2,000', rating:'4.8', slug:'thika-organic-gardens'},
            ].map((farm,i) => (
              <Link href={`/farms/${farm.slug}`} key={i} className="bg-[#faf8f4] rounded-2xl overflow-hidden border border-gray-100 hover:shadow-lg transition">
                <div className="h-48 bg-gradient-to-br from-[#2d6a4f] to-[#52b788] flex items-center justify-center text-6xl">
                  {farm.emoji}
                </div>
                <div className="p-5 text-left">
                  <div className="text-xs text-gray-400 mb-1">📍 {farm.location}</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{farm.name}</h3>
                  <div className="text-xs text-gray-400 mb-3">{farm.type}</div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="text-sm">⭐ <strong>{farm.rating}</strong></div>
                    <div className="font-bold text-[#2d6a4f]">{farm.price}<span className="text-xs text-gray-400 font-normal ml-1">/ person</span></div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <Link href="/farms" className="border-2 border-[#2d6a4f] text-[#2d6a4f] px-8 py-3 rounded-full font-semibold hover:bg-[#2d6a4f] hover:text-white transition inline-block">
              View All Farms
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-[#1a3d2b] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-4">Turn Your Farm Into a Destination</h2>
          <p className="text-white/60 mb-8">Join Kenya&apos;s first agrotourism marketplace. Free 2-month trial.</p>
          <Link href="/register-farm" className="bg-[#e9a825] text-white px-8 py-4 rounded-full font-semibold hover:bg-[#f4c84a] transition inline-block">
            Register My Farm
          </Link>
        </div>
      </section>

      <footer className="bg-[#0f2419] text-white/40 py-8 px-6 text-center text-sm">
        <p>© 2025 AgroPro Safaris. Made with ❤️ in Kenya.</p>
        <p className="mt-2">agroprosafaris@gmail.com · 0710 701 013</p>
      </footer>
    </main>
  )
}