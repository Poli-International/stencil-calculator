import fs from 'fs';
import path from 'path';
import { translations } from '../src/data/translations';

// 1. Orphaned keys list
const orphanedKeys = [
  "allTemplates",
  "autosaveSaved",
  "bp_chest_pec",
  "bp_foot",
  "bp_hand",
  "bp_neck",
  "bp_ribcage",
  "bp_shoulder_blade",
  "btn3DAnatomySimulator",
  "btnBulkImportSessionData",
  "btnBulkSupplyCalc",
  "btnCalculate",
  "btnCalculateInkVolume",
  "btnCheckFit",
  "btnClearConfig",
  "btnCloudSyncVault",
  "btnCopyDimensions",
  "btnDownloadFullProjectDossier",
  "btnDownloadPDF",
  "btnDownloadReportPDF",
  "btnDownloadRoadmapPdf",
  "btnExportICS",
  "btnGeneratePlan",
  "btnPlacementCamera",
  "btnPrintSettings",
  "btnQuickTour",
  "btnReset",
  "btnSaveLineworkVault",
  "btnScreenshot",
  "btnShareConfig",
  "btnShareEmail",
  "btnShareSocial",
  "btnTogglePrintLayout",
  "buyCoffee",
  "chooseProjectType",
  "clearHistory",
  "copyrightText",
  "disclaimerText",
  "feedbackPlaceholder",
  "feedbackSubmit",
  "footerClientSide",
  "freeEmbed",
  "geoSummary",
  "hourlyRateHelpText",
  "inkEstimatorTitle",
  "inkVolumeSubtitle",
  "inkVolumeTitle",
  "lblAnatomicalPlacementGuidance",
  "lblContinuousMatrix",
  "lblCustomNotes",
  "lblFilterCategory",
  "lblHourlyRate",
  "lblInkCapsPrep",
  "lblLandmarkZones",
  "lblLineEdgeThickness",
  "lblLiningNeedles",
  "lblSelectProjectTemplate",
  "lblShadingNeedles",
  "lblShareThoughts",
  "lblSizeIncrease",
  "lblStandardPlacementSize",
  "lblStartDate",
  "lblWeeksBetweenSessions",
  "lblYouAre",
  "lblYourEmail",
  "navAbout",
  "navContact",
  "navTrust",
  "notifyBtn",
  "notifyPlaceholder",
  "notifySubtitle",
  "notifyTitle",
  "paperOptimizerTitle",
  "phototypeVisualizerTitle",
  "pronatedIn",
  "recentTitle",
  "recommendedForYou",
  "relaxedPos",
  "roleChoose",
  "roleEnthusiast",
  "roleOther",
  "roleShopOwner",
  "roleTattooArtist",
  "saveCurrentConfig",
  "sec5Subtitle",
  "sec5Title",
  "selectBodyPartPlaceholder",
  "shortcutsBadge",
  "startDateHelp",
  "supinatedOut",
  "suppliesArea",
  "tabInkAnalytics",
  "tabMultiSession",
  "toggleBodyOverlay",
  "viewAllTools",
  "weeksHelpText",
  "wrapHelpText"
];

console.log('Orphans to remove:', orphanedKeys.length);

// 2. New keys for lost strings (English only in this step)
const newEnglishKeys: Record<string, string> = {
  // Anatomical landmark texts
  landmarkDeltoidApex: "Deltoid Apex",
  landmarkBicepPeak: "Bicep Peak",
  landmarkOlecranon: "Olecranon (Elbow)",
  landmarkAcromion: "Acromion",
  landmarkCubitalFossa: "Cubital Fossa",
  landmarkRadialStyloid: "Radial Styloid",
  landmarkMedialEpicondyle: "Medial Epicondyle",
  landmarkUlnarHead: "Ulnar Head",
  landmarkC7Vertebra: "C7 Vertebra",
  landmarkScapularSpine: "Scapular Spine",
  landmarkIliacCrest: "Iliac Crest",
  landmarkSpineAxis: "Spine Axis",
  landmarkLeftScapula: "Left Scapula",
  landmarkRightScapula: "Right Scapula",
  landmarkSuprasternalNotch: "Suprasternal Notch",
  landmarkLeftPecMargin: "Left Pec Margin",
  landmarkRightPecMargin: "Right Pec Margin",
  landmarkGreaterTrochanter: "Greater Trochanter",
  landmarkSuperiorPatella: "Superior Patella",
  landmarkAxillaMargin: "Axilla Margin",

  // Breadcrumb
  ariaBreadcrumb: "Breadcrumb",

  // Curvature calculator
  dragHint: "Corner resize active",

  // Newsletter & Feedback
  newsletterSuccess: "Subscribed successfully!",
  newsletterPlaceholder: "Enter studio email...",
  feedbackSuccess: "Thank you for your feedback!",

  // Footer
  footerPublishedBy: "Published by Poli International — Manufacturer of premium body jewelry and publisher of free professional tools for tattoo artists, piercers, and studio owners.",
  footerCopyright: "© {year} Poli International. All rights reserved. Free tool for professional artists.",
  footerZeroTracking: "Zero external tracking • 100% Client-side browser calculation",

  // Linework converter
  toastLineworkDownloaded: "Linework PNG downloaded",
  titlePrintLinework: "Print Tattoo Stencil",

  // Placement guide
  phototype1: "Type I: Fair",
  phototype2: "Type II: Light",
  phototype3: "Type III: Medium",
  phototype4: "Type IV: Tan",
  phototype5: "Type V: Dark",
  phototype6: "Type VI: Deep",
  contrastUltraHigh: "98% Ultra-High",
  contrastHigh: "88% High Contrast",
  contrastOptimal: "78% Optimal",
  contrastModerate: "68% Moderate (S8 Red recommended)",
  contrastLow: "48% Low (S8 Red or Green Carbon required)",
  contrastLowVis: "32% Low Visibility (Green Carbon required)",
  lblAvgCircumference: "Avg Ø",
  cautionDesignWraps: "Caution: Design wraps {pct}% around {bodyPart}",
  fitDesignOccupies: "Excellent Fit: Design occupies {pct}% of circumference",
  riskHeavyWrap: "Heavy Wrap Distortion Risk",
  riskOptimalPlane: "Optimal Anatomical Plane",
  twistRelaxedPos: "0° (Relaxed Position)",
  twistPronatedIn: "Pronated Inward",
  twistSupinatedOut: "Supinated Outward",
  twistRestingSymmetry: "Resting Arm Symmetry (Handshake Posture)",
  twistShearDrift: "Kinetic Shear Drift: {deg}°",
  phototypeTitle: "Fitzpatrick Skin Phototype & Contrast Visualizer",
  phototypeSubtitle: "Evaluate stencil line contrast across phototypes I-VI under studio lighting",
  lblMelaninBg: "Active Melanin Background: {type}",
  lblCarbonType: "Carbon Type: {type}",
  carbonCrystalViolet: "Crystal Violet",
  carbonS8Red: "S8 Red",
  carbonElectrumGreen: "Electrum Green",
  stencilSampleText: "STENCIL",

  // Templates tab
  placeholderSearchTemplates: "Search tattoo templates by style, placement...",

  // App context & toasts
  toastPerformCalcFirst: "Perform a calculation first",
  toastConfigSaved: "Configuration saved to history!",
  toastConfigDeleted: "Configuration deleted",
  toastHistoryCleared: "Saved history cleared",
  toastTemplateLoaded: "Loaded {name} into Curvature Calculator!"
};

console.log('New keys to add:', Object.keys(newEnglishKeys).length);

// Clean each language dictionary: delete orphaned keys
const langs = ['en', 'fr', 'it', 'de', 'es', 'pt', 'nl'] as const;

const cleanedTranslations: Record<string, Record<string, string>> = {};

for (const lang of langs) {
  const dict = { ...translations[lang] };
  for (const orphan of orphanedKeys) {
    delete dict[orphan];
  }
  // Add new keys to English
  if (lang === 'en') {
    Object.assign(dict, newEnglishKeys);
  }
  cleanedTranslations[lang] = dict;
}

// Generate new translations.ts file
let fileOutput = `// Poli International — Multi-Language Dictionaries (v2.6.0)\n`;
fileOutput += `// Cleaned and synchronized translation dictionary\n\n`;
fileOutput += `export const translations: Record<string, Record<string, string>> = {\n`;

for (const lang of langs) {
  fileOutput += `  ${lang}: {\n`;
  const sortedKeys = Object.keys(cleanedTranslations[lang]).sort();
  for (const k of sortedKeys) {
    const val = cleanedTranslations[lang][k];
    fileOutput += `    ${JSON.stringify(k)}: ${JSON.stringify(val)},\n`;
  }
  fileOutput += `  },\n`;
}

fileOutput += `};\n`;

fs.writeFileSync('./src/data/translations.ts', fileOutput, 'utf-8');
console.log('Successfully updated src/data/translations.ts');
console.log('Keys before in EN:', Object.keys(translations.en).length);
console.log('Orphans removed:', orphanedKeys.length);
console.log('New keys added to EN:', Object.keys(newEnglishKeys).length);
console.log('Keys after in EN:', Object.keys(cleanedTranslations.en).length);
