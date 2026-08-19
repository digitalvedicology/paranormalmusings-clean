'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowRight } from '../icons'
import { heroSlides } from './heroSlides'
// The hero runs on the client, so the byline is handed down rather than fetched.

const DELAY = 7000 /* matches the dot-fill animation */

export default function Hero({ author }: { author: string }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  /* Slides whose photograph is missing fall back to their drawn backdrop. */
  const [missingArt, setMissingArt] = useState<number[]>([])

  const heroRef = useRef<HTMLElement>(null)
  const dotsRef = useRef<HTMLDivElement>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const reduced = useRef(false)

  useEffect(() => {
    reduced.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }, [])

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    timer.current = null
    setPlaying(false)
  }, [])

  const play = useCallback(() => {
    if (timer.current) clearInterval(timer.current)
    if (reduced.current) return
    setPlaying(true)
    timer.current = setInterval(() => setIndex((i) => (i + 1) % heroSlides.length), DELAY)
  }, [])

  const go = useCallback(
    (next: number) => {
      setIndex(((next % heroSlides.length) + heroSlides.length) % heroSlides.length)
      play()
    },
    [play],
  )

  /* Restart the progress fill whenever the active slide changes. */
  useEffect(() => {
    dotsRef.current?.querySelectorAll<HTMLElement>('.hdot i').forEach((bar) => {
      bar.style.animation = 'none'
      void bar.offsetWidth
      bar.style.animation = ''
    })
  }, [index])

  useEffect(() => {
    play()
    return stop
  }, [play, stop])

  /* Hold on a background tab, arrow keys while the hero is still on screen. */
  useEffect(() => {
    const onVisibility = () => (document.hidden ? stop() : play())
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      const hero = heroRef.current
      if (!hero || hero.getBoundingClientRect().bottom < 140) return
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName ?? '')) return
      setIndex((i) => (i + (e.key === 'ArrowRight' ? 1 : -1) + heroSlides.length) % heroSlides.length)
      play()
    }
    document.addEventListener('visibilitychange', onVisibility)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
      document.removeEventListener('keydown', onKey)
    }
  }, [play, stop])

  /* Swipe */
  const touchX = useRef<number | null>(null)
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.changedTouches[0].clientX
    stop()
  }
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return
    const dx = e.changedTouches[0].clientX - touchX.current
    if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1))
    else play()
    touchX.current = null
  }

  return (
    <section
      id="hero"
      ref={heroRef}
      className={`relative w-full overflow-hidden bg-night-900${playing ? ' hero-playing' : ''}`}
      aria-roledescription="carousel"
      aria-label="Featured stories"
      onMouseEnter={stop}
      onMouseLeave={play}
      onFocus={stop}
      onBlur={play}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <div className="hero-stage relative w-full">
        {heroSlides.map((slide, i) => {
          const Heading = slide.headingLevel
          const active = i === index
          return (
            <article
              key={i}
              className={`hslide${active ? ' is-active' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${heroSlides.length}`}
            >
              <div className={`art ${slide.art}`}>
                {slide.silhouette}
                <span className="fog fog-a" />
                <span className="fog fog-b" />
              </div>

              {!missingArt.includes(i) && (
                <img
                  src={slide.image}
                  alt=""
                  className="moody"
                  onError={() => setMissingArt((prev) => (prev.includes(i) ? prev : [...prev, i]))}
                />
              )}

              <div className="hslide-scrim" />

              <div className="wrap absolute inset-0 flex items-center">
                <div className="hslide-copy max-w-[900px] pb-24 sm:pb-28">
                  <span className="inline-flex items-center gap-2 rounded-full glass text-white px-4 py-1.5 label">
                    {slide.eyebrow} <span className="opacity-50">•</span> {slide.readTime}
                  </span>

                  <Heading
                    className={
                      slide.headingLevel === 'h1'
                        ? 'mt-6 font-extrabold tracking-[-0.03em] text-white uppercase leading-[0.94] text-[38px] sm:text-[56px] lg:text-[68px] xl:text-[80px]'
                        : 'mt-6 font-extrabold tracking-[-0.03em] text-white uppercase leading-[0.96] text-[34px] sm:text-[48px] lg:text-[58px] xl:text-[66px]'
                    }
                  >
                    {slide.headline}
                  </Heading>

                  <p className="mt-6 max-w-xl text-[15.5px] lg:text-[17px] leading-[1.65] text-white/70">
                    {slide.excerpt}
                  </p>

                  {slide.byline && (
                    <div className="mt-7 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] text-white/55">
                      <span className="font-semibold text-white/85">{author}</span>
                      <span className="opacity-50">•</span>
                      <span>{slide.byline.date}</span>
                      {slide.byline.extra && (
                        <>
                          <span className="opacity-50">•</span>
                          <span>{slide.byline.extra}</span>
                        </>
                      )}
                    </div>
                  )}

                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <a
                      href={slide.cta.href}
                      className="link-arrow inline-flex items-center gap-2 h-12 px-6 rounded-full bg-gold-500 text-white text-[14px] font-semibold hover:bg-gold-600 transition shadow-soft"
                    >
                      {slide.cta.label}
                      <ArrowRight />
                    </a>
                    {slide.secondaryCta && (
                      <a
                        href={slide.secondaryCta.href}
                        className="link-arrow inline-flex items-center gap-2 h-12 px-6 rounded-full glass text-white text-[14px] font-semibold hover:bg-white/20 transition"
                      >
                        {slide.secondaryCta.label}
                        <ArrowRight />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </article>
          )
        })}

        {/* ── FLOATING CHIP ────────────────────────────────────────────── */}
        <div className="wrap pointer-events-none absolute inset-x-0 top-7 hidden lg:block">
          <div className="flex justify-end">
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-2.5">
              <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-gold-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round">
                <path d="m12 3.5 2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9L3.5 9.7l5.9-.8L12 3.5Z" />
              </svg>
              <span className="text-[13.5px] font-semibold text-white">Editor&rsquo;s Pick</span>
            </div>
          </div>
        </div>

        {/* ── CONTROLS ─────────────────────────────────────────────────── */}
        <div className="wrap absolute inset-x-0 bottom-0 pb-7 sm:pb-9">
          <div className="flex items-end justify-between gap-6">
            <div className="flex items-center gap-4 sm:gap-5">
              <div ref={dotsRef} className="flex items-center gap-2.5" role="tablist" aria-label="Choose slide">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => go(i)}
                    className={`hdot${i === index ? ' is-active' : ''}`}
                    role="tab"
                    aria-selected={i === index}
                    aria-label={`Slide ${i + 1}`}
                  >
                    <span className="w-10 sm:w-14">
                      <i />
                    </span>
                  </button>
                ))}
              </div>
              <p className="text-[13px] font-semibold text-white/80">
                <span>{String(index + 1).padStart(2, '0')}</span>
                <span className="text-white/35"> / {String(heroSlides.length).padStart(2, '0')}</span>
              </p>
              <a
                href="#highlights"
                className="scroll-cue hidden md:inline-flex items-center gap-2 text-[12px] font-semibold tracking-label uppercase text-white/55 hover:text-white transition"
              >
                Scroll
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v13M6 13l6 6 6-6" />
                </svg>
              </a>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="glass rounded-2xl px-4 py-3 hidden xl:flex items-center gap-2.5 mr-2">
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-gold-300" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <circle cx="12" cy="12" r="8.5" />
                  <path d="M12 7.5V12l3 1.8" />
                </svg>
                <span className="text-[13.5px] font-semibold text-white">25+ years in the field</span>
              </div>
              <button
                onClick={() => go(index - 1)}
                aria-label="Previous slide"
                className="glass glass-btn grid place-items-center w-12 h-12 rounded-full text-white"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 5l-7 7 7 7" />
                </svg>
              </button>
              <button
                onClick={() => go(index + 1)}
                aria-label="Next slide"
                className="glass glass-btn grid place-items-center w-12 h-12 rounded-full text-white"
              >
                <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
