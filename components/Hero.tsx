"use client";

import { useEffect, useState, useCallback } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { getHeroSlides, type HeroSlide } from "@/utils/supabase/heroes";
import MediaImage from "@/components/MediaImage";

const AUTOPLAY_MS = 5000;

const heroHeightClass =
  "h-[475px] min-h-[475px] sm:h-[575px] sm:min-h-[575px] md:h-[calc(65vh+10px)] lg:h-[calc(72vh+10px)] max-h-[835px]";

const Hero = ({
  initialSlides = [],
  titleAs = "h2",
}: {
  initialSlides?: HeroSlide[];
  titleAs?: "h1" | "h2";
}) => {
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);
  const [loading, setLoading] = useState(initialSlides.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (initialSlides.length > 0) {
      return;
    }

    let cancelled = false;

    const loadSlides = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getHeroSlides(3);
        if (!cancelled) {
          setSlides(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load hero slides."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSlides();

    return () => {
      cancelled = true;
    };
  }, [initialSlides.length]);

  const goToSlide = useCallback(
    (index: number) => {
      if (slides.length === 0) return;
      setCurrent((index + slides.length) % slides.length);
    },
    [slides.length]
  );

  useEffect(() => {
    if (slides.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);

    return () => clearInterval(timer);
  }, [slides.length, isPaused]);

  if (loading) {
    return (
      <section
        aria-hidden="true"
        className={`w-full animate-pulse bg-gray-200 ${heroHeightClass}`}
      />
    );
  }

  if (error || slides.length === 0) return null;

  const activeSlide = slides[current];
  const TitleTag = titleAs;

  return (
    <section
      className="relative w-full overflow-hidden bg-white"
      aria-roledescription="carousel"
      aria-label="Featured highlights"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className={`relative overflow-hidden ${heroHeightClass}`}>
        <div className="absolute inset-0 z-10">
          <MediaImage
            src={activeSlide.image}
            alt={activeSlide.title || `Slide ${current + 1}`}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
        </div>

        {slides.length > 1 ? (
          <>
            <button
              type="button"
              onClick={() => goToSlide(current - 1)}
              aria-label="Previous slide"
              className="absolute left-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-transparent text-white backdrop-blur-[2px] transition hover:border-white/60 hover:bg-white/10 sm:left-6"
            >
              <FaChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => goToSlide(current + 1)}
              aria-label="Next slide"
              className="absolute right-4 top-1/2 z-30 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-transparent text-white backdrop-blur-[2px] transition hover:border-white/60 hover:bg-white/10 sm:right-6"
            >
              <FaChevronRight className="h-4 w-4" />
            </button>
          </>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 z-20 px-4 pb-6 pt-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl items-end justify-between gap-6">
            <div className="min-w-0 flex-1">
              {activeSlide.title && (
                <TitleTag
                  className="text-xl font-semibold uppercase leading-snug tracking-wide text-white sm:text-2xl md:text-3xl"
                  style={{
                    WebkitTextStroke: "1px rgba(0, 0, 0, 0.6)",
                    paintOrder: "stroke fill",
                    textShadow: "0 2px 10px rgba(0, 0, 0, 0.35)",
                  }}
                >
                  {activeSlide.title}
                </TitleTag>
              )}
              {slides.length > 1 && (
                <p
                  className="mt-2 text-sm text-white/80"
                  style={{ textShadow: "0 1px 4px rgba(0, 0, 0, 0.4)" }}
                >
                  Slide {current + 1} of {slides.length}
                </p>
              )}
            </div>

            {slides.length > 1 && (
              <div className="flex shrink-0 items-center gap-2.5 pb-1">
                {slides.map((slide, index) => (
                  <button
                    key={slide.id}
                    type="button"
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    aria-current={index === current ? "true" : undefined}
                    className={[
                      "rounded-full transition-all duration-300",
                      index === current
                        ? "h-2 w-8 bg-white"
                        : "h-2 w-2 bg-white/40 hover:bg-white/65",
                    ].join(" ")}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
