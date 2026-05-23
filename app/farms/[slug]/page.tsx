'use client'
import { useState, use } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'

const farmsData: Record<string, any> = {
  'kirinyaga-coffee-estate': {
    name: 'Kirinyaga Coffee Estate',
    type: 'Coffee Farm',
    emoji: '☕',
    location: 'Kirinyaga County, Central Kenya',
    description: 'Nestled on the fertile slopes of Mt. Kenya, Kirinyaga Coffee Estate has been producing some of Kenya\'s finest Arabica coffee for over 40 years. Visitors experience the full bean-to-cup journey — from picking ripe cherries to roasting and cupping. Overnight farm stays available in our authentic farmhouse cottages.',
    price: 3500,
    rating: 4.9,
    reviews: 12,
    capacity: 20,
    accommodation: 'Farmhouse cottages available',
    open_days: ['Mon','Wed','Fri','Sat','Sun'],
    closed_days: ['Tue','Thu'],
    experiences: ['☕ Coffee picking','🔥 Roasting demo','🍵 Professional cupping','🏡 Farmhouse stay','🌄 Mt. Kenya views','🎓 Bean-to-cup education'],
    reviews_list: [
      {visitor:'Verified visitor — 3 guests', rating:5, text:'Incredible experience. The whole process from picking to roasting — we left with bags of coffee and so many memories.', date:'10 Jan 2025'},
      {visitor:'Verified visitor — 1 guest', rating:5, text:'Best coffee I have ever tasted. Picked my own beans and watched the whole process.', date:'12 Jan 2025'},
      {visitor:'Verified visitor — 5 guests', rating:4, text:'Wonderful family outing. The kids were fascinated. Host was very knowledgeable.', date:'5 Jan 2025'},
    ]
  },
  'limuru-green-valley': {
    name: 'Limuru Green Valley Farm',
    type: 'Dairy Farm',
    emoji: '🐄',
    location: 'Limuru, Kiambu County',
    description: 'A working dairy farm just 30km from Nairobi that has been in the family for three generations. Watch the morning milking, learn how raw milk becomes artisan cheese and yoghurt, and enjoy a fresh farm breakfast. Perfect for families and school groups.',
    price: 2500,
    rating: 4.7,
    reviews: 8,
    capacity: 25,
    accommodation: 'Day visits only',
    open_days: ['Tue','Thu','Sat','Sun'],
    closed_days: ['Mon','Wed','Fri'],
    experiences: ['🐄 Milking experience','🧀 Cheese making','🥛 Yoghurt making','👨‍👩‍👧 Family activities','🌾 Farm walk','🍳 Farm breakfast'],
    reviews_list: [
      {visitor:'Verified visitor — family of 4', rating:5, text:'The kids learned how milk becomes cheese. They have not stopped talking about it!', date:'10 Jan 2025'},
      {visitor:'Verified visitor — 2 guests', rating:4, text:'Great experience. Very educational and the farm breakfast was delicious.', date:'8 Jan 2025'},
    ]
  },
  'thika-organic-gardens': {
    name: 'Thika Organic Gardens',
    type: 'Organic Farm',
    emoji: '🥬',
    location: 'Thika, Kiambu County',
    description: 'A pioneering certified organic farm growing over 40 varieties of vegetables, herbs, and fruit. No chemicals, no shortcuts — just healthy soil and good food. Learn composting, companion planting, and natural pest management, then sit down to a fresh farm-to-table lunch.',
    price: 2000,
    rating: 4.8,
    reviews: 5,
    capacity: 30,
    accommodation: 'Day visits only',
    open_days: ['Mon','Tue','Wed','Thu','Fri','Sat'],
    closed_days: ['Sun'],
    experiences: ['🌱 Composting workshop','🥗 Farm-to-table lunch','🚶 Guided farm walk','🌿 Herb harvesting','📸 Photography','🎓 Organic farming class'],
    reviews_list: [
      {visitor:'Teacher — school group of 30', rating:4, text:'Perfect hands-on lesson. The composting demo and farm-to-table lunch was amazing.', date:'13 Jan 2025'},
    ]
  },
}

const allDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']


export default function FarmPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const farm = farmsData[slug]
  const [guests, setGuests] = useState(1)
  const [date, setVisitDate] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [booked, setBooked] = useState(false)

  if (!farm) {
    return (
      <main className="min-h-screen bg-[#faf8f4] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🌾</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Farm not found</h1>
          <Link href="/farms" className="text-[#2d6a4f] font-semibold">← Back to farms</Link>
        </div>
      </main>
    )
  }

  const total = farm.price * guests
  const yourShare = Math.round(total * 0.9)

  async function handleBook() {
    if (!name || !phone || !date) {
      alert('Please fill in your name, phone, and visit date.')
      return
    }
    const { data: farmData } = await supabase
      .from('farms')
      .select('id')
      .ilike('name', farm.name)
      .single()
    await supabase.from('bookings').insert([{
      farm_id: farmData?.id || null,
      visitor_name: name,
      visitor_phone: phone,
      visitor_email: email,
      visit_date: date,
      guests: guests,
      total_amount: total,
      farm_share: yourShare,
      commission: total - yourShare,
      status: 'pending',
      payout_status: 'unpaid',
    }])
    setBooked(true)
  }

  if (booked) {
    return (
      <main className="min-h-screen bg-[#faf8f4] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-lg">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Booking Request Sent!</h2>
          <p className="text-gray-500 mb-6">
            Thank you <strong>{name}</strong>! Your booking request for <strong>{farm.name}</strong> on <strong>{date}</strong> for <strong>{guests} guest{guests > 1 ? 's' : ''}</strong> has been received.
            <br/><br/>
            AgroPro Safaris will contact you on <strong>{phone}</strong> within 24 hours to confirm and arrange payment.
          </p>
          <div className="bg-[#f0faf2] rounded-xl p-4 mb-6 text-left">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500">Total amount</span>
              <span className="font-bold text-gray-900">KES {total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Contact</span>
              <span className="font-bold text-gray-900">{phone}</span>
            </div>
          </div>
          <a href={`https://wa.me/254710701013?text=Hi! I just booked ${farm.name} for ${date}. My name is ${name}.`}
            target="_blank"
            className="bg-[#25d366] text-white px-6 py-3 rounded-full font-semibold inline-block mb-4 hover:bg-[#20bd5a] transition">
            💬 WhatsApp Us to Confirm
          </a>
          <br/>
          <Link href="/farms" className="text-[#2d6a4f] text-sm font-semibold">← Explore more farms</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#faf8f4]">

      {/* NAVBAR */}
      <nav className="bg-[#1a3d2b] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#40916c] rounded-lg flex items-center justify-center text-xl">🌿</div>
          <span className="font-bold text-white text-lg">AgroPro Safaris</span>
        </Link>
        <Link href="/farms" className="text-white/70 hover:text-white text-sm">← Back to farms</Link>
      </nav>

      {/* HERO IMAGE */}
      <div className="h-72 md:h-96 bg-gradient-to-br from-[#1a3d2b] to-[#52b788] flex items-center justify-center text-9xl relative">
        {farm.emoji}
        <div className="absolute bottom-4 left-6">
          <span className="bg-white text-[#2d6a4f] text-xs font-bold px-3 py-1 rounded-full">{farm.type}</span>
          <span className="ml-2 bg-[#e9a825] text-white text-xs font-bold px-3 py-1 rounded-full">✓ Verified by AgroPro</span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-8">

        {/* LEFT CONTENT */}
        <div className="md:col-span-2 space-y-8">

          {/* TITLE */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{farm.name}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>📍 {farm.location}</span>
              <span>⭐ <strong>{farm.rating}</strong> ({farm.reviews} reviews)</span>
              <span>👥 Up to {farm.capacity} visitors</span>
            </div>
          </div>

          {/* DESCRIPTION */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">About this farm</h2>
            <p className="text-gray-600 leading-relaxed">{farm.description}</p>
          </div>

          {/* EXPERIENCES */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Experiences offered</h2>
            <div className="flex flex-wrap gap-2">
              {farm.experiences.map((e: string, i: number) => (
                <span key={i} className="bg-[#f0faf2] text-[#2d6a4f] text-sm px-3 py-2 rounded-full font-medium border border-[#d8f3dc]">{e}</span>
              ))}
            </div>
          </div>

          {/* OPEN DAYS */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Open days</h2>
            <div className="flex gap-2 flex-wrap">
              {allDays.map(day => (
                <span key={day} className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  farm.open_days.includes(day)
                    ? 'bg-[#2d6a4f] text-white'
                    : 'bg-gray-100 text-gray-300 line-through'
                }`}>{day}</span>
              ))}
            </div>
          </div>

          {/* ACCOMMODATION */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Accommodation</h2>
            <p className="text-gray-600">{farm.accommodation}</p>
          </div>

          {/* REVIEWS */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">Visitor reviews</h2>
            <div className="space-y-4">
              {farm.reviews_list.map((r: any, i: number) => (
                <div key={i} className="bg-white rounded-xl p-5 border border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{r.visitor}</span>
                    <span className="text-[#e9a825]">{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</span>
                  </div>
                  <p className="text-sm text-gray-500 italic mb-2">&quot;{r.text}&quot;</p>
                  <p className="text-xs text-gray-400">{r.date}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT — BOOKING BOX */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-md sticky top-6">
            <div className="text-2xl font-bold text-[#2d6a4f] mb-1">
              KES {farm.price.toLocaleString()}
              <span className="text-sm font-normal text-gray-400 ml-1">/ person</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500 mb-5">
              ⭐ {farm.rating} · {farm.reviews} reviews
            </div>

            <div className="space-y-3 mb-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Your Name</label>
                <input value={name} onChange={e => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#40916c]"
                  placeholder="Full name"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Phone (M-Pesa)</label>
                <input value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#40916c]"
                  placeholder="07XX XXX XXX"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Email</label>
                <input value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#40916c]"
                  placeholder="you@email.com"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Visit Date</label>
                <input type="date" value={date} onChange={e => setVisitDate(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#40916c]"/>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Guests</label>
                <select value={guests} onChange={e => setGuests(Number(e.target.value))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-[#40916c] bg-white">
                  {[1,2,3,4,5,6,7,8,9,10,15,20].map(n => (
                    <option key={n} value={n}>{n} guest{n > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">KES {farm.price.toLocaleString()} × {guests} guest{guests > 1 ? 's' : ''}</span>
                <span className="font-semibold">KES {total.toLocaleString()}</span>
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

            <p className="text-xs text-gray-400 text-center">
              You will be contacted within 24 hours to confirm and arrange payment via M-Pesa.
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <a href="https://wa.me/254710701013" target="_blank"
                className="text-sm text-[#25d366] font-semibold hover:underline">
                💬 Questions? WhatsApp us
              </a>
            </div>
          </div>
        </div>

      </div>

      <footer className="bg-[#0f2419] text-white/40 py-8 px-6 text-center text-sm mt-12">
        <p>© 2025 AgroPro Safaris. Made with ❤️ in Kenya.</p>
      </footer>
    </main>
  )
}