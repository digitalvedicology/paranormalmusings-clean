/**
 * Pre-authored JSON-LD (@graph: Organization, Person, WebSite, BlogPosting,
 * WebPage, BreadcrumbList) for each eastern article, keyed by slug.
 * Source of truth is schema/eastern/ at the repo root; these are a
 * synced copy so the deployed app (root directory paranormalmusings-frontend-1)
 * bundles them.
 */
import e_aSojournToHeavenAfterDeath from './schema/eastern/eastern-views__a-sojourn-to-heaven-after-death.json'
import e_ancestorWorshipInHinduism from './schema/eastern/eastern-views__ancestor-worship-in-hinduism.json'
import e_backToSourceAfterDeathEasternTeachings from './schema/eastern/eastern-views__back-to-source-after-death-eastern-teachings.json'
import e_changeIsTheOnlyConstantAccordingToIndianSpiritualTeachings from './schema/eastern/eastern-views__change-is-the-only-constant-according-to-indian-spiritual-teachings.json'
import e_criteriaForRebirth from './schema/eastern/eastern-views__criteria-for-rebirth.json'
import e_deathRebirthAndEvolution from './schema/eastern/eastern-views__death-rebirth-and-evolution.json'
import e_deathTheGreatEqualizer from './schema/eastern/eastern-views__death-the-great-equalizer.json'
import e_easternViewsOnDeathAfterlifeAndTheParanormal from './schema/eastern/eastern-views__eastern-views-on-death-afterlife-and-the-paranormal.json'
import e_hinduRitualsForDeath from './schema/eastern/eastern-views__hindu-rituals-for-death.json'
import e_howTheSoulLeavesTheBody from './schema/eastern/eastern-views__how-the-soul-leaves-the-body.json'
import e_karmaAndTheConceptOfVariousHells from './schema/eastern/eastern-views__karma-and-the-concept-of-various-hells.json'
import e_pranaOrVitalForceRoleOfUdanaVayuOrPrana from './schema/eastern/eastern-views__prana-or-vital-force-role-of-udana-vayu-or-prana.json'
import e_processOfDeathAccordingToYogaVasishtha from './schema/eastern/eastern-views__process-of-death-according-to-yoga-vasishtha.json'
import e_reincarnationAndMetempsychosis from './schema/eastern/eastern-views__reincarnation-and-metempsychosis.json'
import e_reincarnationUniversalLaw from './schema/eastern/eastern-views__reincarnation-universal-law.json'
import e_religiousViewsOnTheJourneyOfTheSoul from './schema/eastern/eastern-views__religious-views-on-the-journey-of-the-soul.json'
import e_shraadhCeremonyAndPrayersForTheDead from './schema/eastern/eastern-views__shraadh-ceremony-and-prayers-for-the-dead.json'
import e_sixLokasOrPlanesAfterDeathJourneyAccordingToHinduism from './schema/eastern/eastern-views__six-lokas-or-planes-after-death-journey-according-to-hinduism.json'
import e_soulAfterDeathDifferentSchoolsOfThoughts from './schema/eastern/eastern-views__soul-after-death-different-schools-of-thoughts.json'
import e_soulsJourneyAfterDeathIndianAndEasternViews from './schema/eastern/eastern-views__souls-journey-after-death-indian-and-eastern-views.json'
import e_soulsJourneyAfterDeathTheThirdPlaceOrTritiyamSthaanam from './schema/eastern/eastern-views__souls-journey-after-death-the-third-place-or-tritiyam-sthaanam.json'
import e_soulsJourneyAfterDeathThreePathsAccordingToHinduPhilosophy from './schema/eastern/eastern-views__souls-journey-after-death-three-paths-according-to-hindu-philosophy.json'
import e_symptomsAndIndicationsOfDeath from './schema/eastern/eastern-views__symptoms-and-indications-of-death.json'
import e_theBodyBeginsANewJourneyAfterTheProcessOfDeathHinduPhiloso from './schema/eastern/eastern-views__the-body-begins-a-new-journey-after-the-process-of-death-hindu-philoso.json'
import e_theoryOfRebirthAndRecreationEasternPerspectives from './schema/eastern/eastern-views__theory-of-rebirth-and-recreation-eastern-perspectives.json'
import e_transmigrationOfSoulsAndConceptOfPretaHinduPhilosophy from './schema/eastern/eastern-views__transmigration-of-souls-and-concept-of-preta-hindu-philosophy.json'
import e_whatIsDeathAndHowToConquerDeathHinduism from './schema/eastern/eastern-views__what-is-death-and-how-to-conquer-death-hinduism.json'
import e_whatIsSoulAccordingToIndianTeachings from './schema/eastern/eastern-views__what-is-soul-according-to-indian-teachings.json'
import e_whoIsASage from './schema/eastern/eastern-views__who-is-a-sage.json'

export const easternArticleSchemas: Record<string, object> = {
  'a-sojourn-to-heaven-after-death': e_aSojournToHeavenAfterDeath,
  'ancestor-worship-in-hinduism': e_ancestorWorshipInHinduism,
  'back-to-source-after-death-eastern-teachings': e_backToSourceAfterDeathEasternTeachings,
  'change-is-the-only-constant-according-to-indian-spiritual-teachings': e_changeIsTheOnlyConstantAccordingToIndianSpiritualTeachings,
  'criteria-for-rebirth': e_criteriaForRebirth,
  'death-rebirth-and-evolution': e_deathRebirthAndEvolution,
  'death-the-great-equalizer': e_deathTheGreatEqualizer,
  'eastern-views-on-death-afterlife-and-the-paranormal': e_easternViewsOnDeathAfterlifeAndTheParanormal,
  'hindu-rituals-for-death': e_hinduRitualsForDeath,
  'how-the-soul-leaves-the-body': e_howTheSoulLeavesTheBody,
  'karma-and-the-concept-of-various-hells': e_karmaAndTheConceptOfVariousHells,
  'prana-or-vital-force-role-of-udana-vayu-or-prana': e_pranaOrVitalForceRoleOfUdanaVayuOrPrana,
  'process-of-death-according-to-yoga-vasishtha': e_processOfDeathAccordingToYogaVasishtha,
  'reincarnation-and-metempsychosis': e_reincarnationAndMetempsychosis,
  'reincarnation-universal-law': e_reincarnationUniversalLaw,
  'religious-views-on-the-journey-of-the-soul': e_religiousViewsOnTheJourneyOfTheSoul,
  'shraadh-ceremony-and-prayers-for-the-dead': e_shraadhCeremonyAndPrayersForTheDead,
  'six-lokas-or-planes-after-death-journey-according-to-hinduism': e_sixLokasOrPlanesAfterDeathJourneyAccordingToHinduism,
  'soul-after-death-different-schools-of-thoughts': e_soulAfterDeathDifferentSchoolsOfThoughts,
  'souls-journey-after-death-indian-and-eastern-views': e_soulsJourneyAfterDeathIndianAndEasternViews,
  'souls-journey-after-death-the-third-place-or-tritiyam-sthaanam': e_soulsJourneyAfterDeathTheThirdPlaceOrTritiyamSthaanam,
  'souls-journey-after-death-three-paths-according-to-hindu-philosophy': e_soulsJourneyAfterDeathThreePathsAccordingToHinduPhilosophy,
  'symptoms-and-indications-of-death': e_symptomsAndIndicationsOfDeath,
  'the-body-begins-a-new-journey-after-the-process-of-death-hindu-philoso': e_theBodyBeginsANewJourneyAfterTheProcessOfDeathHinduPhiloso,
  'theory-of-rebirth-and-recreation-eastern-perspectives': e_theoryOfRebirthAndRecreationEasternPerspectives,
  'transmigration-of-souls-and-concept-of-preta-hindu-philosophy': e_transmigrationOfSoulsAndConceptOfPretaHinduPhilosophy,
  'what-is-death-and-how-to-conquer-death-hinduism': e_whatIsDeathAndHowToConquerDeathHinduism,
  'what-is-soul-according-to-indian-teachings': e_whatIsSoulAccordingToIndianTeachings,
  'who-is-a-sage': e_whoIsASage,
}
