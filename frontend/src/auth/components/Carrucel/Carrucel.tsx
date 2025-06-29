import React, { useState, useEffect } from 'react';
import '../../style/Carousel.css'; // Importamos los estilos del carrusel

const Carousel = () => {
    const slides = [
        "/20210129_144719.jpg",
        "/CASAFAI013.jpg",
        "/DRONE-16.jpg",
        "/IMG_8301.JPG",
        "/IMG_9275.jpg",
        "/MEDINAMAS-LAALMONA-49A.jpg"
    ];
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [slides.length]);

    return (
        <div className="carousel">
            {slides.map((slide, index) => (
                <div
                    key={index}
                    className={`carousel-slide ${index === currentSlide ? 'active' : ''}`}
                    style={{ backgroundImage: `url(../${slide})` }}
                ></div>
            ))}
        </div>
    );
};

export default Carousel;
