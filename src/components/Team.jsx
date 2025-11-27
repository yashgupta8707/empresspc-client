import React, { useState, useEffect } from 'react';
import { aboutAPI } from '../services/api';

export default function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch team members from backend using the API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching team members...');
        
        // Use the aboutAPI.getAllTeamMembers() function
        const response = await aboutAPI.getAllTeamMembers();
        console.log('Team API response:', response);
        
        // Handle the response structure based on your API
        let members = [];
        if (response.success) {
          members = response.teamMembers || response.data || [];
        } else if (response.teamMembers) {
          members = response.teamMembers;
        } else if (Array.isArray(response)) {
          members = response;
        }
        
        // Filter only active members and validate structure
        const validMembers = members.filter(member => 
          member.name && 
          member.title && 
          member.hasOwnProperty('isActive') &&
          member.isActive === true
        );
        
        console.log('Valid active team members found:', validMembers.length);
        setTeamMembers(validMembers);
        
      } catch (error) {
        console.error('Error fetching team members:', error);
        setError(error.message);
        // Set empty array on error
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, []);

  // Group by category and sort by order
  const groupedMembers = teamMembers.reduce((acc, member) => {
    const category = member.category || 'operations';
    if (!acc[category]) acc[category] = [];
    acc[category].push(member);
    return acc;
  }, {});

  // Sort each category by order
  Object.keys(groupedMembers).forEach(category => {
    groupedMembers[category].sort((a, b) => (a.order || 0) - (b.order || 0));
  });

  const leadership = groupedMembers.leadership || [];
  const operations = groupedMembers.operations || [];
  const support = groupedMembers.support || [];
  const creative = groupedMembers.creative || [];

  // Loading state
  if (loading) {
    return (
      <section className="w-full text-center py-16 bg-white">
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mb-4"></div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Loading Our Team...</h2>
          <p className="text-gray-500">Fetching our amazing team members</p>
        </div>
      </section>
    );
  }

  // Error state
  if (error && teamMembers.length === 0) {
    return (
      <section className="w-full text-center py-16 bg-white">
        <div className="flex flex-col items-center justify-center max-w-2xl mx-auto px-4">
          <div className="text-orange-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-2 text-gray-800">Unable to Load Team Data</h2>
          <p className="text-gray-500 mb-4">Backend connection issue: {error}</p>
          <p className="text-gray-400 text-sm mb-6">Please ensure your backend server is running and the about API endpoints are accessible</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  // No team members state
  if (teamMembers.length === 0) {
    return (
      <section className="w-full text-center py-16 bg-white">
        <h2 className="text-3xl font-bold text-gray-800">Meet The Team</h2>
        <p className="text-gray-500 mt-4">No active team members available at the moment</p>
        <p className="text-gray-400 text-sm mt-2">Check your admin panel to add and activate team members</p>
      </section>
    );
  }

  return (
    <section className="w-full">
      {/* Connection Status Banner */}
      {error && teamMembers.length > 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                <strong>Notice:</strong> Partial backend connection issue detected. 
                Error: {error}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Leadership Section */}
      {leadership.length > 0 && (
        <div className="text-center py-8 md:py-16 bg-gradient-to-br from-orange-50 to-orange-100 px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-orange-600">Leadership</h2>
          <p className="text-gray-700 mt-3 text-lg max-w-2xl mx-auto mb-8 md:mb-14">
            Visionary leaders driving innovation in custom PC solutions and gaming excellence
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto my-auto">
            {leadership.map((member) => (
              <LeadershipCard key={member._id} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* Main Team Section */}
      <div className="text-center py-8 md:py-16 bg-white px-4 md:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Meet The Team</h2>
        <p className="text-gray-600 mt-3 text-lg max-w-2xl mx-auto mb-8 md:mb-14">
          Passionate gamers and tech enthusiasts dedicated to crafting the ultimate gaming experience for every customer
        </p>

        {/* Operations Team */}
        {operations.length > 0 && (
          <div className="mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-12 text-gray-800">
              Technical Operations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
              {operations.map((member) => (
                <TeamMemberCard key={member._id} member={member} />
              ))}
            </div>
          </div>
        )}

        {/* Support Team */}
        {support.length > 0 && (
          <div className="mb-12 md:mb-16">
            <h3 className="text-2xl md:text-3xl font-semibold mb-8 md:mb-12 text-gray-800">
              Customer Success
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
              {support.map((member) => (
                <TeamMemberCard key={member._id} member={member} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Creative Team Section */}
      {creative.length > 0 && (
        <div className="bg-gradient-to-r from-black via-gray-900 to-black text-white text-center py-12 md:py-16 px-4 md:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Great Teams Don't Just Work Together
            </span>
            <br />
            <span className="text-white font-normal text-2xl md:text-3xl">
              They Create Together.
            </span>
          </h2>
          <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
            Our creative team brings artistic vision to every custom build
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 max-w-6xl mx-auto">
            {creative.map((member) => (
              <CreativeTeamCard key={member._id} member={member} />
            ))}
          </div>
        </div>
      )}

      {/* Team Stats Section */}
      <div className="bg-gray-50 py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-8 text-gray-800">Team Statistics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
                {teamMembers.length}
              </div>
              <div className="text-gray-600 text-sm md:text-base">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">2+</div>
              <div className="text-gray-600 text-sm md:text-base">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">1000+</div>
              <div className="text-gray-600 text-sm md:text-base">PCs Built</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600 text-sm md:text-base">Support Available</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Leadership card component with enhanced styling
function LeadershipCard({ member }) {
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';
  };

  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-300 border-4 border-orange-300 shadow-lg">
        <img 
          src={member.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'} 
          alt={member.name} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800">{member.name}</h3>
      <p className="text-lg md:text-xl text-orange-600 mb-4 font-semibold">{member.title}</p>
      {member.bio && (
        <p className="text-sm md:text-base text-gray-700 max-w-sm leading-relaxed mb-4">{member.bio}</p>
      )}
      
      {/* Contact links */}
      {(member.email || member.linkedin) && (
        <div className="flex gap-4 mt-2">
          {member.email && (
            <a 
              href={`mailto:${member.email}`}
              className="text-gray-500 hover:text-orange-600 transition-colors p-2 rounded-full hover:bg-orange-100"
              title={`Email ${member.name}`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </a>
          )}
          {member.linkedin && (
            <a 
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-100"
              title={`${member.name} on LinkedIn`}
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// Regular team member card component
function TeamMemberCard({ member }) {
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';
  };

  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-32 h-32 md:w-40 md:h-40 lg:w-44 lg:h-44 rounded-full overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-300 border-3 border-gray-200 shadow-md">
        <img 
          src={member.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'} 
          alt={member.name} 
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      <h3 className="text-lg md:text-xl font-semibold mb-1 text-gray-800">{member.name}</h3>
      <p className="text-sm md:text-base text-orange-600 mb-3 font-medium">{member.title}</p>
      {member.bio && (
        <p className="text-xs md:text-sm text-gray-600 max-w-xs leading-relaxed mb-3">{member.bio}</p>
      )}
      
      {/* Contact links */}
      {(member.email || member.linkedin) && (
        <div className="flex gap-3 mt-2">
          {member.email && (
            <a 
              href={`mailto:${member.email}`}
              className="text-gray-400 hover:text-orange-500 transition-colors p-1 rounded"
              title={`Email ${member.name}`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </a>
          )}
          {member.linkedin && (
            <a 
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-blue-600 transition-colors p-1 rounded"
              title={`${member.name} on LinkedIn`}
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

// Creative team member card component
function CreativeTeamCard({ member }) {
  const handleImageError = (e) => {
    e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face';
  };

  return (
    <div className="flex flex-col items-center text-center group">
      <div className="w-full aspect-square bg-gray-800 overflow-hidden rounded-xl shadow-lg mb-4 group-hover:scale-105 transition-transform duration-300 border-2 border-purple-600">
        <img
          src={member.image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face'}
          alt={member.name}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      <h3 className="font-bold text-lg uppercase mb-1 text-white">{member.name}</h3>
      <p className="text-sm text-purple-300 mb-2 font-medium">{member.title}</p>
      {member.bio && (
        <p className="text-xs text-gray-400 leading-relaxed mb-3">{member.bio}</p>
      )}
      
      {/* Contact links for creative team */}
      {(member.email || member.linkedin) && (
        <div className="flex gap-3 mt-2">
          {member.email && (
            <a 
              href={`mailto:${member.email}`}
              className="text-gray-400 hover:text-purple-400 transition-colors p-1 rounded"
              title={`Email ${member.name}`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </a>
          )}
          {member.linkedin && (
            <a 
              href={member.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-purple-400 transition-colors p-1 rounded"
              title={`${member.name} on LinkedIn`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
              </svg>
            </a>
          )}
        </div>
      )}
    </div>
  );
}