/**
 * Pre-authored JSON-LD (@graph: Organization, Person, WebSite, BlogPosting,
 * WebPage, BreadcrumbList) for each investigation article, keyed by slug.
 * Source of truth is schema/investigation/ at the repo root; these are a
 * synced copy so the deployed app (root directory paranormalmusings-frontend-1)
 * bundles them.
 */
import a_camerasForGhostHuntingSignificanceAndImportance from './schema/investigation/investigation__cameras-for-ghost-hunting-significance-and-importance.json'
import a_depossessionInstructions from './schema/investigation/investigation__depossession-instructions.json'
import a_digitalVideoRecorderCameraForParanormalInvestigation from './schema/investigation/investigation__digital-video-recorder-camera-for-paranormal-investigation.json'
import a_electronicVoicePhenomenonHowToGetAnEvp from './schema/investigation/investigation__electronic-voice-phenomenon-how-to-get-an-evp.json'
import a_evilSpiritsHowToDetectEvilSpiritsInYourHome from './schema/investigation/investigation__evil-spirits-how-to-detect-evil-spirits-in-your-home.json'
import a_evpEquipmentHistoryOfEvpEquipment from './schema/investigation/investigation__evp-equipment-history-of-evp-equipment.json'
import a_ghostEncounterWithARegularSpirit from './schema/investigation/investigation__ghost-encounter-with-a-regular-spirit.json'
import a_ghostHuntingCameraTipsAndTricks from './schema/investigation/investigation__ghost-hunting-camera-tips-and-tricks.json'
import a_ghostHuntingEquipmentMustHaves from './schema/investigation/investigation__ghost-hunting-equipment-must-haves.json'
import a_ghostHuntingThermometers from './schema/investigation/investigation__ghost-hunting-thermometers.json'
import a_ghostHuntingTipsWhatShouldYouStrictlyAvoid from './schema/investigation/investigation__ghost-hunting-tips-what-should-you-strictly-avoid.json'
import a_ghostHuntingToolsSomeOtherHolyToolsYouMustHaveInYourKit from './schema/investigation/investigation__ghost-hunting-tools-some-other-holy-tools-you-must-have-in-your-kit.json'
import a_ghostPhotosWhatIsTheCameraProcedureToGetBestGhostPhotos from './schema/investigation/investigation__ghost-photos-what-is-the-camera-procedure-to-get-best-ghost-photos.json'
import a_ghostSmellAsASignThatYourHouseIsHaunted from './schema/investigation/investigation__ghost-smell-as-a-sign-that-your-house-is-haunted.json'
import a_howToBecomeAParanormalInvestigator from './schema/investigation/investigation__how-to-become-a-paranormal-investigator.json'
import a_howToConductAnInvestigationOfTheParanormal from './schema/investigation/investigation__how-to-conduct-an-investigation-of-the-paranormal.json'
import a_ovilusGhostHuntingEquipment from './schema/investigation/investigation__ovilus-ghost-hunting-equipment.json'
import a_paranormalActivityLevelHowToDetermineIt from './schema/investigation/investigation__paranormal-activity-level-how-to-determine-it.json'
import a_paranormalEvidenceHowToReviewBestParanormalEvidence from './schema/investigation/investigation__paranormal-evidence-how-to-review-best-paranormal-evidence.json'
import a_paranormalInvestigationTeam from './schema/investigation/investigation__paranormal-investigation-team.json'
import a_paranormalInvestigatorJobWhatDoesItInvolve from './schema/investigation/investigation__paranormal-investigator-job-what-does-it-involve.json'
import a_paranormalInvestigatorKitWhatAreTheThingsYouMustHave from './schema/investigation/investigation__paranormal-investigator-kit-what-are-the-things-you-must-have.json'
import a_paranormalTermsImportantParanormalTermsAndDefinitions from './schema/investigation/investigation__paranormal-terms-important-paranormal-terms-and-definitions.json'
import a_safeGhostHunting7KeyPointsToRemember from './schema/investigation/investigation__safe-ghost-hunting-7-key-points-to-remember.json'
import a_whatAreSpiritOrbs from './schema/investigation/investigation__what-are-spirit-orbs.json'
import a_whatIsAMedium from './schema/investigation/investigation__what-is-a-medium.json'
import a_whatIsAParanormalInvestigator from './schema/investigation/investigation__what-is-a-paranormal-investigator.json'
import a_whatIsAPsychic from './schema/investigation/investigation__what-is-a-psychic.json'
import a_whatIsASeance from './schema/investigation/investigation__what-is-a-seance.json'
import a_whatIsAnElectromagneticFieldHowIsItParanormallySignificant from './schema/investigation/investigation__what-is-an-electromagnetic-field-how-is-it-paranormally-significant.json'
import a_whatIsAnEvp from './schema/investigation/investigation__what-is-an-evp.json'
import a_whatIsEctoplasm from './schema/investigation/investigation__what-is-ectoplasm.json'
import a_whatIsEmPump from './schema/investigation/investigation__what-is-em-pump.json'
import a_whatIsFear from './schema/investigation/investigation__what-is-fear.json'
import a_whatIsManifestation from './schema/investigation/investigation__what-is-manifestation.json'
import a_whatIsSelfResponsibilityInParanormalInvestigation from './schema/investigation/investigation__what-is-self-responsibility-in-paranormal-investigation.json'
import a_whatIsSixthSenseHowToDevelopSixthSenseToBeAParanormalInve from './schema/investigation/investigation__what-is-sixth-sense-how-to-develop-sixth-sense-to-be-a-paranormal-inve.json'

export const investigationArticleSchemas: Record<string, object> = {
  'cameras-for-ghost-hunting-significance-and-importance': a_camerasForGhostHuntingSignificanceAndImportance,
  'depossession-instructions': a_depossessionInstructions,
  'digital-video-recorder-camera-for-paranormal-investigation': a_digitalVideoRecorderCameraForParanormalInvestigation,
  'electronic-voice-phenomenon-how-to-get-an-evp': a_electronicVoicePhenomenonHowToGetAnEvp,
  'evil-spirits-how-to-detect-evil-spirits-in-your-home': a_evilSpiritsHowToDetectEvilSpiritsInYourHome,
  'evp-equipment-history-of-evp-equipment': a_evpEquipmentHistoryOfEvpEquipment,
  'ghost-encounter-with-a-regular-spirit': a_ghostEncounterWithARegularSpirit,
  'ghost-hunting-camera-tips-and-tricks': a_ghostHuntingCameraTipsAndTricks,
  'ghost-hunting-equipment-must-haves': a_ghostHuntingEquipmentMustHaves,
  'ghost-hunting-thermometers': a_ghostHuntingThermometers,
  'ghost-hunting-tips-what-should-you-strictly-avoid': a_ghostHuntingTipsWhatShouldYouStrictlyAvoid,
  'ghost-hunting-tools-some-other-holy-tools-you-must-have-in-your-kit': a_ghostHuntingToolsSomeOtherHolyToolsYouMustHaveInYourKit,
  'ghost-photos-what-is-the-camera-procedure-to-get-best-ghost-photos': a_ghostPhotosWhatIsTheCameraProcedureToGetBestGhostPhotos,
  'ghost-smell-as-a-sign-that-your-house-is-haunted': a_ghostSmellAsASignThatYourHouseIsHaunted,
  'how-to-become-a-paranormal-investigator': a_howToBecomeAParanormalInvestigator,
  'how-to-conduct-an-investigation-of-the-paranormal': a_howToConductAnInvestigationOfTheParanormal,
  'ovilus-ghost-hunting-equipment': a_ovilusGhostHuntingEquipment,
  'paranormal-activity-level-how-to-determine-it': a_paranormalActivityLevelHowToDetermineIt,
  'paranormal-evidence-how-to-review-best-paranormal-evidence': a_paranormalEvidenceHowToReviewBestParanormalEvidence,
  'paranormal-investigation-team': a_paranormalInvestigationTeam,
  'paranormal-investigator-job-what-does-it-involve': a_paranormalInvestigatorJobWhatDoesItInvolve,
  'paranormal-investigator-kit-what-are-the-things-you-must-have': a_paranormalInvestigatorKitWhatAreTheThingsYouMustHave,
  'paranormal-terms-important-paranormal-terms-and-definitions': a_paranormalTermsImportantParanormalTermsAndDefinitions,
  'safe-ghost-hunting-7-key-points-to-remember': a_safeGhostHunting7KeyPointsToRemember,
  'what-are-spirit-orbs': a_whatAreSpiritOrbs,
  'what-is-a-medium': a_whatIsAMedium,
  'what-is-a-paranormal-investigator': a_whatIsAParanormalInvestigator,
  'what-is-a-psychic': a_whatIsAPsychic,
  'what-is-a-seance': a_whatIsASeance,
  'what-is-an-electromagnetic-field-how-is-it-paranormally-significant': a_whatIsAnElectromagneticFieldHowIsItParanormallySignificant,
  'what-is-an-evp': a_whatIsAnEvp,
  'what-is-ectoplasm': a_whatIsEctoplasm,
  'what-is-em-pump': a_whatIsEmPump,
  'what-is-fear': a_whatIsFear,
  'what-is-manifestation': a_whatIsManifestation,
  'what-is-self-responsibility-in-paranormal-investigation': a_whatIsSelfResponsibilityInParanormalInvestigation,
  'what-is-sixth-sense-how-to-develop-sixth-sense-to-be-a-paranormal-inve': a_whatIsSixthSenseHowToDevelopSixthSenseToBeAParanormalInve,
}
