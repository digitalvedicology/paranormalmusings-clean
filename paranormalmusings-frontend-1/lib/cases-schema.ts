/**
 * Pre-authored JSON-LD (@graph: Organization, Person, WebSite, BlogPosting,
 * WebPage, BreadcrumbList) for each cases article, keyed by slug.
 * Source of truth is schema/cases/ at the repo root; these are a
 * synced copy so the deployed app (root directory paranormalmusings-frontend-1)
 * bundles them.
 */
import c_ghostOrSpiritPossessionOfPrateekCaseStudyNumber3 from './schema/cases/case-studies__ghost-or-spirit-possession-of-prateek-case-study-number-3.json'
import c_realCasesOfPossessionTheSaraAjmaniStory from './schema/cases/case-studies__real-cases-of-possession-the-sara-ajmani-story.json'
import c_realPossessionStoriesTheCuriousCaseOfPaarthMehta from './schema/cases/case-studies__real-possession-stories-the-curious-case-of-paarth-mehta.json'
import c_storyOfPossessionACaseStudyOfAnamika from './schema/cases/case-studies__story-of-possession-a-case-study-of-anamika.json'

export const casesArticleSchemas: Record<string, object> = {
  'ghost-or-spirit-possession-of-prateek-case-study-number-3': c_ghostOrSpiritPossessionOfPrateekCaseStudyNumber3,
  'real-cases-of-possession-the-sara-ajmani-story': c_realCasesOfPossessionTheSaraAjmaniStory,
  'real-possession-stories-the-curious-case-of-paarth-mehta': c_realPossessionStoriesTheCuriousCaseOfPaarthMehta,
  'story-of-possession-a-case-study-of-anamika': c_storyOfPossessionACaseStudyOfAnamika,
}
