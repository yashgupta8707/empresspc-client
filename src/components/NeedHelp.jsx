import { Mail, Phone, MapPin } from 'lucide-react';
import { useInView } from "react-intersection-observer";

export default function SupportSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div
      ref={ref}
      className={`bg-white py-2 md:py-10 px-4 sm:px-8 lg:px-24 transition-opacity duration-1000 ${
        inView ? "animate-fadeInFromBack" : "opacity-0"
      }`}
    >
      <style>{`
        .aston-bg {
          background: linear-gradient(-45deg, #001A0F, #003A1B, #001A0F, #000);
          background-size: 400% 400%;
          animation: gradientShift 18s ease infinite;
        }

        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="aston-bg backdrop-blur-md bg-black/60 text-white rounded-xl p-6 sm:p-8 lg:p-10 shadow-xl max-w-7xl mx-auto space-y-8 sm:space-y-10 text-sm sm:text-base">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center lg:text-left">
          Need help?
        </h2>

        <div className="flex flex-col lg:flex-row justify-between gap-6 sm:gap-10 lg:gap-16 text-center lg:text-left">
          {/* Left text section */}
          <div className="lg:w-1/2 space-y-3 sm:space-y-4">
            <p className="text-gray-200 leading-snug">
              If you need assistance, check out our FAQ section for answers to common questions.
            </p>
            <p className="text-gray-200 leading-snug">
              Still need help? Reach out to our customer service team via email or phone.
            </p>
          </div>

          {/* Contact info section */}
          <div className="lg:w-1/2 flex flex-col gap-4 items-center lg:items-start text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-green-200" />
              <span>sales@empresspc.in</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-green-200" />
              <span>+91 88811 23433</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-200" />
              <span>MS-101, Sector-D, Lucknow, Uttar Pradesh.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
