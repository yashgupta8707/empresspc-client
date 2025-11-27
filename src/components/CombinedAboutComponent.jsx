import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Gamepad2,
  Users,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import CountUp from 'react-countup';

const processSteps = [
  {
    step: "1",
    title: "Understand Requirements & Budget",
    description: "We Begin By Understanding Your Unique Needs And Budget To Craft The Perfect Solution."
  },
  {
    step: "2", 
    title: "Select Best Hardware",
    description: "Our Experts Choose The Best Hardware Tailored To Your Requirements For Optimal Performance."
  },
  {
    step: "3",
    title: "Start Building Your PC", 
    description: "Our Skilled Team Assembles Your Custom PC With Precision And Care."
  },
  {
    step: "4",
    title: "Testing & Reporting",
    description: "We Rigorously Test Every System And Provide Detailed Reports For Transparency."
  },
  {
    step: "5",
    title: "Deliver Your Hardware",
    description: "Your PC Is Securely Packaged And Delivered Right To Your Doorstep, Ready To Go!"
  }
];

// Custom Ball Component
const FloatingBall = ({ size, color, x, y, delay = 0 }) => (
  <div 
    className={`absolute rounded-full opacity-60`}
    style={{
      width: `${size}px`,
      height: `${size}px`,
      backgroundColor: color,
      left: `${x}%`,
      top: `${y}%`,
      animation: `float ${3 + delay}s ease-in-out infinite`,
      animationDelay: `${delay}s`,
    }}
  />
);

// Custom Step Card Component
const StepCard = ({ step, isActive, onClick }) => (
  <div 
    className={`cursor-pointer transition-all duration-500 transform ${
      isActive 
        ? 'scale-105 opacity-100 z-10' 
        : 'scale-95 opacity-70 hover:opacity-85'
    }`}
    onClick={onClick}
  >
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500 rounded-2xl p-8 text-center min-h-[320px] flex flex-col justify-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 text-black font-bold text-2xl rounded-full mb-6 mx-auto">
        {step.step}
      </div>
      <h3 className="text-white text-xl font-semibold mb-4">
        {step.title}
      </h3>
      <p className="text-gray-300 text-base leading-relaxed">
        {step.description}
      </p>
    </div>
  </div>
);

const CombinedAboutComponent = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVideoVisible, setIsVideoVisible] = useState(false);
  const containerRef = useRef(null);
  const videoRef = useRef(null);

  // Intersection Observer for video auto-play
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVideoVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  // Auto-advance steps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => (prev + 1) % processSteps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width) * 100,
          y: ((e.clientY - rect.top) / rect.height) * 100
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <div ref={containerRef} className="relative bg-black text-white overflow-hidden">
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(249, 115, 22, 0.3); }
          50% { box-shadow: 0 0 40px rgba(249, 115, 22, 0.6); }
        }
        .glow-border {
          animation: pulse-glow 3s ease-in-out infinite;
        }
      `}</style>

      {/* Floating Balls Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Orange Balls */}
        <FloatingBall size={60} color="#fb923c" x={10} y={20} delay={0} />
        <FloatingBall size={40} color="#f97316" x={85} y={15} delay={1} />
        <FloatingBall size={50} color="#ea580c" x={15} y={60} delay={2} />
        <FloatingBall size={35} color="#fb923c" x={90} y={70} delay={0.5} />
        <FloatingBall size={45} color="#f97316" x={50} y={25} delay={1.5} />
        <FloatingBall size={55} color="#ea580c" x={75} y={85} delay={2.5} />
        
        {/* White Balls */}
        <FloatingBall size={30} color="#ffffff" x={25} y={30} delay={3} />
        <FloatingBall size={40} color="#f8fafc" x={70} y={45} delay={1} />
        <FloatingBall size={35} color="#ffffff" x={5} y={80} delay={2} />
        <FloatingBall size={25} color="#f8fafc" x={95} y={35} delay={0} />
        <FloatingBall size={45} color="#ffffff" x={40} y={75} delay={1.5} />
        
        {/* Interactive Ball that follows mouse */}
        <div 
          className="absolute w-8 h-8 bg-orange-400 rounded-full opacity-40 transition-all duration-300 ease-out"
          style={{
            left: `${mousePosition.x}%`,
            top: `${mousePosition.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 px-4 py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* Hero Section */}
          <div className="text-center mb-20">
            <div className="bg-black/70 backdrop-blur-sm border-2 border-orange-500 rounded-3xl p-8 mb-12 glow-border">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                Empress PC
              </h1>
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
                Your Premier Destination For High-Performance Custom Gaming Rigs
              </p>
            </div>
          </div>

          {/* Who We Are Section */}
          <div className="text-center mb-20">
            <div className="bg-black/70 backdrop-blur-sm border-2 border-orange-500 rounded-3xl p-8 hover:bg-black/80 transition-all duration-300">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-orange-400">
                Who We Are?
              </h2>
              <p className="text-gray-200 text-lg max-w-4xl mx-auto leading-relaxed">
                Empress PC Is More Than Just A PC Shop – We Are A Team Of Dedicated Tech Enthusiasts With A Passion For Performance And Innovation. Our Mission Is To Provide Our Customers With Cutting-Edge Technology And Unparalleled Service, Ensuring That Every System We Build Exceeds Expectations.
              </p>
            </div>
          </div>

          {/* What We Do Section */}
          <div className="text-center mb-20">
            <div className="bg-black/70 backdrop-blur-sm border-2 border-orange-500 rounded-3xl p-8 hover:bg-black/80 transition-all duration-300">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-orange-400">
                What We Do?
              </h2>
              <p className="text-gray-200 text-lg max-w-4xl mx-auto leading-relaxed">
                Specializing In High-Performance Desktops, Empress PC Offers A Wide Range Of Custom-Built Systems Designed To Deliver Exceptional Power And Reliability. Whether You're A Hardcore Gamer Looking For The Ultimate Gaming Rig, A Creative Professional Needing A Powerful Workstation, Or A Tech-Savvy Individual Seeking A Custom Build, We Have The Expertise And Products To Meet Your Needs.
              </p>
            </div>
          </div>

          {/* Process Steps - Custom Implementation */}
          <div className="text-center mb-20">
            <div className="bg-black/70 backdrop-blur-sm border-2 border-orange-500 rounded-3xl p-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-orange-400">
                Our Process
              </h2>
              <p className="text-gray-200 text-lg mb-12">
                Five Simple Steps To Your Perfect Custom PC
              </p>

              {/* Step Navigation */}
              <div className="flex justify-center mb-8 space-x-2 flex-wrap">
                {processSteps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      idx === activeStep 
                        ? 'bg-orange-500 scale-125' 
                        : 'bg-gray-500 hover:bg-orange-300'
                    }`}
                  />
                ))}
              </div>

              {/* Active Step Display */}
              <div className="max-w-2xl mx-auto">
                <StepCard 
                  step={processSteps[activeStep]} 
                  isActive={true}
                  onClick={() => {}}
                />
              </div>

              {/* Previous/Next Buttons */}
              <div className="flex justify-center mt-8 space-x-4">
                <button 
                  onClick={() => setActiveStep(prev => prev === 0 ? processSteps.length - 1 : prev - 1)}
                  className="px-6 py-2 bg-orange-500/20 border border-orange-500 text-orange-400 rounded-lg hover:bg-orange-500 hover:text-black transition-all duration-300"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setActiveStep(prev => (prev + 1) % processSteps.length)}
                  className="px-6 py-2 bg-orange-500 text-black rounded-lg hover:bg-orange-600 transition-all duration-300"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="text-center mb-20">
            <div className="bg-black/70 backdrop-blur-sm border-2 border-orange-500 rounded-3xl p-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-orange-400">
                Our Numbers
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                <StatBox number="10,000+" label="Happy Customers" />
                <StatBox number="8,500+" label="Custom Builds" />
                <StatBox number="6+" label="Years Experience" />
                <StatBox number="4.9⭐" label="Average Rating" />
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="text-center mb-20">
            <div className="bg-black/70 backdrop-blur-sm border-2 border-orange-500 rounded-3xl p-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-orange-400">
                Our Values
              </h2>
              <p className="text-gray-200 text-lg mb-12">
                The Core Principles That Drive Everything We Do
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <ValueCard
                  title="Gaming First"
                  description="Every Decision We Make Is Driven By What's Best For The Gaming Community And Experience."
                  icon={<Gamepad2 className="w-6 h-6 text-orange-400" />}
                />
                <ValueCard
                  title="Community"
                  description="Build Lasting Relationships With Gamers And Foster A Supportive Gaming Ecosystem."
                  icon={<Users className="w-6 h-6 text-orange-400" />}
                />
                <ValueCard
                  title="Quality"
                  description="Uncompromising Standards In Every Component, Build, And Customer Interaction."
                  icon={<ShieldCheck className="w-6 h-6 text-orange-400" />}
                />
                <ValueCard
                  title="Innovation"
                  description="Constantly Pushing Boundaries With Cutting-Edge Technology And Creative Solutions."
                  icon={<Sparkles className="w-6 h-6 text-orange-400" />}
                />
              </div>
            </div>
          </div>

          {/* Final CTA Section */}
          <div className="text-center mb-20">
            <div className="bg-black/80 backdrop-blur-sm border-2 border-orange-500 rounded-3xl p-8 max-w-3xl mx-auto glow-border">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-orange-400">
                Ready To Build Your Dream Gaming Rig?
              </h3>
              <p className="text-gray-200 text-lg mb-8">
                Join Thousands Of Satisfied Gamers Who Trust Empress PC For Their
                Ultimate Gaming Setup And Computing Experience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <a 
  href="/contact" 
  className="bg-orange-500 hover:bg-orange-600 text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
>
  Get Started Today
</a>

<a 
  href="/products" 
  className="border-2 border-orange-500 text-orange-400 hover:bg-orange-500 hover:text-black font-bold px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105"
>
  View Our Builds
</a>
              </div>
            </div>
          </div>

          {/* Video Showcase Section */}
          <div className="text-center" ref={videoRef}>
            <div className="bg-black/80 backdrop-blur-sm border-2 border-orange-500 rounded-3xl p-8 max-w-5xl mx-auto glow-border">
              <h3 className="text-3xl md:text-4xl font-bold mb-6 text-orange-400">
                Empress PC Studio: Doors Open Now!
              </h3>
              <p className="text-gray-200 text-lg mb-8">
                Take A Virtual Tour Of Our State-Of-The-Art Gaming PC Studio
              </p>
              
              <div className="relative rounded-2xl overflow-hidden border-2 border-orange-500/50 bg-gray-900">
                {/* Video Container */}
                <div className="relative pb-[56.25%] h-0 overflow-hidden">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/0YOKLC9o37o?autoplay=${isVideoVisible ? 1 : 0}&mute=1&loop=1&playlist=0YOKLC9o37o&controls=1&modestbranding=1&rel=0`}
                    title="Empress PC Studio: Doors Open Now!"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    style={{
                      opacity: isVideoVisible ? 1 : 0.7,
                      transition: 'opacity 0.5s ease-in-out'
                    }}
                  />
                </div>
                
                {/* Video Overlay for Loading State */}
                {!isVideoVisible && (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-orange-400 font-semibold">Video Loading...</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Video Info */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-orange-500/30 rounded-xl p-4">
                  <h4 className="text-orange-400 font-bold mb-2">Studio Tour</h4>
                  <p className="text-gray-300 text-sm">Get An Inside Look At Our Professional Gaming PC Assembly Process</p>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-orange-500/30 rounded-xl p-4">
                  <h4 className="text-orange-400 font-bold mb-2">Live Builds</h4>
                  <p className="text-gray-300 text-sm">Watch Our Expert Technicians Craft Custom Gaming Rigs In Real-Time</p>
                </div>
                <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 border border-orange-500/30 rounded-xl p-4">
                  <h4 className="text-orange-400 font-bold mb-2">Quality Check</h4>
                  <p className="text-gray-300 text-sm">See Our Rigorous Testing Process That Ensures Every PC Meets Our Standards</p>
                </div>
              </div>

              {/* Call to Action */}
              <div className="mt-8">
                <p className="text-gray-300 mb-4">
                  Ready To Experience The Empress PC Difference?
                </p>
                <button className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-black font-bold px-8 py-3 rounded-xl transition-all duration-300 transform hover:scale-105">
                  Visit Our Studio Today
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatBox({ number, label }) {
  const match = number.match(/^([\d.,]+)([^\d]*)$/);
  const numericPart = match ? parseFloat(match[1].replace(/,/g, '')) : null;
  const suffix = match ? match[2] : '';

  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border-2 border-orange-500 rounded-2xl py-6 px-4 transform hover:scale-105 transition-all duration-300">
      <p className="text-2xl md:text-3xl font-bold text-orange-400">
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
      <p className="text-sm text-gray-300 mt-2 font-medium">{label}</p>
    </div>
  );
}

function ValueCard({ title, description, icon }) {
  return (
    <div className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 backdrop-blur-sm border-2 border-orange-500 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-orange-500/20">
      <div className="flex items-center justify-center gap-3 mb-4">
        {icon}
        <h4 className="font-bold text-lg text-white">{title}</h4>
      </div>
      <p className="text-sm text-gray-300 leading-relaxed">{description}</p>
    </div>
  );
}

export default CombinedAboutComponent;