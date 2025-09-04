// import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import imgOne from '../../assets/img-one.png';
import imgTwo from '../../assets/img-two.png';
import imgThree from '../../assets/img-three.png';
import FeaturedProducts from "./FeaturedProducts";

export const Home = () => {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [startX, setStartX] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const carouselRef = useRef<HTMLDivElement>(null);

  const slides = [
    {
      id: 1,
      src: imgOne,
      alt: "Men's Shirts Collection",
      title: "Men's Shirts for Everyday Style",
      subtitle: "Premium Quality & Comfort for All Occasions",
      buttonText: "Shop Now"
    },
    {
      id: 2,
      src: imgTwo,
      alt: "Men's Pants Collection",
      title: "Men's Pants for Modern Trends",
      subtitle: "Stylish & Durable for Long-Lasting Wear",
      buttonText: "Shop Now"
    },
    {
      id: 3,
      src: imgThree,
      alt: "Men's Shoes Collection",
      title: "Men's Shoes with Ultimate Comfort",
      subtitle: "Perfect Fit & Style for Every Step",
      buttonText: "Shop Now"
    }
  ];

  const nextSlide = (): void => {
    setCurrentSlide((prev: number) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = (): void => {
    setCurrentSlide((prev: number) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index: number): void => {
    setCurrentSlide(index);
  };

  // Touch and drag event handlers
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsDragging(true);
    if ('touches' in e) {
      setStartX(e.touches[0].clientX);
    } else {
      setStartX(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!isDragging) return;
    
    let currentX: number;
    if ('touches' in e) {
      currentX = e.touches[0].clientX;
    } else {
      currentX = e.clientX;
    }
    
    const diffX = startX - currentX;
    
    // If swipe is significant, change slide
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
      setIsDragging(false);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isDragging) {
        nextSlide();
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, isDragging]);

  return (
    <div className="w-full">
      <div 
        className="relative w-full overflow-hidden"
        ref={carouselRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <div className="relative h-screen overflow-hidden">
          {slides.map((slide, index: number) => (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentSlide ? 'opacity-100' : 'opacity-0'}`}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Text overlay for desktop - positioned on left */}
              <div className="hidden md:flex absolute inset-0 items-center">
                <div className="container mx-auto px-8">
                  <div className="max-w-md">
                    <h2 className="text-3xl text-white font-bold mb-2">{slide.title}</h2>
                    <p className="text-xl text-white mb-6">{slide.subtitle}</p>
                    <Link
                      to="/products"
                      className="inline-block bg-white text-black px-6 py-3 rounded-md hover:bg-gray-100 transition-colors duration-300"
                    >
                      {slide.buttonText}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Text overlay for mobile - positioned below image */}
              <div className="md:hidden absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
                <div className="max-w-md mx-auto">
                  <h2 className="text-2xl md:text-3xl text-white font-bold mb-2">{slide.title}</h2>
                  <p className="text-lg md:text-xl text-white mb-6">{slide.subtitle}</p>
                  <Link
                    to="/products"
                    className="inline-block bg-white text-black px-6 py-3 rounded-md hover:bg-gray-100 transition-colors duration-300"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation dots */}
        <div className="absolute z-30 flex space-x-3 -translate-x-1/2 bottom-5 left-1/2">
          {slides.map((_, index: number) => (
            <button
              key={index}
              type="button"
              className={`w-3 h-3 rounded-full transition-colors ${index === currentSlide ? 'bg-white' : 'bg-white/50 hover:bg-white/70'}`}
              aria-current={index === currentSlide ? 'true' : 'false'}
              aria-label={`Slide ${index + 1}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        {/* <button
          type="button"
          className="absolute top-1/2 left-4 z-30 flex items-center justify-center w-10 h-10 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/70 transition-all"
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          type="button"
          className="absolute top-1/2 right-4 z-30 flex items-center justify-center w-10 h-10 -translate-y-1/2 rounded-full bg-black/30 hover:bg-black/50 focus:outline-none focus:ring-2 focus:ring-white/70 transition-all"
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button> */}
      </div>

      <div className="container mx-auto px-4 py-8">
        <FeaturedProducts />
      </div>
    </div>
  );
};