import fs from 'fs';

let content = fs.readFileSync('src/components/Anatomical3DVisual.tsx', 'utf-8');

// Update renderTemplateModel signature and call
content = content.replace(
  `{renderTemplateModel(templateId, category, idPrefix, wireframe, highlightZone, showLandmarks)}`,
  `{renderTemplateModel(templateId, category, idPrefix, wireframe, highlightZone, showLandmarks, t)}`
);

content = content.replace(
  `function renderTemplateModel(
  templateId: string,
  category: string,
  idPrefix: string,
  wireframe: boolean,
  highlightZone: boolean,
  showLandmarks: boolean
) {`,
  `function renderTemplateModel(
  templateId: string,
  category: string,
  idPrefix: string,
  wireframe: boolean,
  highlightZone: boolean,
  showLandmarks: boolean,
  t: (k: string) => string
) {`
);

content = content.replace(/renderTraditionalHalfSleeve\(idPrefix, wireframe, highlightZone, showLandmarks\)/g, 'renderTraditionalHalfSleeve(idPrefix, wireframe, highlightZone, showLandmarks, t)');
content = content.replace(/renderJapaneseFullSleeve\(idPrefix, wireframe, highlightZone, showLandmarks\)/g, 'renderJapaneseFullSleeve(idPrefix, wireframe, highlightZone, showLandmarks, t)');
content = content.replace(/renderForearmSleeve\(idPrefix, wireframe, highlightZone, showLandmarks\)/g, 'renderForearmSleeve(idPrefix, wireframe, highlightZone, showLandmarks, t)');
content = content.replace(/renderFullBackPiece\(idPrefix, wireframe, highlightZone, showLandmarks\)/g, 'renderFullBackPiece(idPrefix, wireframe, highlightZone, showLandmarks, t)');
content = content.replace(/renderUpperBackPanel\(idPrefix, wireframe, highlightZone, showLandmarks\)/g, 'renderUpperBackPanel(idPrefix, wireframe, highlightZone, showLandmarks, t)');
content = content.replace(/renderChestPanel\(idPrefix, wireframe, highlightZone, showLandmarks\)/g, 'renderChestPanel(idPrefix, wireframe, highlightZone, showLandmarks, t)');
content = content.replace(/renderThighPanel\(idPrefix, wireframe, highlightZone, showLandmarks\)/g, 'renderThighPanel(idPrefix, wireframe, highlightZone, showLandmarks, t)');
content = content.replace(/renderRibPanel\(idPrefix, wireframe, highlightZone, showLandmarks\)/g, 'renderRibPanel(idPrefix, wireframe, highlightZone, showLandmarks, t)');

content = content.replace(`function renderTraditionalHalfSleeve(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean) {`, `function renderTraditionalHalfSleeve(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {`);
content = content.replace(`function renderJapaneseFullSleeve(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean) {`, `function renderJapaneseFullSleeve(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {`);
content = content.replace(`function renderForearmSleeve(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean) {`, `function renderForearmSleeve(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {`);
content = content.replace(`function renderFullBackPiece(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean) {`, `function renderFullBackPiece(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {`);
content = content.replace(`function renderUpperBackPanel(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean) {`, `function renderUpperBackPanel(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {`);
content = content.replace(`function renderChestPanel(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean) {`, `function renderChestPanel(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {`);
content = content.replace(`function renderThighPanel(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean) {`, `function renderThighPanel(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {`);
content = content.replace(`function renderRibPanel(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean) {`, `function renderRibPanel(idPrefix: string, wireframe: boolean, highlightZone: boolean, showLandmarks: boolean, t: (k: string) => string) {`);

// Replace text landmarks
content = content.replace(`<text x="212" y="43">Deltoid Apex</text>`, `<text x="212" y="43">{t('landmarkDeltoidApex')}</text>`);
content = content.replace(`<text x="45" y="118">Bicep Peak</text>`, `<text x="45" y="118">{t('landmarkBicepPeak')}</text>`);
content = content.replace(`<text x="135" y="222">Olecranon (Elbow)</text>`, `<text x="135" y="222">{t('landmarkOlecranon')}</text>`);

content = content.replace(`<text x="234" y="32">Acromion</text>`, `<text x="234" y="32">{t('landmarkAcromion')}</text>`);
content = content.replace(`<text x="50" y="152">Cubital Fossa</text>`, `<text x="50" y="152">{t('landmarkCubitalFossa')}</text>`);
content = content.replace(`<text x="202" y="217">Radial Styloid</text>`, `<text x="202" y="217">{t('landmarkRadialStyloid')}</text>`);

content = content.replace(`<text x="35" y="44">Medial Epicondyle</text>`, `<text x="35" y="44">{t('landmarkMedialEpicondyle')}</text>`);
content = content.replace(`<text x="188" y="212">Ulnar Head</text>`, `<text x="188" y="212">{t('landmarkUlnarHead')}</text>`);

content = content.replace(`<text x="176" y="25">C7 Vertebra</text>`, `<text x="176" y="25">{t('landmarkC7Vertebra')}</text>`);
content = content.replace(`<text x="35" y="88">Scapular Spine</text>`, `<text x="35" y="88">{t('landmarkScapularSpine')}</text>`);
content = content.replace(`<text x="55" y="226">Iliac Crest</text>`, `<text x="55" y="226">{t('landmarkIliacCrest')}</text>`);

content = content.replace(`<text x="172" y="27">Spine Axis</text>`, `<text x="172" y="27">{t('landmarkSpineAxis')}</text>`);
content = content.replace(`<text x="30" y="108">Left Scapula</text>`, `<text x="30" y="108">{t('landmarkLeftScapula')}</text>`);
content = content.replace(`<text x="252" y="108">Right Scapula</text>`, `<text x="252" y="108">{t('landmarkRightScapula')}</text>`);

content = content.replace(`<text x="176" y="41">Suprasternal Notch</text>`, `<text x="176" y="41">{t('landmarkSuprasternalNotch')}</text>`);
content = content.replace(`<text x="40" y="118">Left Pec Margin</text>`, `<text x="40" y="118">{t('landmarkLeftPecMargin')}</text>`);
content = content.replace(`<text x="245" y="118">Right Pec Margin</text>`, `<text x="245" y="118">{t('landmarkRightPecMargin')}</text>`);

content = content.replace(`<text x="45" y="34">Greater Trochanter</text>`, `<text x="45" y="34">{t('landmarkGreaterTrochanter')}</text>`);
content = content.replace(`<text x="168" y="218">Superior Patella</text>`, `<text x="168" y="218">{t('landmarkSuperiorPatella')}</text>`);

content = content.replace(`<text x="55" y="34">Axilla Margin</text>`, `<text x="55" y="34">{t('landmarkAxillaMargin')}</text>`);
content = content.replace(`<text x="188" y="214">Iliac Crest</text>`, `<text x="188" y="214">{t('landmarkIliacCrest')}</text>`);

fs.writeFileSync('src/components/Anatomical3DVisual.tsx', content, 'utf-8');
console.log('Updated Anatomical3DVisual.tsx');
