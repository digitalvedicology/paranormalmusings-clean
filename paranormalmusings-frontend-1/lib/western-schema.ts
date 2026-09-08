/**
 * Pre-authored JSON-LD (@graph: Organization, Person, WebSite, BlogPosting,
 * WebPage, BreadcrumbList) for each western article, keyed by slug.
 * Source of truth is schema/western/ at the repo root; these are a
 * synced copy so the deployed app (root directory paranormalmusings-frontend-1)
 * bundles them.
 */
import w_canGhostKillUs from './schema/western/western-views__can-ghost-kill-us.json'
import w_causeOfHauntings from './schema/western/western-views__cause-of-hauntings.json'
import w_conceptOfResurrectionAndJudgementDay from './schema/western/western-views__concept-of-resurrection-and-judgement-day.json'
import w_ghostEntryHowToProtectYourselfFromPossession from './schema/western/western-views__ghost-entry-how-to-protect-yourself-from-possession.json'
import w_ghostPossessionEffects from './schema/western/western-views__ghost-possession-effects.json'
import w_hauntingPlaceWhatAreSomeOfTheHauntedPlacesWhereParanormalAc from './schema/western/western-views__haunting-place-what-are-some-of-the-haunted-places-where-paranormal-ac.json'
import w_historicalObservationsOfSpiritPossession from './schema/western/western-views__historical-observations-of-spirit-possession.json'
import w_howToConnectWithYourSpiritGuides from './schema/western/western-views__how-to-connect-with-your-spirit-guides.json'
import w_howToGetRidOfSpiritsInYourHouse from './schema/western/western-views__how-to-get-rid-of-spirits-in-your-house.json'
import w_howToHelpAGhost from './schema/western/western-views__how-to-help-a-ghost.json'
import w_howToProtectYourselfFromGhostsAndBadSpirits from './schema/western/western-views__how-to-protect-yourself-from-ghosts-and-bad-spirits.json'
import w_howToTalkToAGhost from './schema/western/western-views__how-to-talk-to-a-ghost.json'
import w_isAGhostReal from './schema/western/western-views__is-a-ghost-real.json'
import w_mostHauntedPlaces from './schema/western/western-views__most-haunted-places.json'
import w_psychicChildren from './schema/western/western-views__psychic-children.json'
import w_psychicReadingsWhatDoesHinduismSayAboutPsychicReading from './schema/western/western-views__psychic-readings-what-does-hinduism-say-about-psychic-reading.json'
import w_scienceOfTheParanormal from './schema/western/western-views__science-of-the-paranormal.json'
import w_signsOfHaunting from './schema/western/western-views__signs-of-haunting.json'
import w_signsOfPossession from './schema/western/western-views__signs-of-possession.json'
import w_signsOfSpiritPossessionMentalAndEmotionalSymptoms from './schema/western/western-views__signs-of-spirit-possession-mental-and-emotional-symptoms.json'
import w_spiritPossessionInHinduism from './schema/western/western-views__spirit-possession-in-hinduism.json'
import w_symptomsOfSpiritPossession from './schema/western/western-views__symptoms-of-spirit-possession.json'
import w_typesOfGhostsSpiritsDemonsEntities from './schema/western/western-views__types-of-ghosts-spirits-demons-entities.json'
import w_typesOfHauntingsWhatAreDifferentTypesOfHaunting from './schema/western/western-views__types-of-hauntings-what-are-different-types-of-haunting.json'
import w_typesOfSpiritGuides from './schema/western/western-views__types-of-spirit-guides.json'
import w_whatAreAngels from './schema/western/western-views__what-are-angels.json'
import w_whatAreChildrenSpirits from './schema/western/western-views__what-are-children-spirits.json'
import w_whatAreDemons from './schema/western/western-views__what-are-demons.json'
import w_whatAreOrbs from './schema/western/western-views__what-are-orbs.json'
import w_whatAreSpiritGuides from './schema/western/western-views__what-are-spirit-guides.json'
import w_whatIsAGhost from './schema/western/western-views__what-is-a-ghost.json'
import w_whatIsAPoltergeistWhatAreTheyAndWhyShouldYouStayAway from './schema/western/western-views__what-is-a-poltergeist-what-are-they-and-why-should-you-stay-away.json'
import w_whatIsAnAddictedGhost from './schema/western/western-views__what-is-an-addicted-ghost.json'
import w_whatIsChannelling from './schema/western/western-views__what-is-channelling.json'
import w_whatIsDepossessionTherapy from './schema/western/western-views__what-is-depossession-therapy.json'
import w_whatIsHaunting from './schema/western/western-views__what-is-haunting.json'
import w_whatIsParanormalAnIntroduction from './schema/western/western-views__what-is-paranormal-an-introduction.json'
import w_whatIsPossession from './schema/western/western-views__what-is-possession.json'
import w_whatsAfterDeath from './schema/western/western-views__whats-after-death.json'
import w_whyDoSpiritsRemainAmongUs from './schema/western/western-views__why-do-spirits-remain-among-us.json'

export const westernArticleSchemas: Record<string, object> = {
  'can-ghost-kill-us': w_canGhostKillUs,
  'cause-of-hauntings': w_causeOfHauntings,
  'concept-of-resurrection-and-judgement-day': w_conceptOfResurrectionAndJudgementDay,
  'ghost-entry-how-to-protect-yourself-from-possession': w_ghostEntryHowToProtectYourselfFromPossession,
  'ghost-possession-effects': w_ghostPossessionEffects,
  'haunting-place-what-are-some-of-the-haunted-places-where-paranormal-ac': w_hauntingPlaceWhatAreSomeOfTheHauntedPlacesWhereParanormalAc,
  'historical-observations-of-spirit-possession': w_historicalObservationsOfSpiritPossession,
  'how-to-connect-with-your-spirit-guides': w_howToConnectWithYourSpiritGuides,
  'how-to-get-rid-of-spirits-in-your-house': w_howToGetRidOfSpiritsInYourHouse,
  'how-to-help-a-ghost': w_howToHelpAGhost,
  'how-to-protect-yourself-from-ghosts-and-bad-spirits': w_howToProtectYourselfFromGhostsAndBadSpirits,
  'how-to-talk-to-a-ghost': w_howToTalkToAGhost,
  'is-a-ghost-real': w_isAGhostReal,
  'most-haunted-places': w_mostHauntedPlaces,
  'psychic-children': w_psychicChildren,
  'psychic-readings-what-does-hinduism-say-about-psychic-reading': w_psychicReadingsWhatDoesHinduismSayAboutPsychicReading,
  'science-of-the-paranormal': w_scienceOfTheParanormal,
  'signs-of-haunting': w_signsOfHaunting,
  'signs-of-possession': w_signsOfPossession,
  'signs-of-spirit-possession-mental-and-emotional-symptoms': w_signsOfSpiritPossessionMentalAndEmotionalSymptoms,
  'spirit-possession-in-hinduism': w_spiritPossessionInHinduism,
  'symptoms-of-spirit-possession': w_symptomsOfSpiritPossession,
  'types-of-ghosts-spirits-demons-entities': w_typesOfGhostsSpiritsDemonsEntities,
  'types-of-hauntings-what-are-different-types-of-haunting': w_typesOfHauntingsWhatAreDifferentTypesOfHaunting,
  'types-of-spirit-guides': w_typesOfSpiritGuides,
  'what-are-angels': w_whatAreAngels,
  'what-are-children-spirits': w_whatAreChildrenSpirits,
  'what-are-demons': w_whatAreDemons,
  'what-are-orbs': w_whatAreOrbs,
  'what-are-spirit-guides': w_whatAreSpiritGuides,
  'what-is-a-ghost': w_whatIsAGhost,
  'what-is-a-poltergeist-what-are-they-and-why-should-you-stay-away': w_whatIsAPoltergeistWhatAreTheyAndWhyShouldYouStayAway,
  'what-is-an-addicted-ghost': w_whatIsAnAddictedGhost,
  'what-is-channelling': w_whatIsChannelling,
  'what-is-depossession-therapy': w_whatIsDepossessionTherapy,
  'what-is-haunting': w_whatIsHaunting,
  'what-is-paranormal-an-introduction': w_whatIsParanormalAnIntroduction,
  'what-is-possession': w_whatIsPossession,
  'whats-after-death': w_whatsAfterDeath,
  'why-do-spirits-remain-among-us': w_whyDoSpiritsRemainAmongUs,
}
