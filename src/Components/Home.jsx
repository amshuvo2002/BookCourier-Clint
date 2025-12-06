import React, { useEffect } from "react";
import Slider from "react-slick";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaMapMarkerAlt, FaTruck, FaClock, FaShieldAlt } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BangladeshMap from "./BangladeshMap";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-in-out" });
  }, []);

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 600,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: true,
  };

  const bannerSlides = [
    {
      id: 1,
      title: "Fast & Safe Book Delivery",
      description:
        "Delivering books to your doorstep with care, across all major cities.",
      img: "https://i.ibb.co.com/pWWLM3m/book3.jpg",
    },
    {
      id: 2,
      title: "Read Anywhere, Anytime",
      description: "Your favorite books are just one click away.",
      img: "https://i.ibb.co.com/r2Sc0pw/library-banner-2.jpg",
    },
    {
      id: 3,
      title: "Smart Library Delivery System",
      description: "BookCourier makes reading easier and smarter.",
      img: "https://i.ibb.co.com/8Nrk7Lz/library-banner-3.jpg",
    },
    {
      id: 4,
      title: "Join Our Book Community",
      description: "Connect with fellow readers and share your love for books.",
      img: "https://i.ibb.co.com/pWWLM3m/book3.jpg",
    },
    {
      id: 5,
      title: "Weekly Book Offers",
      description: "Grab exciting discounts on top books every week.",
      img: "https://i.ibb.co.com/r2Sc0pw/library-banner-2.jpg",
    },
    {
      id: 6,
      title: "Library-To-Home Service",
      description:
        "Get books from your library delivered directly to your home.",
      img: "https://i.ibb.co.com/8Nrk7Lz/library-banner-3.jpg",
    },
  ];

  const latestBooks = [
    {
      id: 1,
      title: "The Silent Echo",
      img: "https://i.ibb.co.com/pWWLM3m/book3.jpg",
    },
    {
      id: 2,
      title: "Whispers of Time",
      img: "https://i.ibb.co.com/L8LXxr1/book2.jpg",
    },
    {
      id: 3,
      title: "Winds of Destiny",
      img: "https://i.ibb.co.com/QHYfJ0f/book1.jpg",
    },
    {
      id: 4,
      title: "Journey Beyond",
      img: "https://i.ibb.co.com/pWWLM3m/book3.jpg",
    },
  ];

  return (
    <div className="space-y-24">
      {/* Banner Section */}
      <div className="max-w-6xl mx-auto mt-10" data-aos="fade-up">
        <Slider {...sliderSettings}>
          {bannerSlides.map((slide) => (
            <div key={slide.id}>
              <div
                className="h-[400px] md:h-[500px] bg-cover bg-center rounded-xl flex flex-col items-center justify-center text-white px-6"
                style={{ backgroundImage: `url(${slide.img})` }}
              >
                <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="max-w-xl text-center mt-3 drop-shadow-lg text-lg">
                  {slide.description}
                </p>
                <button className="btn btn-primary mt-5 animate-bounce">
                  All Books
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Latest Books Section */}
      <div className="max-w-6xl mx-auto px-4">
        <h2
          className="text-3xl font-bold mb-8 text-center text-black"
          data-aos="fade-up"
        >
          Latest Books
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {latestBooks.map((book, idx) => (
            <div
              key={book.id}
              className="p-4 bg-white rounded-xl shadow-lg transform transition duration-500 hover:scale-105"
              data-aos="fade-up"
              data-aos-delay={`${idx * 200}`}
            >
              <img
                src={book.img}
                alt={book.title}
                className="w-full h-56 object-cover rounded-lg"
              />
              <h3 className="mt-4 text-xl font-semibold text-center text-black">
                {book.title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Coverage Section */}
      <div className="bg-gray-100 py-10" data-aos="fade-right">
        <div>
          {" "}
          <h2 className="text-3xl font-bold text-center mb-5 text-black">
            Service Coverage
          </h2>
        </div>
        <div className="px-20">
          <BangladeshMap></BangladeshMap>
        </div>
      </div>

      {/* Why Choose BookCourier */}
      <div className="max-w-6xl mx-auto py-20 px-4">
        <h2
          className="text-3xl font-bold text-center mb-12 text-black"
          data-aos="fade-up"
        >
          Why Choose BookCourier?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <FaTruck size={40} />,
              title: "Fast Delivery",
              text: "Quick book delivery to your doorstep.",
            },
            {
              icon: <FaMapMarkerAlt size={40} />,
              title: "Wide Coverage",
              text: "Delivering in 50+ major cities.",
            },
            {
              icon: <FaClock size={40} />,
              title: "24/7 Support",
              text: "Always ready to help you.",
            },
            {
              icon: <FaShieldAlt size={40} />,
              title: "Secure Handling",
              text: "Books handled with extra care.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-6 bg-white rounded-xl text-center shadow-lg"
              data-aos="zoom-in"
              data-aos-delay={`${idx * 200}`}
            >
              <div className="flex justify-center mb-4 text-blue-600">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-black">
                {item.title}
              </h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Extra Section 1 */}
      <div
        className="bg-blue-50 py-20 text-center rounded-xl max-w-6xl mx-auto px-4"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold mb-4 text-black">
          Join Our Reading Community
        </h2>
        <p className="text-lg max-w-2xl mx-auto text-gray-700">
          Discover new books, share your reviews, and connect with fellow
          readers across Bangladesh.
        </p>
      </div>

      {/* Extra Section 2 */}
      <div
        className="py-20 text-center max-w-6xl mx-auto px-4 bg-blue-50 rounded-xl"
        data-aos="fade-up"
      >
        <h2 className="text-3xl font-bold mb-4 text-black">
          Special Weekly Offers
        </h2>
        <p className="text-lg max-w-2xl mx-auto text-gray-700">
          Get exciting discounts every week on top-selling books. Stay tuned and
          grab your favorite books now!
        </p>
      </div>
    </div>
  );
};

export default Home;
