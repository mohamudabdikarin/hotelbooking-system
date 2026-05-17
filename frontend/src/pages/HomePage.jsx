import { useNavigate } from 'react-router-dom';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-blend-overlay bg-black/60"
      style={{ 
  backgroundImage: "url('https://www.orchidhotel.com/static/website/img/hotels/panchgani/homepage_slider/homepage_slider.webp')" 
}}
    >
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20 text-center flex items-center justify-center min-h-screen">
        <h1 className="text-5xl font-bold text-white mb-4">
          Welcome to Hotel Booking System
        </h1>
      </section>
    </div>
  );
};
