# Tattoo Stencil Calculator - Technical Documentation

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Data Schemas](#data-schemas)
3. [Calculation / Logic Algorithms](#calculation--logic-algorithms)
4. [API Reference](#api-reference)
5. [Integration Guide](#integration-guide)
6. [Customization](#customization)
7. [Performance](#performance)
8. [Browser Compatibility](#browser-compatibility)
9. [Security](#security)
10. [Version History](#version-history)
11. [Support and Contact](#support-and-contact)

## Architecture Overview

### Technology Stack

- **HTML5** - Semantic markup with form elements and tabbed interface
- **CSS3** - Custom properties, flexbox, grid, dark/light mode support
- **Vanilla JavaScript (ES6+)** - No frameworks, no dependencies
- **External APIs** - Frankfurter API (free currency exchange rates, no key required)
- **Web3Forms API** - Feedback form submission (free tier)

### File Structure

```
stencil-calculator/
├── index.html              # Main tool interface with tab system
├── documentation.html      # Standalone documentation page (loaded in iframe)
├── embed.html              # Embed instructions and code generator
├── css/
│   ├── style.css           # Main tool styles
│   └── poli-standard.css   # Standard Poli branding styles
└── js/
    ├── body-parts.js       # Body part curvature database
    ├── templates.js        # Placement template definitions
    ├── currency.js         # Currency conversion system
    ├── calculator.js       # Core calculation logic and UI handlers
    ├── common.js           # Theme, modal, iframe resizing utilities
    └── feedback.js         # Community feedback form handler
```

### Component / Logic Breakdown

The tool consists of four main tabbed components:

1. **Curvature Calculator** - Calculates stencil size adjustments for body curvature
2. **Placement Guide** - Checks if a design fits a body part and provides recommendations
3. **Templates** - Pre-built sizing guides for common tattoo projects
4. **Multi-Session Planner** - Generates project timelines and cost estimates

Each component operates independently within the tab system, sharing data through the global `bodyPartCurvature` and `placementTemplates` objects.

## Data Schemas

### Body Part Curvature Database (`body-parts.js`)

The `bodyPartCurvature` object contains 27 body part entries. Each entry follows this schema:

```javascript
{
  name: 'Outer Upper Arm (Shoulder to Elbow)',
  curvature_factor: 1.15,        // Multiplier for stencil size adjustment
  description: 'Moderate curvature around bicep',
  wrap_threshold: 50,            // Maximum recommended wrap percentage
  placement_notes: 'Design wraps around bicep. Consider muscle flexion.',
  recommended_orientation: ['vertical', 'wraparound'],
  circumference_average: 33      // Average circumference in cm
}
```

**Example values for key body parts:**

| Key | curvature_factor | wrap_threshold | circumference_average |
|-----|-----------------|----------------|----------------------|
| `outer_upper_arm` | 1.15 | 50 | 33 |
| `ribs` | 1.25 | 35 | 90 |
| `fingers` | 1.30 | 25 | 6 |
| `full_back` | 1.15 | 50 | 92 |
| `wrist` | 1.20 | 40 | 16 |

### Placement Templates Database (`templates.js`)

The `placementTemplates` object contains 16 template entries. Each entry follows this schema:

```javascript
{
  name: 'Traditional Half Sleeve',
  category: 'sleeves',           // One of: sleeves, back, chest, legs, torso, standalone
  body_parts: ['outer_upper_arm', 'inner_upper_arm'],
  estimated_dimensions: {
    width: 28,
    height: 25,
    unit: 'cm'
  },
  session_plan: {
    total_sessions: 3,
    sessions: [
      { session: 1, focus: 'Outline entire sleeve', hours: 4 },
      { session: 2, focus: 'Shading and color (outer)', hours: 5 },
      { session: 3, focus: 'Shading and color (inner), touch-ups', hours: 4 }
    ]
  },
  difficulty: 'intermediate',    // beginner, intermediate, advanced
  notes: 'Classic placement. Wraps around entire upper arm. Plan for muscle flexion.'
}
```

### Currency State (`currency.js`)

```javascript
{
  currentCurrency: 'USD',        // Active currency code
  rates: {
    USD: 1,                      // Base currency
    EUR: 0.92,                   // Live rate from Frankfurter API
    GBP: 0.79                    // Live rate from Frankfurter API
  },
  symbols: {
    USD: '$',
    EUR: '€',
    GBP: '£'
  },
  lastUpdate: null               // Date object of last rate fetch
}
```

### Feedback Form Data (`feedback.js`)

```javascript
{
  email: 'user@example.com',
  role: 'tattoo_artist',         // User role selection
  feedback: 'Feedback text content',
  toolName: document.title,      // Auto-populated from page title
  toolUrl: window.location.href, // Auto-populated from current URL
  timestamp: '2025-01-15T10:30:00.000Z' // ISO 8601 format
}
```

## Calculation / Logic Algorithms

### Curvature Compensation (`calculator.js` - `calculateCurvatureCompensation()`)

**Step-by-step logic:**

1. **Input Collection**: Read `designWidth`, `designHeight`, `bodyPart` (key), and `orientation` from form fields
2. **Validation**: Ensure all required fields have values; return error if not
3. **Body Part Lookup**: Call `getBodyPart(bodyPartKey)` to retrieve curvature data
4. **Factor Calculation**: Call `getCurvatureFactor(bodyPartKey, orientation)`:
   - Base factor = `bodyPartCurvature[key].curvature_factor`
   - If orientation is `'wraparound'`: multiply factor by 1.10
   - If orientation is `'horizontal'`: multiply factor by 1.05
   - Return adjusted factor
5. **Stencil Size Calculation**:
   - `stencilWidth = designWidth × curvatureFactor`
   - `stencilHeight = designHeight × curvatureFactor`
6. **Print Percentage**: `printPercentage = curvatureFactor × 100`
7. **Fit Check**: Call `checkDesignFit(bodyPartKey, designWidth, orientation)`:
   - Calculate `wrapPercentage = (designWidth / circumference_average) × 100`
   - If `wrapPercentage > 100`: returns `{ fits: false, warning: false }`
   - If `wrapPercentage > wrap_threshold`: returns `{ fits: true, warning: true }`
   - Otherwise: returns `{ fits: true, warning: false }`
8. **Display Results**: Call `displayCurvatureResults()` with all computed values

**Formula**: `adjustedSize = baseSize × (1 + curvatureFactor)`

### Placement Fit Check (`calculator.js` - `checkPlacementFit()`)

1. **Input Collection**: Read `fitWidth` (design width), `fitBodyPart` (body part key), `wrapPercentage` (slider value)
2. **Validation**: Ensure width and body part are provided
3. **Body Part Lookup**: Retrieve body part data
4. **Fit Check**: Call `checkDesignFit()` with the body part key, width, and `'horizontal'` orientation
5. **Display Results**: Show fit analysis including actual wrap percentage and recommendations

### Multi-Session Timeline Generation (`templates.js` - `generateSessionTimeline()`)

1. **Input**: `templateKey` (string), `weeksPerSession` (number, default 4)
2. **Template Lookup**: Retrieve template from `placementTemplates`
3. **Timeline Construction**:
   - Initialize `cumulativeWeeks = 0`
   - For each session in `template.session_plan.sessions`:
     - If not first session: `cumulativeWeeks += weeksPerSession`
     - Create session entry with `session_number`, `week`, `focus`, `hours`, `healing_note`
4. **Total Calculation**: `total_weeks = cumulativeWeeks + (weeksPerSession × 1.5)`
5. **Return**: Object with `total_weeks` and `sessions` array

### Cost Estimation (`templates.js` - `calculateEstimatedCost()`)

1. **Input**: `templateKey` (string), `hourlyRate` (number, default 150)
2. **Calculate Total Hours**: Sum all session hours from template
3. **Cost Range**:
   - `cost_low = totalHours × hourlyRate`
   - `cost_high = totalHours × (hourlyRate + 50)`
4. **Return**: Object with `hours`, `cost_low`, `cost_high`, `currency`

### Currency Conversion (`currency.js`)

1. **Rate Fetching**: On load, call `fetchExchangeRates()` which:
   - Makes GET request to `https://api.frankfurter.app/latest?from=USD&to=EUR,GBP`
   - Updates `currencyState.rates` with live data
   - Falls back to default rates (USD:1, EUR:0.92, GBP:0.79) if API fails
2. **Conversion**: `convertedAmount = amountUSD × rate[targetCurrency]`
3. **Formatting**: Uses `toLocaleString('en-US')` for number formatting

## API Reference

### Public Functions

#### `getBodyPart(key)`
- **Location**: `body-parts.js`
- **Parameters**: `key` (string) - Body part identifier
- **Returns**: Body part object or `null`
- **Example**: `getBodyPart('ribs')` returns the ribs body part object

#### `getBodyPartsByCategory()`
- **Location**: `body-parts.js`
- **Parameters**: None
- **Returns**: Object with category arrays: `{ arms: [...], legs: [...], torso: [...], neck_head: [...], hands_feet: [...] }`

#### `getCurvatureFactor(bodyPartKey, orientation)`
- **Location**: `body-parts.js`
- **Parameters**:
  - `bodyPartKey` (string) - Body part identifier
  - `orientation` (string) - `'vertical'`, `'horizontal'`, or `'wraparound'`
- **Returns**: Number (curvature multiplier)
- **Behavior**: Returns 1.0 if body part not found; applies orientation modifiers

#### `checkDesignFit(bodyPartKey, designWidth, orientation)`
- **Location**: `body-parts.js`
- **Parameters**:
  - `bodyPartKey` (string) - Body part identifier
  - `designWidth` (number) - Design width in cm
  - `orientation` (string) - Design orientation
- **Returns**: Object `{ fits: boolean, wrapPercentage: string, message: string, warning: boolean }`

#### `getTemplate(key)`
- **Location**: `templates.js`
- **Parameters**: `key` (string) - Template identifier
- **Returns**: Template object or `null`

#### `getTemplatesByCategory(category)`
- **Location**: `templates.js`
- **Parameters**: `category` (string) - Category name
- **Returns**: Array of template objects with `key` property

#### `getTemplateCategories()`
- **Location**: `templates.js`
- **Parameters**: None
- **Returns**: Array of unique category strings

#### `calculateTotalHours(templateKey)`
- **Location**: `templates.js`
- **Parameters**: `templateKey` (string)
- **Returns**: Number (total hours across all sessions)

#### `calculateEstimatedCost(templateKey, hourlyRate)`
- **Location**: `templates.js`
- **Parameters**:
  - `templateKey` (string)
  - `hourlyRate` (number, default 150)
- **Returns**: Object `{ hours: number, cost_low: number, cost_high: number, currency: string }`

#### `generateSessionTimeline(templateKey, weeksPerSession)`
- **Location**: `templates.js`
- **Parameters**:
  - `templateKey` (string)
  - `weeksPerSession` (number, default 4)
- **Returns**: Object `{ total_weeks: number, sessions: array }` or `null`

#### `convertCurrency(amountUSD, toCurrency)`
- **Location**: `currency.js`
- **Parameters**:
  - `amountUSD` (number) - Amount in USD
  - `toCurrency` (string, optional) - Target currency code
- **Returns**: Number (converted amount)

#### `formatCurrency(amountUSD, currency)`
- **Location**: `currency.js`
- **Parameters**:
  - `amountUSD` (number) - Amount in USD
  - `currency` (string, optional) - Currency code
- **Returns**: Formatted string (e.g., `"$150"`)

#### `formatCurrencyRange(lowUSD, highUSD, currency)`
- **Location**: `currency.js`
- **Parameters**:
  - `lowUSD` (number) - Low end of range in USD
  - `highUSD` (number) - High end of range in USD
  - `currency` (string, optional) - Currency code
- **Returns**: Formatted range string (e.g., `"$600 - $800"`)

#### `fetchExchangeRates()`
- **Location**: `currency.js`
- **Parameters**: None
- **Returns**: Promise resolving to boolean (success/failure)
- **Behavior**: Fetches live rates from Frankfurter API; updates `currencyState.rates`

### Event Handlers

#### `curvatureForm` submit handler
- **Trigger**: Form submission
- **Behavior**: Calls `calculateCurvatureCompensation()`, displays results

#### `placementForm` submit handler
- **Trigger**: Form submission
- **Behavior**: Calls `checkPlacementFit()`, displays fit analysis

#### `multiSessionForm` submit handler
- **Trigger**: Form submission
- **Behavior**: Calls `calculateProjectTimeline()`, displays session plan

#### `wrapPercentage` slider input handler
- **Trigger**: Slider value change
- **Behavior**: Updates displayed percentage value

#### `templateCategory` change handler
- **Trigger**: Dropdown selection change
- **Behavior**: Filters and displays templates by category

#### `currencySelector` change handler
- **Trigger**: Dropdown selection change
- **Behavior**: Updates `currencyState.currentCurrency`, saves to localStorage, recalculates visible results

## Integration Guide

### Standalone Embedding

The tool is dependency-free static HTML/CSS/JS and can be embedded via iframe:

```html
<iframe
  src="https://poliinternational.com/tools/stencil-calculator/index.html"
  width="100%"
  height="800"
  frameborder="0"
  style="border: 1px solid #ddd; border-radius: 8px;"
  title="Stencil Calculator by Poli International">
</iframe>
```

**Available sizes:**
- Standard: 100% × 800px
- Large: 100% × 1000px
- Compact: 100% × 600px

### Auto-Resizing

The tool automatically sends its height to the parent window via `postMessage`:
- Sends height on load, resize, click, and form changes
- Uses `MutationObserver` to detect dynamic content changes
- Parent window can listen for `message` events to resize the iframe

### Theme Support

When embedded in a WordPress wrapper, the tool listens for theme messages:
```javascript
window.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'poli-theme') {
    // event.data.light = true/false
  }
});
```

## Customization

### Styling

The tool uses CSS custom properties for theming. Override these in your parent page:

```css
:root {
  --primary-color: #3B82F6;
  --background-dark: #0f0f0f;
  --background-card: #1a1a1a;
  --text-primary: #ffffff;
  --text-secondary: #ccc;
}
```

### Currency Configuration

Default exchange rates are set in `currency.js`:
```javascript
rates: {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79
}
```

These are updated live from the Frankfurter API on page load and every 24 hours.

### Template Customization

Add or modify templates in `templates.js` by adding entries to the `placementTemplates` object. Each template requires all fields defined in the [Data Schemas](#placement-templates-database-templatesjs) section.

## Performance

- **Zero external dependencies** - All JavaScript is vanilla ES6+
- **Minimal API calls** - Only two external calls:
  - Frankfurter API for currency rates (once on load, then every 24 hours)
  - Web3Forms for feedback submission (only when form is submitted)
- **Lightweight** - Total page weight under 50KB (HTML + CSS + JS)
- **No images** - All icons use Unicode/emoji characters
- **Efficient DOM updates** - Results sections are hidden/shown, not recreated on each calculation

## Browser Compatibility

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 60+ | Full support |
| Firefox | 55+ | Full support |
| Safari | 12+ | Full support |
| Edge | 79+ | Full support |
| iOS Safari | 12+ | Touch-optimized |
| Android Chrome | 60+ | Touch-optimized |

**Requirements:**
- JavaScript enabled
- HTML5 support
- `fetch()` API (for currency rates and feedback)
- `MutationObserver` (for iframe auto-resizing)
- `localStorage` (for theme and currency preferences)

## Security

### Input Handling

All user inputs are handled safely:

1. **Form Inputs**: Numeric inputs use `type="number"` with `step`, `min`, and `max` attributes for browser-level validation
2. **Select Dropdowns**: All body part and template selections use predefined options - no free-text input for sensitive fields
3. **Feedback Form**: Email field uses `type="email"` for format validation; feedback text is sent via Web3Forms API (not stored locally)
4. **No DOM Injection**: Results are set via `innerHTML` but only with sanitized, pre-computed values from the calculation functions

### XSS Prevention

- No user input is ever executed as code
- All displayed values are numbers or predefined strings from the data objects
- The embed code textarea is `readonly` - users cannot inject content through it
- The iframe embed approach provides natural sandboxing

### Data Privacy

- No cookies are set by the tool
- No user data is stored server-side
- Currency and theme preferences are stored in `localStorage` (client-side only)
- Feedback form data is sent to Web3Forms and forwarded to Poli International via email
- Camera access is not requested by this tool

## Version History

### Version 1.0.0 (February 7, 2026)

- Initial release of the Tattoo Stencil Calculator
- Curvature compensation calculator with 27 body parts
- Placement guide with fit checking
- 16 pre-built project templates
- Multi-session project planner with timeline generation
- Cost estimation with live currency conversion (USD, EUR, GBP)
- Dark/light mode support
- Embeddable via iframe with auto-resizing
- Community feedback form

## Support and Contact

For technical support, bug reports, or integration assistance:

- **Email**: support@poliinternational.com
- **Website**: https://poliinternational.com
- **Contact Form**: https://poliinternational.com/contact-us/
- **Documentation**: https://poliinternational.com/stencil-calculator-documentation/

**Feedback**: Use the built-in feedback form within the tool to report issues or suggest improvements. All feedback is sent directly to the development team.

---

*Technical Standard provided by Poli International Engineering*
