import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import AOS from "aos";
import "aos/dist/aos.css";
import { FaMapMarkerAlt, FaTruck, FaClock, FaShieldAlt } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import BangladeshMap from "./BangladeshMap";
import { Link } from "react-router";
import UseAxious from "../Hooks/UseAxious";

const Home = () => {
  const [latestBooks, setLatestBooks] = useState([]);
  const axiosSecure = UseAxious();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, easing: "ease-in-out" });

    // ---- Fetch Latest 4 Published Books ----
    const fetchBooks = async () => {
      try {
        const res = await axiosSecure.get("/books");
        const publishedBooks = res.data.filter(book => book.status === "published");
        const data = publishedBooks.reverse().slice(0, 4); // last 4 published books
        setLatestBooks(data);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };

    fetchBooks();
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
      title: "Read Anywhere, Anytime",
      description:
        "Delivering books to your doorstep with care, across all major cities.",
      img: "https://images.unsplash.com/photo-1610116306796-6fea9f4fae38?w=600&auto=format&fit=crop&q=60",
    },
    {
      id: 2,
      title: "Fast & Safe Book Delivery",
      description: "Your favorite books are just one click away.",
      img: "https://static.vecteezy.com/system/resources/thumbnails/050/897/100/small/delivery-person-handing-a-cardboard-package-to-another-person-indoor-environment-photo.jpeg",
    },
    {
      id: 3,
      title: "Smart Library Delivery System",
      description: "BookCourier makes reading easier and smarter.",
      img: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?fm=jpg&q=60&w=3000",
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
                className="h-[400px] md:h-[500px] bg-cover bg-center flex flex-col items-center justify-center text-white px-6"
                style={{ backgroundImage: `url(${slide.img})` }}
              >
                <h2 className="text-4xl md:text-5xl font-bold drop-shadow-lg">
                  {slide.title}
                </h2>
                <p className="max-w-xl text-center mt-3 drop-shadow-lg text-lg">
                  {slide.description}
                </p>
                <Link to={"/Books"}>
                  <button className="btn btn-primary mt-5 animate-bounce">
                    All Books
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </Slider>
      </div>

      {/* Latest Books Section (Dynamic) */}
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center" data-aos="fade-up">
          Latest Books
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {latestBooks.map((book, idx) => (
            <Link to={`/Books/${book._id}`} key={book._id}>
              <div
                className="p-4 bg-white shadow-lg transform transition duration-500 hover:scale-105"
                data-aos="fade-up"
                data-aos-delay={`${idx * 200}`}
              >
                <img
                  src={book.img}
                  alt={book.title}
                  className="w-full h-56 object-cover"
                />
                <h3 className="mt-4 text-xl font-semibold text-center text-black">
                  {book.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Coverage Section */}
      <div className="bg-gray-100 m-10 py-10" data-aos="fade-right">
        <h2 className="text-3xl font-bold text-center mb-5 text-black">
          Service Coverage
        </h2>
        <div className="md:px-20">
          <BangladeshMap />
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="max-w-6xl mx-auto py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12" data-aos="fade-up">
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
              text: "Delivering in 10+ major cities.",
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
              className="p-6 bg-gray-100 text-black rounded-xl text-center shadow-lg"
              data-aos="zoom-in"
              data-aos-delay={`${idx * 200}`}
            >
              <div className="flex justify-center mb-4 text-blue-600">
                {item.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Extra Section 1 */}
      <div
        className="bg-blue-50 flex justify-center items-center px-10 py-5 text-center max-w-6xl mx-auto"
        data-aos="fade-up"
      >
        <div>
          <h2 className="text-3xl font-bold mb-4 text-black">
            Join Our Reading Community
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-700">
            Discover new books, share your reviews, and connect with fellow
            readers across Bangladesh.
          </p>
        </div>
        <div>
          <img
            className="shadow-2xl"
            src="https://img.freepik.com/free-photo/high-angle-people-reading-together_23-2150062128.jpg"
            alt=""
          />
        </div>
      </div>

      {/* Extra Section 2 */}
      <div
        className="py-5 flex gap-5 mb-10 flex-row-reverse justify-center items-center text-center max-w-6xl mx-auto px-10 bg-blue-50"
        data-aos="fade-up"
      >
        <div>
          <h2 className="text-3xl font-bold mb-4 text-black">
            Special Weekly Offers
          </h2>
          <p className="text-lg max-w-2xl mx-auto text-gray-700">
            Get exciting discounts every week on top-selling books.
          </p>
        </div>
        <div>
          <img
            className="shadow-2xl"
            src="https://thumbs.dreamstime.com/b/exclusive-special-offer-logo-illustration-389557948.jpg"
            alt=""
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
