// Currency Conversion Handler
// Uses Frankfurter API (free, no API key required)
// https://www.frankfurter.app/

// Global currency state
const currencyState = {
  currentCurrency: 'USD',
  rates: {
    USD: 1,
    EUR: 0.92,
    GBP: 0.79
  },
  symbols: {
    USD: '$',
    EUR: '€',
    GBP: '£'
  },
  lastUpdate: null
};

// Fetch live exchange rates from Frankfurter API
async function fetchExchangeRates() {
  try {
    // Frankfurter API - free, no API key needed
    const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=EUR,GBP');

    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates');
    }

    const data = await response.json();

    // Update rates
    currencyState.rates.USD = 1; // Base currency
    currencyState.rates.EUR = data.rates.EUR;
    currencyState.rates.GBP = data.rates.GBP;
    currencyState.lastUpdate = new Date();

    console.log('Exchange rates updated:', currencyState.rates);

    return true;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Fall back to default rates if API fails
    console.log('Using default exchange rates');
    return false;
  }
}

// Convert amount from USD to selected currency
function convertCurrency(amountUSD, toCurrency = null) {
  const currency = toCurrency || currencyState.currentCurrency;
  const rate = currencyState.rates[currency] || 1;
  return amountUSD * rate;
}

// Format currency for display
function formatCurrency(amountUSD, currency = null) {
  const curr = currency || currencyState.currentCurrency;
  const converted = convertCurrency(amountUSD, curr);
  const symbol = currencyState.symbols[curr] || '$';

  // Format with proper thousands separator and 2 decimals
  const formatted = converted.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });

  return `${symbol}${formatted}`;
}

// Format currency range (low-high)
function formatCurrencyRange(lowUSD, highUSD, currency = null) {
  const curr = currency || currencyState.currentCurrency;
  const low = formatCurrency(lowUSD, curr);
  const high = formatCurrency(highUSD, curr);
  return `${low} - ${high}`;
}

// Get currency name for display
function getCurrencyName(currency = null) {
  const curr = currency || currencyState.currentCurrency;
  return curr;
}

// Initialize currency system
document.addEventListener('DOMContentLoaded', async function() {
  const currencySelector = document.getElementById('currencySelector');

  if (!currencySelector) return;

  // Fetch live rates on load
  await fetchExchangeRates();

  // Load saved currency preference
  const savedCurrency = localStorage.getItem('stencilCalcCurrency');
  if (savedCurrency && currencyState.rates[savedCurrency]) {
    currencyState.currentCurrency = savedCurrency;
    currencySelector.value = savedCurrency;
  }

  // Handle currency change
  currencySelector.addEventListener('change', function() {
    const newCurrency = this.value;
    currencyState.currentCurrency = newCurrency;
    localStorage.setItem('stencilCalcCurrency', newCurrency);

    // Re-calculate and display any visible results
    updateAllCostDisplays();
  });

  // Update rates every 24 hours
  setInterval(fetchExchangeRates, 24 * 60 * 60 * 1000);
});

// Function to update all cost displays when currency changes
function updateAllCostDisplays() {
  // Check if multi-session results are visible
  const multiSessionResults = document.getElementById('multiSessionResults');
  if (multiSessionResults && multiSessionResults.style.display !== 'none') {
    // Find the form and re-submit to recalculate with new currency
    const projectTemplate = document.getElementById('projectTemplate').value;
    if (projectTemplate) {
      // Trigger recalculation
      const event = new Event('submit', { bubbles: true, cancelable: true });
      document.getElementById('multiSessionForm').dispatchEvent(event);
    }
  }
}
