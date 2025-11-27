
import EventsExperience from "../components/EventsExperience";
import EventSchedule from "../components/EventSchedule";
import UpcomingEvents from "../components/UpcomingEvents";
import WinnersCarousel from "../components/WinnersCarousel";
import GalleryGrid from "../components/GalleryGrid";
import EmpressNavbar from "../components/EmpressNavbar";
import Footer from "../components/Footer";
import EventsPage from "../components/EventReel";

const Events = () => {
  return (
  <>
  <EmpressNavbar />
    <EventsExperience />
    <EventSchedule />
    {/* <UpcomingEvents /> */}
    <WinnersCarousel />
    {/* <EventsPage /> */}
    <GalleryGrid />
    <Footer />
  </>
  );
};

export default Events;
