import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import reviewsData from '../../assets/reviewsData';


const TestimonialLanding = () => {
  return (
    <section className="testimonial-container">
      <div className="testimonial-title">
        <h1>Customer Experiences</h1>
      </div>

      <div className="slider-container">
        <Splide
          options={{
            perPage: 3,
            gap: '2rem',
            breakpoints: {
              768: {
                perPage: 1,
              },
              1024: {
                perPage: 2,
              },
            },
            autoplay: true,
            speed: 1000,
            rewind: true,
            rewindByDrag: true,
            pagination: true,
            arrows: true,
          }}
        >
          {reviewsData.map((review) => (
            <SplideSlide key={review.id}>
              <div className="testimonial-card">
                <div className="testimonial-img-container">
                  <img className="review-img" src={review.image} alt={review.name} />
                  <div className="user-info">
                    <h4 className="user">{review.name}</h4>
                    <p className="position">{review.position}</p>
                    <div className="rating">
                      {[...Array(review.rating)].map((_, index) => (
                        <span key={index} className="star">&#9733;</span>
                      ))}
                      {[...Array(5 - review.rating)].map((_, index) => (
                        <span key={index} className="star inactive">&#9733;</span>
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text">{review.text}</p>
              </div>
            </SplideSlide>
          ))}
        </Splide>
      </div>
    </section>
  );
};

export default TestimonialLanding;