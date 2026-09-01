'use client'

import { useState, useRef, useEffect } from 'react'
import ContactForm from './ContactForm'

export default function ContactFormModal() {
  const [isOpen, setIsOpen] = useState(false)
  const dialogRef = useRef<HTMLDialogElement>(null)

  // Handle opening the modal
  const openModal = () => {
    setIsOpen(true)
    if (dialogRef.current) {
      dialogRef.current.showModal()
      document.body.style.overflow = 'hidden'
    }
  }

  // Handle closing the modal
  const closeModal = () => {
    setIsOpen(false)
    if (dialogRef.current) {
      dialogRef.current.close()
      document.body.style.overflow = 'unset'
    }
  }

  // Close modal when clicking outside (on backdrop)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      closeModal()
    }
  }

  // Close on Escape key
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
      {/* Get in Touch Button */}
      <button
        onClick={openModal}
        className="inline-block px-6 py-3 bg-gradient-to-r from-gold-600 to-gold-500 text-paper rounded-lg font-semibold hover:from-gold-700 hover:to-gold-600 transition-all duration-300 text-[15px] shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
      >
        Get in touch
      </button>

      {/* Modal Dialog */}
      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        className="fixed inset-0 z-50 p-4 backdrop:bg-black/40 backdrop:backdrop-blur-sm rounded-2xl shadow-2xl max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in duration-300"
      >
        {/* Modal Content */}
        <div className="relative bg-paper">
          {/* Close Button */}
          <button
            onClick={closeModal}
            className="absolute top-6 right-6 z-10 p-2 hover:bg-gold-50 rounded-full transition text-body hover:text-gold-600"
            aria-label="Close"
          >
            <svg
              className="w-6 h-6"
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

          {/* Modal Header */}
          <div className="bg-gradient-to-r from-mist via-gold-50 to-gold-100 px-6 sm:px-8 py-8 sm:py-10 rounded-t-2xl border-b border-gold-200">
            <h2 className="font-display text-2xl sm:text-3xl text-ink mb-2">
              Get in touch
            </h2>
            <p className="text-body/75 text-[14px] sm:text-[15px]">
              Share your paranormal experiences or ask a question. I&apos;d love to hear from you.
            </p>
          </div>

          {/* Modal Body with Form */}
          <div className="px-6 sm:px-8 py-8 sm:py-10">
            <ContactForm onSuccess={() => closeModal()} />
          </div>

          {/* Modal Footer */}
          <div className="px-6 sm:px-8 py-4 border-t border-gold-100 bg-mist/50 rounded-b-2xl">
            <p className="text-[12px] text-body/60">
              ✓ Your privacy is protected — we only use your information to respond to your message.
            </p>
          </div>
        </div>
      </dialog>
    </>
  )
}
