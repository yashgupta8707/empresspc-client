import React, { useState, useEffect } from 'react';
import { ChevronDown, Search, Menu, X, ShoppingBag, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../components/CartContext';

const EmpressNavbar = ({ theme = 'dark' }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { getTotalItems } = useCart();
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [dropdownTimeout, setDropdownTimeout] = useState(null);

  const cartItemCount = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      setIsScrolled(currentScrollY > 50);
      
      // Hide navbar when scrolling down, show when scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const handleNavigation = (path) => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const handleUserAction = () => {
    if (isAuthenticated()) {
      navigate('/account');
    } else {
      navigate('/auth');
    }
    setShowUserMenu(false);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };

  // Handle dropdown with delay to prevent flickering
  const handleMouseEnter = (index) => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
    setActiveDropdown(index);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
    setDropdownTimeout(timeout);
  };

  const handleDropdownEnter = () => {
    if (dropdownTimeout) {
      clearTimeout(dropdownTimeout);
      setDropdownTimeout(null);
    }
  };

  const handleDropdownLeave = () => {
    setActiveDropdown(null);
  };

  // Updated navigation structure with correct routing
  const navItems = [
    {
      label: 'Products',
      href: '/products',
      submenu: {
        sections: [
          {
            title: 'PC Systems',
            items: [
              { name: 'All PC Systems', desc: 'Browse all desktop systems', featured: true, href: '/products' },
              { name: 'Gaming PCs', desc: 'High-performance gaming systems', href: '/products/gaming-pc' },
              { name: 'Workstation PCs', desc: 'Professional workstations', href: '/products/workstation-pc' },
              { name: 'Creative PCs', desc: 'For designers and creators', href: '/products/creative-pc' },
              { name: 'Productivity PCs', desc: 'For business and office', href: '/products/productivity-pc' },
              { name: 'Budget PCs', desc: 'Affordable desktop systems', href: '/products/budget-pc' }
            ]
          },
          {
            title: 'Components',
            items: [
              { name: 'All Components', desc: 'Browse all components', href: '/components' },
              { name: 'Processors (CPUs)', desc: 'Intel & AMD processors', href: '/products/processors' },
              { name: 'Graphics Cards', desc: 'NVIDIA & AMD GPUs', href: '/products/graphics-cards' },
              { name: 'Motherboards', desc: 'Feature-rich platforms', href: '/products/motherboards' },
              { name: 'Memory (RAM)', desc: 'DDR4 & DDR5 memory', href: '/products/memory' }
            ]
          },
          {
            title: 'Quick Access',
            items: [
              { name: 'Gaming Peripherals', desc: 'Keyboards, mice, headsets', href: '/products/keyboards' },
              { name: 'Monitors', desc: 'Gaming & professional displays', href: '/products/monitors' },
              { name: 'Storage Solutions', desc: 'SSDs & hard drives', href: '/products/storage' },
              { name: 'Accessories', desc: 'Cables, adapters & more', href: '/products/cables-adapters' }
            ]
          }
        ]
      }
    },
    {
      label: 'PC Systems',
      href: '/products',
      submenu: {
        sections: [
          {
            title: 'Gaming Systems',
            items: [
              { name: 'Gaming PCs', desc: 'High-performance gaming rigs', featured: true, href: '/products/gaming-pc' },
              { name: 'Streaming PCs', desc: 'Dedicated streaming systems', href: '/products/streaming-pc' },
              { name: 'Budget Gaming', desc: 'Entry-level gaming PCs', href: '/products/budget-pc' }
            ]
          },
          {
            title: 'Professional Systems',
            items: [
              { name: 'Workstation PCs', desc: 'Professional workstations', href: '/products/workstation-pc' },
              { name: 'Creative PCs', desc: 'For content creation', href: '/products/creative-pc' },
              { name: 'Productivity PCs', desc: 'Business & office systems', href: '/products/productivity-pc' },
              { name: 'Office PCs', desc: 'Corporate environments', href: '/products/office-pc' }
            ]
          },
          {
            title: 'Specialized Systems',
            items: [
              { name: 'Mini PCs', desc: 'Compact form factor', href: '/products/mini-pc' },
              { name: 'Custom Builds', desc: 'Tailored solutions', href: '/contact' },
              { name: 'Bulk Orders', desc: 'Enterprise solutions', href: '/contact' }
            ]
          }
        ]
      }
    },
    {
      label: 'Components',
      href: '/components',
      submenu: {
        sections: [
          {
            title: 'Core Components',
            items: [
              { name: 'All Components', desc: 'Complete component lineup', featured: true, href: '/components' },
              { name: 'Processors (CPUs)', desc: 'Intel & AMD CPUs', href: '/products/processors' },
              { name: 'Graphics Cards', desc: 'NVIDIA & AMD GPUs', href: '/products/graphics-cards' },
              { name: 'Motherboards', desc: 'Feature-rich platforms', href: '/products/motherboards' },
              { name: 'Memory (RAM)', desc: 'High-speed DDR4/DDR5', href: '/products/memory' }
            ]
          },
          {
            title: 'Storage & Power',
            items: [
              { name: 'Storage Solutions', desc: 'SSDs, HDDs, NVMe drives', href: '/products/storage' },
              { name: 'Power Supplies', desc: 'Reliable PSU units', href: '/products/power-supplies' },
              { name: 'PC Cases', desc: 'Stylish & functional cases', href: '/products/cases' },
              { name: 'Cooling Systems', desc: 'Air & liquid cooling', href: '/products/cooling' }
            ]
          },
          {
            title: 'Build Support',
            items: [
              { name: 'PC Builder Tool', desc: 'Build your custom PC', href: '/pcbuilder' },
              { name: 'Component Guide', desc: 'Expert recommendations', href: '/components' },
              { name: 'Compatibility Check', desc: 'Ensure compatibility', href: '/contact' }
            ]
          }
        ]
      }
    },
    {
      label: 'Peripherals',
      href: '/products/monitors', // Default to monitors as main peripheral
      submenu: {
        sections: [
          {
            title: 'Display & Input',
            items: [
              { name: 'Gaming Monitors', desc: 'High-refresh gaming displays', featured: true, href: '/products/monitors' },
              { name: 'Mechanical Keyboards', desc: 'Premium typing experience', href: '/products/keyboards' },
              { name: 'Gaming Mice', desc: 'Precision gaming control', href: '/products/mice' },
              { name: 'Mouse Pads', desc: 'Gaming & precision surfaces', href: '/products/mouse-pads' }
            ]
          },
          {
            title: 'Audio & Recording',
            items: [
              { name: 'Gaming Headsets', desc: 'Immersive gaming audio', href: '/products/headsets' },
              { name: 'Speakers', desc: 'Desktop & studio speakers', href: '/products/speakers' },
              { name: 'Microphones', desc: 'Streaming & recording', href: '/products/microphones' },
              { name: 'Webcams', desc: 'HD streaming cameras', href: '/products/webcams' }
            ]
          },
          {
            title: 'Setup & Accessories',
            items: [
              { name: 'All Accessories', desc: 'Browse all peripherals', href: '/products/accessories' },
              { name: 'Monitor Arms', desc: 'Ergonomic positioning', href: '/products/accessories' },
              { name: 'Desk Setup', desc: 'Organize your workspace', href: '/products/accessories' },
              { name: 'Cable Management', desc: 'Clean cable routing', href: '/products/accessories' }
            ]
          }
        ]
      }
    },
    {
      label: 'Accessories',
      href: '/products/cables-adapters',
      submenu: {
        sections: [
          {
            title: 'Connectivity',
            items: [
              { name: 'Cables & Adapters', desc: 'USB, HDMI, DisplayPort', featured: true, href: '/products/cables-adapters' },
              { name: 'Networking Equipment', desc: 'Routers, switches, WiFi', href: '/products/networking' },
              { name: 'External Storage', desc: 'Portable drives & backup', href: '/products/external-storage' }
            ]
          },
          {
            title: 'Office Equipment',
            items: [
              { name: 'Printers & Scanners', desc: 'Document solutions', href: '/products/printers-scanners' },
              { name: 'UPS & Power', desc: 'Backup power solutions', href: '/products/accessories' },
              { name: 'Desk Accessories', desc: 'Workspace organization', href: '/products/accessories' }
            ]
          },
          {
            title: 'Support',
            items: [
              { name: 'Installation Service', desc: 'Professional setup', href: '/contact' },
              { name: 'Tech Support', desc: 'Expert assistance', href: '/contact' },
              { name: 'Bulk Orders', desc: 'Corporate solutions', href: '/contact' }
            ]
          }
        ]
      }
    },
    {
      label: 'About',
      href: '/about'
    },
    {
      label: 'Blogs',
      href: '/blogs'
    },
    {
      label: 'Events',
      href: '/events'
    },
    {
      label: 'FAQs',
      href: '/faqs'
    }
  ];

  const isDark = theme === 'dark';
  const navBg = isDark 
    ? `${isScrolled ? 'bg-black/95' : 'bg-black/80'}` 
    : `${isScrolled ? 'bg-white/95' : 'bg-white/80'}`;

  return (
    <>
      {/* Apple-style top banner */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white text-center text-[0.5rem] pt-2 pb-2 md:pt-1 md:text-sm">
        Get up to 12 months of No Cost EMI + ₹80K cashback. 
        <span className="ml-2 text-orange-200 hover:text-white cursor-pointer" onClick={() => navigate('/products')}>Shop &gt;</span>
      </div>

      {/* Main Navigation */}
      <nav className={`fixed top-7 left-0 right-0 z-50 ${navBg} backdrop-blur-xl transition-all duration-500 transform ${
        isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-10 md:h-12">
            
            {/* Logo */}
            <div onClick={() => navigate('/')} className="cursor-pointer">
              <div className="flex-shrink-0">
                <div className="flex items-center group">
                  <div className="relative mr-10">
                    {/* Sprint-style colorful background for logo */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-lg transform rotate-3 opacity-90"></div>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-400 rounded-lg transform -rotate-3 opacity-80"></div>
                    
                    {/* Logo container with sprint-style background and shadow */}
                    <div className="relative bg-gradient-to-br from-orange-100 via-yellow-50 to-orange-200 rounded-lg p-1.5 shadow-2xl border border-orange-300/30"
                        style={{
                          background: 'linear-gradient(135deg, #fff7ed 0%, #fed7aa 25%, #fdba74 50%, #fb923c 75%, #ea580c 100%)'
                        }}>
                      <img 
                        src="/images/Logo2.png" 
                        alt="Empress PC" 
                        className="h-8 sm:h-10 md:h-12 w-auto transform transition-transform duration-200 group-hover:scale-105 drop-shadow-lg"
                        style={{
                          filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3)) drop-shadow(-2px -2px 4px rgba(0,0,0,0.1))'
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <div
                  key={index}
                  className="relative"
                  onMouseEnter={() => item.submenu ? handleMouseEnter(index) : null}
                  onMouseLeave={item.submenu ? handleMouseLeave : null}
                >
                  <button
                    onClick={() => handleNavigation(item.href)}
                    className={`${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'} text-sm font-normal py-2 transition-colors duration-200 cursor-pointer flex items-center space-x-1`}
                  >
                    <span>{item.label}</span>
                    {item.submenu && (
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === index ? 'rotate-180' : ''}`} />
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Button with Badge */}
              <button 
                onClick={() => navigate('/cart')} 
                className={`${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'} transition-colors duration-200 relative`}
              >
                <ShoppingBag className="w-4 h-4"/>
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {cartItemCount > 99 ? '99+' : cartItemCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative">
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className={`${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'} transition-colors duration-200 flex items-center space-x-1`}
                >
                  <User className="w-4 h-4"/>
                  {isAuthenticated() && (
                    <span className="hidden md:block text-sm">{user?.name?.split(' ')[0]}</span>
                  )}
                </button>

                {/* User Dropdown */}
                {showUserMenu && (
                  <div className={`absolute right-0 top-full mt-2 w-48 ${isDark ? 'bg-gray-900' : 'bg-white'} rounded-lg shadow-lg border ${isDark ? 'border-gray-700' : 'border-gray-200'} py-2 z-50`}>
                    {isAuthenticated() ? (
                      <>
                        <button
                          onClick={() => {
                            navigate('/account');
                            setShowUserMenu(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${isDark ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'} transition-colors`}
                        >
                          My Account
                        </button>
                        <button
                          onClick={() => {
                            navigate('/account');
                            setShowUserMenu(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${isDark ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'} transition-colors`}
                        >
                          My Orders
                        </button>
                        <hr className={`my-2 ${isDark ? 'border-gray-700' : 'border-gray-200'}`} />
                        <button
                          onClick={handleLogout}
                          className={`block w-full text-left px-4 py-2 text-sm ${isDark ? 'text-red-400 hover:bg-gray-800' : 'text-red-600 hover:bg-gray-100'} transition-colors`}
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            navigate('/auth');
                            setShowUserMenu(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${isDark ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'} transition-colors`}
                        >
                          Sign In
                        </button>
                        <button
                          onClick={() => {
                            navigate('/auth');
                            setShowUserMenu(false);
                          }}
                          className={`block w-full text-left px-4 py-2 text-sm ${isDark ? 'text-white hover:bg-gray-800' : 'text-gray-900 hover:bg-gray-100'} transition-colors`}
                        >
                          Create Account
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              
              {/* Mobile Menu Button */}
              <button
                className={`lg:hidden ${isDark ? 'text-white' : 'text-gray-900'} transition-colors duration-200`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Full-width Apple-style Dropdown with improved hover handling */}
        {activeDropdown !== null && navItems[activeDropdown].submenu && (
          <div 
            className="absolute top-full left-0 right-0"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleDropdownLeave}
          >
            <div className={`${isDark ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-xl border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
              <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-3 gap-16">
                  {navItems[activeDropdown].submenu.sections.map((section, sectionIndex) => (
                    <div key={sectionIndex}>
                      <h3 className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs font-medium uppercase tracking-wide mb-6`}>
                        {section.title}
                      </h3>
                      <div className="space-y-1">
                        {section.items.map((subItem, subIndex) => (
                          <button
                            key={subIndex}
                            onClick={() => handleNavigation(subItem.href || '#')}
                            className={`block w-full text-left p-3 rounded-lg transition-all duration-150 ${isDark ? 'hover:bg-white/5' : 'hover:bg-black/5'} group`}
                          >
                            <div className={`${isDark ? 'text-white' : 'text-gray-900'} text-sm font-medium ${subItem.featured ? 'text-orange-500' : ''} group-hover:text-orange-500 transition-colors`}>
                              {subItem.name}
                            </div>
                            {subItem.desc && (
                              <div className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs mt-1`}>
                                {subItem.desc}
                              </div>
                            )}
                            {subItem.price && (
                              <div className="text-xs text-orange-500 mt-1 font-medium">
                                {subItem.price}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Full-screen backdrop blur when dropdown is open */}
      {activeDropdown !== null && (
        <div 
          className="fixed inset-0 z-30 backdrop-blur-sm bg-black/20 transition-all duration-300"
          style={{ top: '140px' }}
        />
      )}

      {/* Close user menu when clicking outside */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowUserMenu(false)}
        />
      )}

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 z-30 transition-all duration-300 ${
        isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
        <div className={`absolute right-0 top-0 h-full w-80 ${isDark ? 'bg-gray-900' : 'bg-white'} transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}>
          <div className="p-6 pt-20">
            <div className="space-y-6">
              <button 
                onClick={() => handleNavigation('/')}
                className={`block text-lg font-medium ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'} transition-colors text-left w-full`}
              >
                Home
              </button>
              {navItems.map((item, index) => (
                <div key={index} className="space-y-3">
                  <button 
                    onClick={() => handleNavigation(item.href)}
                    className={`block text-lg font-medium ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'} transition-colors text-left w-full`}
                  >
                    {item.label}
                  </button>
                  {item.submenu && (
                    <div className="ml-4 space-y-3">
                      {item.submenu.sections.map((section, sectionIndex) => (
                        <div key={sectionIndex}>
                          <div className={`text-xs font-medium uppercase tracking-wide ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                            {section.title}
                          </div>
                          {section.items.map((subItem, subIndex) => (
                            <button
                              key={subIndex}
                              onClick={() => handleNavigation(subItem.href || '#')}
                              className={`block text-sm ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors ml-2 text-left w-full`}
                            >
                              {subItem.name}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Mobile User Actions */}
              <div className="border-t pt-6 space-y-3">
                {isAuthenticated() ? (
                  <>
                    <button 
                      onClick={() => handleNavigation('/account')}
                      className={`block text-lg font-medium ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'} transition-colors text-left w-full`}
                    >
                      My Account
                    </button>
                    <button 
                      onClick={handleLogout}
                      className={`block text-lg font-medium ${isDark ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'} transition-colors text-left w-full`}
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => handleNavigation('/auth')}
                    className={`block text-lg font-medium ${isDark ? 'text-white hover:text-gray-300' : 'text-gray-900 hover:text-gray-600'} transition-colors text-left w-full`}
                  >
                    Sign In / Register
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for fixed navbar */}
      <div className="h-14"></div>
    </>
  );
};

export default EmpressNavbar;