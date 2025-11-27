import {
  Gamepad2,
  Users,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import CountUp from 'react-countup';

export default function AboutStats() {
  return (
    <section className="bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white px-6 py-8 md:py-20 text-center">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-8 md:mb-16">
        <StatBox number="10,000+" label="Custom Builds" />
        <StatBox number="8,500+" label="Custom Builds" />
        <StatBox number="6" label="Custom Builds" />
        <StatBox number="4.9⭐" label="Custom Builds" />
      </div>

      {/* Values Heading */}
      <div className="mb-2">
        <h2 className="text-xl md:text-3xl font-bold">Our Values</h2>
        <p className="text-gray-300 mt-1">
          The core principles that drive everything we do
        </p>
      </div>

      {/* Values Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-6 max-w-4xl mx-auto">
        <ValueCard
          title="Gaming First"
          description="Every decision we make is driven by what’s best for the gaming community and experience."
          icon={<Gamepad2 className="w-5 h-5 text-purple-400" />}
        />
        <ValueCard
          title="Community"
          description="Build lasting relationships with gamers and foster a supportive gaming ecosystem."
          icon={<Users className="w-5 h-5 text-purple-400" />}
        />
        <ValueCard
          title="Quality"
          description="Uncompromising standards in every component, build, and customer interaction."
          icon={<ShieldCheck className="w-5 h-5 text-purple-400" />}
        />
        <ValueCard
          title="Innovation"
          description="Constantly pushing boundaries with cutting-edge technology and creative solutions."
          icon={<Sparkles className="w-5 h-5 text-purple-400" />}
        />
      </div>

      {/* CTA */}
      <div className="mt-8 md:mt-16 border border-blue-400 rounded-xl p-4 md:p-6 max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold mb-2">
          Ready to Build Your Dream Gaming Rig?
        </h3>
        <p className="text-gray-300 mb-6">
          Join thousands of satisfied gamers who trust Empress PC for their
          ultimate gaming setup.
        </p>
        <button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-6 py-2 rounded-lg font-medium">
          Get Started Today
        </button>
      </div>
    </section>
  );
}

function StatBox({ number, label }) {
  const match = number.match(/^([\d.,]+)([^\d]*)$/); // Extract numeric part + suffix
  const numericPart = match ? parseFloat(match[1].replace(/,/g, '')) : null;
  const suffix = match ? match[2] : '';

  return (
    <div className="border border-purple-600 rounded-md py-6 px-4">
      <p className="text-2xl font-bold text-purple-400 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        {numericPart !== null ? (
          <CountUp
            end={numericPart}
            duration={2}
            decimals={number.includes('.') ? 1 : 0}
            separator=","
            suffix={suffix}
          />
        ) : (
          number
        )}
      </p>
      <p className="text-sm text-gray-300 mt-1">{label}</p>
    </div>
  );
}

function ValueCard({ title, description, icon }) {
  return (
    <div className="bg-gradient-to-br from-[#2c2c54] to-[#1e1e3f] p-4 rounded-lg border border-gray-600">
      <div className="flex items-center text-center gap-3 mb-3">
        {icon}
        <h4 className="font-bold">{title}</h4>
      </div>
      <p className="text-sm text-gray-300 text-left">{description}</p>
    </div>
  );
}
