/**
 * Article bodies are lists of blocks rather than blobs of HTML, so the measure,
 * rhythm and heading style stay under the layout's control. Kept separate from
 * content.ts so the article files can import the type without a cycle.
 */
export type Block =
  /** `tone: 'note'` sets the section apart as an advisory aside. */
  | { type: 'h2'; text: string; tone?: 'note' }
  /** A named point inside a section — only h2 opens a new section. */
  | { type: 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'list'; items: string[] }

export const headingId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

export type ArticleSection = { id: string; title: string; tone?: 'note'; blocks: Block[] }

/**
 * Splits a flat body into the paragraphs before the first heading and the
 * sections after it, giving each heading an anchor id.
 */
export function articleSections(body: Block[]) {
  const intro: Block[] = []
  const sections: ArticleSection[] = []

  for (const block of body) {
    if (block.type === 'h2') {
      sections.push({ id: headingId(block.text), title: block.text, tone: block.tone, blocks: [] })
    } else if (sections.length) {
      sections[sections.length - 1].blocks.push(block)
    } else {
      intro.push(block)
    }
  }

  return { intro, sections }
}

/**
 * The closing advisory Praveen appends to most posts — urging readers toward
 * qualified medical care first. Two wordings appear in the source, so both are
 * kept rather than flattened into one.
 */
export const advice = (variant: 'standard' | 'symptoms' = 'standard'): Block[] => [
  { type: 'h2', text: 'My advice to you', tone: 'note' },
  {
    type: 'p',
    text:
      'Please remember that any physical or emotional discomforts a person experiences can mostly be due to various diseases or emotional conditions he or she is going through. I have seen that majority of cases do not involve paranormal activity of any kind. Paranormal events are extremely rare occurrences. Hence your problems should be first brought to the notice of a qualified medical practitioner. I have often seen that the line between borderline personality disorders or other psychiatric disorders and “spirit possession” is thin. ' +
      (variant === 'symptoms'
        ? 'Hence as a paranormal investigator, you should advise your clients that professional medical care is the first solution or remedy for any physical or emotional discomfort.'
        : 'Hence a good paranormal investigator should advise his clients that professional medical care is the first solution or remedy for any physical or emotional discomfort.'),
  },
  {
    type: 'p',
    text:
      'Remember, you need to be a sceptic first to develop into a paranormal investigator. You need to rule out every single scientific possibility that is known to mankind to identify anything that is paranormal. Hence travel through the path of modern science, explore and unravel all facts using data and what cannot be explained through science is what we need to explore more through the paranormal arena. Most of your clients may feel desperate due to whatever they are going through. It’s your duty to act responsibly. Guide them through the path of modern science. Refrain from being a doctor or healer. There are qualified medical practitioners out there who can do their job well. ' +
      (variant === 'symptoms'
        ? 'Avoid any forms of advice on religious, spiritual or cultural rituals or for that matter any ritualistic practices.'
        : 'Avoid any forms of advice on religious or cultural rituals or for that matter any ritualistic practices.'),
  },
]
