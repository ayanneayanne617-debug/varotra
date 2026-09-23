import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { activeStore } = useApp();
  const slides = activeStore.theme.bannerSlides || [];
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  // Auto-rotate slides every 6 seconds if multiple
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const currentSlide = slides[currentSlideIndex] || slides[0];

  const handleNext = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const scrollToCatalog = () => {
    const el = document.getElementById('catalog-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-white max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-2">
      <div className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 min-h-[280px] sm:min-h-[380px] md:min-h-[420px] flex items-center">
        {/* Background Image with refined gradient overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={currentSlide.imageUrl}
            alt={currentSlide.title}
            className="w-full h-full object-cover object-center transition-all duration-700 transform scale-105"
          />
          {/* Multi-layered dark-to-translucent gradient for maximum legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent sm:hidden" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 p-5 sm:p-10 md:p-14 max-w-2xl text-white">
          {/* Category Badge (Green highlight) */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/90 text-white text-xs sm:text-sm font-bold backdrop-blur-md mb-3 sm:mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            <span>{currentSlide.categoryBadge}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white mb-2 sm:mb-4 drop-shadow-md">
            {currentSlide.title}
          </h2>

          {/* Description */}
          <p className="text-xs sm:text-base text-slate-100/95 font-medium leading-relaxed max-w-xl mb-5 sm:mb-8 line-clamp-3 sm:line-clamp-none">
            {currentSlide.description}
          </p>

          {/* Orange Action Button */}
          <div>
            <button
              onClick={scrollToCatalog}
              className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-extrabold text-xs sm:text-base px-5 sm:px-7 py-3 sm:py-3.5 rounded-2xl shadow-xl hover:shadow-orange-600/30 transition duration-150 group"
            >
              <span>{currentSlide.buttonText || 'Découvrir la boutique'}</span>
              <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Arrows if multiple slides */}
        {slides.length > 1 && (
          <div className="hidden sm:flex absolute right-4 bottom-4 z-20 items-center gap-2">
            <button
              onClick={handlePrev}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition border border-white/20"
              aria-label="Slide précédente"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white flex items-center justify-center transition border border-white/20"
              aria-label="Slide suivante"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Slide indicator dots */}
        {slides.length > 1 && (
          <div className="absolute bottom-3 sm:bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlideIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentSlideIndex
                    ? 'w-7 h-2 bg-orange-500'
                    : 'w-2 h-2 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Aller au slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
