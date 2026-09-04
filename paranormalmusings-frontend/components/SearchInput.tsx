'use client'

export default function SearchInput() {
  return (
    <input
      type="search"
      placeholder="Search articles…"
      className="flex-1 outline-none bg-transparent text-ink placeholder:text-muted"
      onFocus={(e) => {
        const searchButton = document.querySelector('[aria-label="Search"]') as HTMLButtonElement
        if (searchButton) searchButton.click()
        e.currentTarget.blur()
      }}
    />
  )
}
