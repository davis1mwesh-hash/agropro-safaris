'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default function RegisterFarmPage() {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    // Step 1 - Owner
    owner_name: '',
    owner_phone: '',
    owner_email: '',
    owner_id: '',
    // Step 2 - Farm
    farm_name: '',
    farm_type: '',
    county: '',
    location: '',
    description: '',
    farm_size: '',
    // Step 3 - Experiences
    price_per_person: '',
    max_visitors: '',
    accommodation: '',
    mpesa_number: '',
    experiences: [] as string[],
    open_days: [] as string[],
    // Step 4 - Visit
    visit_date: '',
    visit_time: '',
    how_heard: '',
    notes: '',
  })

  function update(field: string, value: any) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function toggleArray(field: 'experiences' | 'open_days', value: string) {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v: string) => v !== value)
        : [...prev[field], value]
    }))
  }

  async function submitForm() {
    setLoading(true)
    try {
      const { error } = await supabase.from('farms').insert([{
        name: form.farm_name,
        type: form.farm_type,
        county: form.county,
        location: form.location,
        description: form.description,
        price_per_person: Number(form.price_per_person),
        max_visitors: Number(form.max_visitors),
        accommodation: form.accommodation,
        mpesa_number: form.mpesa_number,
        open_days: form.open_days,
        host_email: form.owner_email,
        host_phone: form.owner_phone,
        visit_date: form.visit_date,
        visit_time: form.visit_time,
        status: 'pending',
      }])
      if (error) throw error
      setSubmitted(true)
    } catch (err) {
      alert('Something went wrong. Please try again or WhatsApp us.')
    }
    setLoading(false)
  }

  if (submitted) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-[#1a3d2b] to-[#2d6a4f] flex items-center justify-center px-6">
        <div className="bg-white rounded-2xl p-10 max-w-md w-full text-center shadow-xl">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Registration Received!</h2>
          <p className="text-gray-500 mb-6">
            Thank you for registering <strong>{form.farm_name}</strong> with AgroPro Safaris!
            <br/><br/>
            We will contact you on <strong>{form.owner_phone}</strong> within 24 hours to confirm your farm visit on <strong>{form.visit_date}</strong>.
          </p>
          <a href={`https://wa.me/254710701013?text=Hi! I just registered my farm ${form.farm_name} on AgroPro Safaris.`}
            target="_blank"
            className="bg-[#25d366] text-white px-6 py-3 rounded-full font-semibold inline-block mb-4 hover:bg-[#20bd5a] transition w-full">
            💬 WhatsApp AgroPro Safaris
          </a>
          <Link href="/" className="text-[#2d6a4f] text-sm font-semibold block">← Back to homepage</Link>
        </div>
      </main>
    )
  }

  const experiences = [
    '🚜 Farm tour / walk','🍳 Farm-to-table meal','🏡 Farm stay / overnight',
    '🎓 Educational program','🧑‍🍳 Cooking class','📸 Photography tour',
    '🐄 Animal feeding','🌱 Planting experience','🍯 Harvest participation','🏕️ Camping',
  ]

  const days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Public holidays']

  const counties = [
    'Nairobi','Kiambu','Nakuru','Meru','Kirinyaga',"Murang'a",
    'Nyeri','Machakos','Kajiado','Nyandarua','Laikipia','Other'
  ]

  return (
    <main className="min-h-screen bg-[#faf8f4]">

      {/* NAVBAR */}
      <nav className="bg-[#1a3d2b] px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 bg-[#40916c] rounded-lg flex items-center justify-center text-xl">🌿</div>
          <span className="font-bold text-white text-lg">AgroPro Safaris</span>
        </Link>
        <Link href="/" className="text-white/70 hover:text-white text-sm">← Back to home</Link>
      </nav>

      {/* HEADER */}
      <div className="bg-[#1a3d2b] px-6 pb-10 pt-4 text-center">
        <span className="text-[#e9a825] text-xs font-bold uppercase tracking-widest">Join AgroPro Safaris</span>
        <h1 className="text-3xl font-bold text-white mt-2 mb-2">Register Your Farm</h1>
        <p className="text-white/60 text-sm">Fill in your details — we will visit and verify before you go live</p>

        {/* PROGRESS */}
        <div className="flex gap-2 max-w-sm mx-auto mt-6">
          {[1,2,3,4].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-[#e9a825]' : 'bg-white/20'}`}/>
          ))}
        </div>
        <p className="text-white/40 text-xs mt-2">Step {step} of 4</p>
      </div>

      {/* FORM */}
      <div className="max-w-xl mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">

          {/* STEP 1 - OWNER */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">About You</h2>
              <p className="text-gray-400 text-sm mb-6">Farm owner details</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Full Name *</label>
                  <input value={form.owner_name} onChange={e => update('owner_name', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c]"
                    placeholder="e.g. John Kamau"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Phone Number *</label>
                  <input value={form.owner_phone} onChange={e => update('owner_phone', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c]"
                    placeholder="e.g. 0712 345 678"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Email Address *</label>
                  <input type="email" value={form.owner_email} onChange={e => update('owner_email', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c]"
                    placeholder="you@example.com"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">National ID / Business Reg No.</label>
                  <input value={form.owner_id} onChange={e => update('owner_id', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c]"
                    placeholder="For verification — kept private"/>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 - FARM */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Your Farm</h2>
              <p className="text-gray-400 text-sm mb-6">Farm information</p>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Farm Name *</label>
                  <input value={form.farm_name} onChange={e => update('farm_name', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c]"
                    placeholder="e.g. Green Valley Coffee Estate"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Farm Type *</label>
                    <select value={form.farm_type} onChange={e => update('farm_type', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c] bg-white text-gray-900">
                      <option value="">Select...</option>
                      {['Coffee','Tea','Dairy','Avocado','Organic','Poultry','Fish','Beekeeping','Hydroponic','Eco Lodge','Educational','Mixed'].map(t => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">County *</label>
                    <select value={form.county} onChange={e => update('county', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c] bg-white text-gray-900">
                      <option value="">Select...</option>
                      {counties.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Location / Nearest Town *</label>
                  <input value={form.location} onChange={e => update('location', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c]"
                    placeholder="e.g. 5km from Limuru town"/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Farm Description *</label>
                  <textarea value={form.description} onChange={e => update('description', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c] resize-none h-28"
                    placeholder="Tell visitors about your farm — its story, what you grow, what makes it special..."/>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Farm Size (acres)</label>
                  <input type="number" value={form.farm_size} onChange={e => update('farm_size', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c]"
                    placeholder="e.g. 25"/>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 - EXPERIENCES */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Experiences & Availability</h2>
              <p className="text-gray-400 text-sm mb-6">What visitors can do and when</p>
              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Activities Offered *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {experiences.map(exp => (
                      <button key={exp} type="button"
                        onClick={() => toggleArray('experiences', exp)}
                        className={`text-left px-3 py-2 rounded-xl text-xs border transition ${
                          form.experiences.includes(exp)
                            ? 'bg-[#f0faf2] border-[#40916c] text-[#2d6a4f] font-semibold'
                            : 'border-gray-200 text-gray-600 hover:border-[#40916c]'
                        }`}>
                        {exp}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Days Open *</label>
                  <div className="grid grid-cols-2 gap-2">
                    {days.map(day => (
                      <button key={day} type="button"
                        onClick={() => toggleArray('open_days', day)}
                        className={`text-left px-3 py-2 rounded-xl text-xs border transition ${
                          form.open_days.includes(day)
                            ? 'bg-[#f0faf2] border-[#40916c] text-[#2d6a4f] font-semibold'
                            : 'border-gray-200 text-gray-600 hover:border-[#40916c]'
                        }`}>
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Price Per Person (KES) *</label>
                    <input type="number" value={form.price_per_person} onChange={e => update('price_per_person', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c]"
                      placeholder="e.g. 3500"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Max Visitors/Day *</label>
                    <input type="number" value={form.max_visitors} onChange={e => update('max_visitors', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c]"
                      placeholder="e.g. 20"/>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Accommodation</label>
                  <select value={form.accommodation} onChange={e => update('accommodation', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c] bg-white text-gray-900">
                    <option>No — day visits only</option>
                    <option>Yes — basic rooms</option>
                    <option>Yes — cottages / banda</option>
                    <option>Yes — camping only</option>
                    <option>Yes — full lodge</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">M-Pesa Number for Payouts *</label>
                  <input value={form.mpesa_number} onChange={e => update('mpesa_number', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c]"
                    placeholder="e.g. 0712 345 678"/>
                  <p className="text-xs text-gray-400 mt-1">This is where AgroPro Safaris sends your payments</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 - VISIT */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">Schedule Your Farm Visit</h2>
              <p className="text-gray-400 text-sm mb-4">We come to verify before you go live</p>

              <div className="bg-[#f0faf2] border border-[#d8f3dc] rounded-xl p-4 mb-5 text-sm text-[#2d6a4f]">
                🤝 <strong>Our promise:</strong> An AgroPro Safaris team member will visit your farm in person before your listing goes live. This gives your farm an official <em>Verified Badge</em> which significantly increases bookings.
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Preferred Visit Date *</label>
                    <input type="date" value={form.visit_date} onChange={e => update('visit_date', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c]"/>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Preferred Time</label>
                    <select value={form.visit_time} onChange={e => update('visit_time', e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c] bg-white text-gray-900">
                      <option>Morning (8am–11am)</option>
                      <option>Midday (11am–2pm)</option>
                      <option>Afternoon (2pm–5pm)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">How did you hear about us?</label>
                  <select value={form.how_heard} onChange={e => update('how_heard', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c] bg-white text-gray-900">
                    <option>Word of mouth</option>
                    <option>Social media</option>
                    <option>Google search</option>
                    <option>AgroPro Safaris team visited me</option>
                    <option>Friend / colleague</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">Anything else we should know?</label>
                  <textarea value={form.notes} onChange={e => update('notes', e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#40916c] resize-none h-20"
                    placeholder="Access instructions, gate codes, what to wear..."/>
                </div>

                <div className="bg-[#fffbeb] border border-yellow-200 rounded-xl p-4 text-xs text-yellow-800">
                  💳 <strong>Pricing:</strong> First 2 months FREE. Then $5/month subscription. 10% commission per booking. You will be notified before any charges begin.
                </div>
              </div>
            </div>
          )}

          {/* NAV BUTTONS */}
          <div className="flex justify-between items-center mt-8">
            {step > 1 ? (
              <button onClick={() => setStep(s => s-1)}
                className="border border-gray-200 text-gray-500 px-5 py-2 rounded-full text-sm font-semibold hover:border-gray-400 transition">
                ← Back
              </button>
            ) : <div/>}

            {step < 4 ? (
              <button onClick={() => setStep(s => s+1)}
                className="bg-[#2d6a4f] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#40916c] transition">
                Next →
              </button>
            ) : (
              <button onClick={submitForm} disabled={loading}
                className="bg-[#e9a825] text-white px-6 py-2 rounded-full text-sm font-semibold hover:bg-[#f4c84a] transition disabled:opacity-50">
                {loading ? 'Submitting...' : '🌾 Submit Registration'}
              </button>
            )}
          </div>

        </div>
      </div>

      <footer className="bg-[#0f2419] text-white/40 py-8 px-6 text-center text-sm">
        <p>© 2025 AgroPro Safaris · agroprosafaris@gmail.com · 0710 701 013</p>
      </footer>
    </main>
  )
}