import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Pagination, Autoplay } from "swiper/modules";

const MovieCarousel = ({ images }) => {
  return (
    <div className="relative w-full h-48">
      <Swiper
        spaceBetween={10}        // Space between slides
        slidesPerView={1}        // Display one slide at a time
        pagination={{ clickable: true }} // Enable pagination with clickable dots
        autoplay={{
          delay: 3000,           // Time interval between slides (in milliseconds)
          disableOnInteraction: false, // Continue autoplay even after user interacts
        }}
        loop={images.length > 1}  // Ensure looping only if multiple images
        modules={[Pagination, Autoplay]}  // Required modules for pagination and autoplay
        className="movie-carousel"
        style={{ height: "100%", width: "100%" }}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img
              src={image}
              alt={`movie-image-${index}`}
              className="w-full h-full object-cover rounded-md"  // Ensures image fits the slide area
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default MovieCarousel;
