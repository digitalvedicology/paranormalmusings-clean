'use client'

import { useState, useRef, useEffect } from 'react'
import ContactForm from './ContactForm'

export default function ContactFormModal() {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  const openModal = () => {
    setIsOpen(true)
    if (dialogRef.current) {
      dialogRef.current.showModal()
      document.body.style.overflow = 'hidden'
    }
  }

  const closeModal = () => {
    setIsOpen(false)
    if (dialogRef.current) {
      dialogRef.current.close()
      document.body.style.overflow = 'unset'
    }
  }

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      closeModal()
    }
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  return (
    <>
      {/* Get in Touch Button - Premium Styling */}
      <button
        onClick={openModal}
        className="group relative inline-block px-8 py-3.5 text-[15px] font-semibold text-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-2xl"
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-gold-600 via-gold-500 to-amber-600 transition-all duration-300 group-hover:from-gold-700 group-hover:via-gold-600 group-hover:to-amber-700" />

        {/* Shimmer Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-all duration-700" />

        {/* Button Text */}
        <div className="relative flex items-center gap-2">
          <span>Get in touch</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </div>
      </button>

      {/* Modal Dialog */}
      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 p-4 backdrop:bg-black/50 backdrop:backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl max-h-[90vh] overflow-y-auto [&::backdrop]:animate-in [&::backdrop]:fade-in [&::backdrop]:duration-300 animate-in zoom-in-95 fade-in duration-300"
      >
        {/* Modal Content */}
        <div className="relative bg-gradient-to-b from-paper via-paper to-mist/30 overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-gold-200/20 to-transparent rounded-full blur-3xl -z-10" />
          <div className="absolute -bottom-20 left-0 w-96 h-96 bg-gradient-to-tr from-gold-300/10 to-transparent rounded-full blur-3xl -z-10" />

          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 z-20 p-2.5 bg-white/80 hover:bg-gold-50 rounded-full transition-all duration-200 text-body hover:text-gold-600 shadow-md hover:shadow-lg group"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Modal Header - Premium Design */}
          <div className="relative bg-gradient-to-r from-gold-500/5 via-gold-400/10 to-amber-500/5 px-6 sm:px-10 py-10 sm:py-14 border-b border-gold-200/50">
            {/* Header Background Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

            <div className="relative">
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-gold-100 to-amber-100 mb-4">
                <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl text-ink mb-3 leading-tight">
                Get in touch
              </h2>
              <p className="text-body/80 text-[15px] sm:text-[16px] leading-relaxed max-w-lg">
                Share your paranormal experiences, ask questions, or just say hello. I&apos;d love to connect with you.
              </p>
            </div>
          </div>

          {/* Modal Body with Form */}
          <div className="relative px-6 sm:px-10 py-10 sm:py-12">
            <ContactForm onSuccess={() => closeModal()} />
          </div>

          {/* Modal Footer - Enhanced */}
          <div className="relative px-6 sm:px-10 py-5 border-t border-gold-100/60 bg-gradient-to-r from-gold-50/40 to-amber-50/30 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-gold-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <p className="text-[13px] text-body/75 leading-relaxed">
                <span className="font-semibold text-body/90">Your privacy is protected.</span> We only use your information to respond to your message. See our <a href="/privacy" className="text-gold-600 hover:text-gold-700 font-medium transition">Privacy Policy</a>.
              </p>
            </div>
          </div>
        </div>
      </dialog>
    </>
  )
}
