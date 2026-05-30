import { Link } from 'react-router-dom';
import slot from "../../../../images/slot.png";
import patient from "../../../../images/patient.png";
import doctor from "../../../../images/doctor.png";

// ─── Icon primitives ──────────────────────────────────────────────────────────
const Icon = ({ path, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const ICONS = {
  search:    'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm10 2-4.35-4.35',
  calendar:  'M8 2v4m8-4v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z',
  clock:     'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 6v4l3 3',
  check:     'M20 6 9 17l-5-5',
  user:      'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  stethoscope:'M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6 6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3M14 12a2 2 0 0 0 0 4 2 2 0 0 0 0-4',
  arrow:     'M5 12h14m-7-7 7 7-7 7',
  shield:    'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  grid:      'M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z',
  zap:       'M13 2 3 14h9l-1 8 10-12h-9l1-8z',
};

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader = ({ eyebrow, title, subtitle }) => (
  <div className="text-center mb-14">
    <span className="inline-block text-xs font-semibold tracking-widest uppercase text-blue-600 bg-blue-50 px-3 py-1 rounded-full mb-4">
      {eyebrow}
    </span>
    <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 leading-tight">{title}</h2>
    {subtitle && <p className="text-gray-500 max-w-xl mx-auto text-base leading-relaxed">{subtitle}</p>}
  </div>
);

// ─── Feature card ─────────────────────────────────────────────────────────────
const FeatureCard = ({ icon, title, description, accent }) => (
  <div className={`group relative bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1`}>
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${accent}`}>
      <Icon path={ICONS[icon]} size={20} />
    </div>
    <h3 className="font-semibold text-gray-900 mb-2 text-base">{title}</h3>
    <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
  </div>
);

// ─── Main component ───────────────────────────────────────────────────────────
const Home = () => {
  const patientFeatures = [
    { icon: 'search',   title: 'Discover Doctors',        description: 'Browse verified doctors by speciality, availability, and consultation fees.',           accent: 'bg-blue-50 text-blue-600'   },
    { icon: 'calendar', title: 'Book Appointments',        description: 'Select available slots, describe your issue, and flag urgency level — all in one step.', accent: 'bg-indigo-50 text-indigo-600' },
    { icon: 'clock',    title: 'Track Your History',       description: 'Monitor appointment status from pending through approval to completion in real time.',    accent: 'bg-sky-50 text-sky-600'      },
    { icon: 'user',     title: 'Manage Your Profile',      description: 'Keep your medical details — age, blood group, contact, and address.', accent: 'bg-teal-50 text-teal-600'    },
  ];

  const doctorFeatures = [
    { icon: 'grid',     title: 'Manage Availability',      description: 'Create and delete time slots to define exactly when you are open for appointments.',      accent: 'bg-emerald-50 text-emerald-600' },
    { icon: 'check',    title: 'Approve or Reject',         description: 'Review incoming requests and take action — approve, reject, or reschedule with one click.', accent: 'bg-green-50 text-green-600'     },
    { icon: 'zap',      title: 'Reschedule Flexibly',       description: 'Swap appointment slots when plans change — the patient is notified automatically.',          accent: 'bg-lime-50 text-lime-600'       },
    { icon: 'shield',   title: 'Today\'s Schedule',         description: 'Dashboard highlights today\'s approved appointments so you always know who\'s coming next.', accent: 'bg-cyan-50 text-cyan-600'       },
  ];

  const patientSteps = ['Register', 'Find Doctor', 'Book Slot', 'Await Approval', 'Visit Complete'];
  const doctorSteps  = ['Create Slots', 'Review Requests', 'Approve / Reject', 'Manage Schedule'];

  return (
    <div className="bg-gray-50">

      {/* ── Hero ── */}
    <section className="relative overflow-hidden bg-white">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f7ff_1px,transparent_1px),linear-gradient(to_bottom,#f0f7ff_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-60" />
        
        {/* Heartbeat */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] pointer-events-none">
            <svg
            viewBox="0 0 1200 200"
            className="w-full max-w-6xl h-auto"
            fill="none">
            <path
                d="M0 100 H180 L220 100 L250 60 L290 140 L340 40 L390 100 H1200"
                stroke="#2563EB"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="animate-pulse"
                />
            </svg>
        </div>
        {/* Blue gradient blob */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-blue-100 via-indigo-50 to-transparent rounded-full opacity-50 translate-x-1/3 -translate-y-1/4" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-28 text-center">
          {/* Eyebrow */}
          <div
            className="
                inline-flex items-center gap-2
                bg-blue-50 border border-blue-100
                text-blue-700 text-xs font-semibold
                px-4 py-1.5 rounded-full mb-8 tracking-wide
                transition-all duration-300 ease-out
                hover:scale-110 hover:text-sm
                hover:shadow-md hover:border-blue-200
                cursor-default" >
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
            Healthcare Appointment Platform
            </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6 tracking-tight">
            Connecting Patients and<br />
            <span className="text-blue-600">Doctors Seamlessly</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            Medora simplifies healthcare appointment scheduling by enabling patients
            and doctors to manage appointments through a structured digital workflow —
            faster and clearer.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 text-sm"
            >
              Get Started — It's Free
              <Icon path={ICONS.arrow} size={16} />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-700 font-semibold px-8 py-3.5 rounded-xl border border-gray-200 shadow-sm hover:shadow transition-all duration-200 text-sm"
            >
              Sign In
            </Link>
          </div>

          {/* Social proof strip */}
          <div className="mt-14 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-400">
            {[
              { value: 'Find',  label: 'Doctors By Speciality'       },
              { value: 'Real Time',     label: 'Appointment Tracking'      },
              { value: 'Doctor',   label: 'Controlled Scheduling'  },
              { value: 'Secure',       label: 'Role Based Access'  },
            ].map(({ value, label }) => (
              <div key={label} className="flex items-center gap-1.5">
                <Icon path={ICONS.check} size={14} />
                <span><strong className="text-gray-600">{value}</strong> {label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section className="py-14 bg-gray-50" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHeader
              eyebrow="About Medora"
              title="Built to Replace Manual Scheduling"
            />
            <p className="text-gray-500 leading-relaxed mb-6">
            Medora replaces phone-call based appointment booking with a structured digital workflow.
            Patients discover doctors, book appointments, and
            track status updates.
            Doctors manage availability, approve requests,
            reschedule appointments, and monitor daily schedules.
            </p>
          </div>
        </div>
      </section>

      {/* ── Patient features ── */}
      <section className="py-20 bg-white" id="patients">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="For Patients"
            title="Everything You Need to Manage Your Health"
            subtitle="From discovering the right doctor to tracking your appointment — Medora handles the entire journey."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {patientFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Doctor features ── */}
      <section className="py-20 bg-gray-50" id="doctors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="For Doctors"
            title="Full Control Over Your Schedule"
            subtitle="Define your availability, review every request, and manage your daily appointments — all from one place."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {doctorFeatures.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform Preview ── */}
<section className="py-24 bg-white" id="preview">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

    <SectionHeader
      eyebrow="Platform Preview"
      title="See Medora In Action"
      subtitle="A quick look at the experience for patients and doctors."
    />

    <div className="grid lg:grid-cols-3 gap-8">

      {/* Patient Dashboard */}
      <div className="group">
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
          <img
            src={patient}
            alt="Patient Dashboard"
            className="w-full h-auto group-hover:scale-105 transition duration-500"
          />
        </div>

        <h3 className="mt-5 font-semibold text-lg text-gray-900">
          Patient Dashboard
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          Track appointments, monitor approvals and manage healthcare records.
        </p>
      </div>

      {/* Doctor Dashboard */}
      <div className="group">
        <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
          <img
            src={doctor}
            alt="Doctor Dashboard"
            className="w-full h-auto group-hover:scale-105 transition duration-500"
          />
        </div>

        <h3 className="mt-5 font-semibold text-lg text-gray-900">
          Doctor Dashboard
        </h3>

        <p className="text-sm text-gray-500 mt-2">
          Review requests, approve appointments and manage daily schedules.
        </p>
      </div>

      {/* Slot Management */}
        <div className="group">
            <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300">
            <img
                src={slot}
                alt="Slot Management"
                className="w-full h-auto group-hover:scale-105 transition duration-500"
            />
            </div>

            <h3 className="mt-5 font-semibold text-lg text-gray-900">
            Slot Management
            </h3>

            <p className="text-sm text-gray-500 mt-2">
            Doctors can create and manage available consultation slots instantly.
            </p>
        </div>

        </div>
    </div>
    </section>
      
      {/* ── Feedback ── */}
<section className="py-24 bg-white" id="testimonials">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <SectionHeader
      eyebrow="Testimonials"
      title="Trusted by Patients and Doctors"
      subtitle="See how Medora is improving appointment management for both patients and healthcare professionals."
    />

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Patient */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        <div className="text-yellow-400 text-lg mb-4">★★★★★</div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          "Booking appointments is now much easier. I can instantly see
          available slots, track appointment status, and avoid lengthy
          phone calls with clinics."
        </p>

        <div>
          <h4 className="font-semibold text-gray-900">Ramit Naik</h4>
          <p className="text-xs text-gray-500 mt-1">Patient</p>
        </div>
      </div>

      {/* Doctor */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        <div className="text-yellow-400 text-lg mb-4">★★★★★</div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          "Managing availability and appointment requests from a single
          dashboard has reduced administrative effort significantly and
          keeps my schedule organized."
        </p>

        <div>
          <h4 className="font-semibold text-gray-900">
            Dr. Anshu Ranjan, MD (Medicine)
          </h4>
          <p className="text-xs text-gray-500 mt-1">Physician & Surgeon</p>
        </div>
      </div>

      {/* Patient */}
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
        <div className="text-yellow-400 text-lg mb-4">★★★★</div>

        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          "The appointment history and status tracking features give me
          complete visibility into my healthcare appointments without
          any confusion."
        </p>

        <div>
          <h4 className="font-semibold text-gray-900">Lakshay Kaushik</h4>
          <p className="text-xs text-gray-500 mt-1">Patient</p>
        </div>
      </div>


      
    </div>
  </div>
  
</section>
    </div>
    
  );
};

export default Home;