import EventsHighlights from './EventsHighlights';

// Example usage in your main component
function EventsPage() {
  // Your YouTube highlights data - add all your links here
  const highlightsData = [
    {
      url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_1",
      title: "Epic Gaming Tournament Finals",
      description: "Watch the most intense moments from our championship finals where teams battled for the ultimate prize!",
      category: "Tournament",
      date: "Dec 2024"
    },
    {
      url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_2", 
      title: "Behind the Scenes Action",
      description: "Get an exclusive look at what happens behind the scenes at our premier gaming events.",
      category: "Behind Scenes",
      date: "Nov 2024"
    },
    {
      url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_3",
      title: "Community Gaming Night",
      description: "Amazing highlights from our weekly community gaming sessions and tournaments.",
      category: "Community",
      date: "Oct 2024"
    },
    {
      url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_4",
      title: "Professional Esports Match",
      description: "Professional players showcase their skills in this high-stakes championship match.",
      category: "Esports",
      date: "Sep 2024"
    },
    {
      url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_5",
      title: "Gaming Setup Reviews",
      description: "Check out the latest gaming gear and setups used by our professional players.",
      category: "Reviews",
      date: "Aug 2024"
    },
    {
      url: "https://www.youtube.com/watch?v=YOUR_VIDEO_ID_6",
      title: "Event Compilation",
      description: "A compilation of the best moments from all our events this year.",
      category: "Compilation",
      date: "Jul 2024"
    }
    // Add more highlights as needed - they will be displayed 2 at a time
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Other page content */}
      
      {/* Events Highlights Section */}
      <section className="py-16 bg-white">
        <EventsHighlights reels={highlightsData} />
      </section>
      
      {/* Other page content */}
    </div>
  );
}

export default EventsPage;