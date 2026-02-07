// Stencil Calculator - Main Logic
// Handles all calculations, form submissions, and UI updates

document.addEventListener('DOMContentLoaded', function() {
  // Tab switching functionality
  const tabButtons = document.querySelectorAll('.stencil-calculator__tab');
  const tabContents = document.querySelectorAll('.stencil-calculator__tab-content');

  tabButtons.forEach(button => {
    button.addEventListener('click', function() {
      const tabName = this.getAttribute('data-tab');

      // Remove active class from all tabs and contents
      tabButtons.forEach(btn => {
        btn.classList.remove('stencil-calculator__tab--active');
      });
      tabContents.forEach(content => {
        content.classList.remove('stencil-calculator__tab-content--active');
      });

      // Add active class to clicked tab and corresponding content
      this.classList.add('stencil-calculator__tab--active');
      document.getElementById('tab-' + tabName).classList.add('stencil-calculator__tab-content--active');
    });
  });

  // ========== TAB 1: CURVATURE COMPENSATION CALCULATOR ==========
  const curvatureForm = document.getElementById('curvatureForm');
  const curvatureResults = document.getElementById('curvatureResults');

  if (curvatureForm) {
    curvatureForm.addEventListener('submit', function(e) {
      e.preventDefault();
      calculateCurvatureCompensation();
    });
  }

  function calculateCurvatureCompensation() {
    // Get form values
    const designWidth = parseFloat(document.getElementById('designWidth').value);
    const designHeight = parseFloat(document.getElementById('designHeight').value);
    const bodyPartKey = document.getElementById('bodyPart').value;
    const orientation = document.getElementById('orientation').value;

    // Validate inputs
    if (!designWidth || !designHeight || !bodyPartKey) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    // Get body part data
    const bodyPart = getBodyPart(bodyPartKey);
    if (!bodyPart) {
      showMessage('Invalid body part selected', 'error');
      return;
    }

    // Calculate curvature factor based on orientation
    const curvatureFactor = getCurvatureFactor(bodyPartKey, orientation);

    // Calculate stencil size
    const stencilWidth = (designWidth * curvatureFactor).toFixed(1);
    const stencilHeight = (designHeight * curvatureFactor).toFixed(1);

    // Calculate print percentage (how much to enlarge on printer)
    const printPercentageWidth = (curvatureFactor * 100).toFixed(0);
    const printPercentageHeight = (curvatureFactor * 100).toFixed(0);

    // Check if design fits
    const fitCheck = checkDesignFit(bodyPartKey, designWidth, orientation);

    // Display results
    displayCurvatureResults({
      bodyPart: bodyPart,
      designWidth: designWidth,
      designHeight: designHeight,
      stencilWidth: stencilWidth,
      stencilHeight: stencilHeight,
      curvatureFactor: curvatureFactor,
      printPercentageWidth: printPercentageWidth,
      printPercentageHeight: printPercentageHeight,
      orientation: orientation,
      fitCheck: fitCheck
    });

    // Show results section
    curvatureResults.style.display = 'block';
    curvatureResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function displayCurvatureResults(data) {
    const resultsHTML = `
      <div class="stencil-calculator__result-card">
        <h3>📏 Stencil Size Calculations</h3>
        <div class="stencil-calculator__result-grid">
          <div class="result-item">
            <span class="result-label">Body Part:</span>
            <span class="result-value">${data.bodyPart.name}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Design Size (On Skin):</span>
            <span class="result-value">${data.designWidth} × ${data.designHeight} cm</span>
          </div>
          <div class="result-item">
            <span class="result-label">Stencil Size (Print This):</span>
            <span class="result-value result-highlight">${data.stencilWidth} × ${data.stencilHeight} cm</span>
          </div>
          <div class="result-item">
            <span class="result-label">Printer Scale:</span>
            <span class="result-value">${data.printPercentageWidth}% width, ${data.printPercentageHeight}% height</span>
          </div>
          <div class="result-item">
            <span class="result-label">Curvature Factor:</span>
            <span class="result-value">${data.curvatureFactor.toFixed(2)}x</span>
          </div>
          <div class="result-item">
            <span class="result-label">Orientation:</span>
            <span class="result-value">${data.orientation.charAt(0).toUpperCase() + data.orientation.slice(1)}</span>
          </div>
        </div>

        <div class="stencil-calculator__fit-check ${data.fitCheck.warning ? 'warning' : 'success'}">
          <strong>${data.fitCheck.fits ? '✅ Fit Check:' : '❌ Fit Check:'}</strong>
          <p>${data.fitCheck.message}</p>
        </div>

        <div class="stencil-calculator__placement-notes">
          <strong>💡 Placement Notes:</strong>
          <p>${data.bodyPart.placement_notes}</p>
        </div>

        <div class="stencil-calculator__instructions">
          <h4>📝 How to Use This Stencil:</h4>
          <ol>
            <li>Print your design at <strong>${data.printPercentageWidth}% scale</strong> (${data.stencilWidth} × ${data.stencilHeight} cm)</li>
            <li>Create stencil using thermal printer or stencil paper</li>
            <li>Apply to ${data.bodyPart.name} in ${data.orientation} orientation</li>
            <li>When design contracts to body curvature, it will measure your target size: ${data.designWidth} × ${data.designHeight} cm</li>
          </ol>
        </div>
      </div>
    `;

    curvatureResults.innerHTML = resultsHTML;
  }

  // ========== TAB 2: PLACEMENT GUIDE ==========
  const placementForm = document.getElementById('placementForm');
  const placementResults = document.getElementById('placementResults');

  if (placementForm) {
    placementForm.addEventListener('submit', function(e) {
      e.preventDefault();
      checkPlacementFit();
    });
  }

  // Update wrap percentage display
  const wrapSlider = document.getElementById('wrapPercentage');
  const wrapValue = document.getElementById('wrapValue');
  if (wrapSlider && wrapValue) {
    wrapSlider.addEventListener('input', function() {
      wrapValue.textContent = this.value + '%';
    });
  }

  function checkPlacementFit() {
    const width = parseFloat(document.getElementById('fitWidth').value);
    const bodyPartKey = document.getElementById('fitBodyPart').value;
    const wrapPercentage = parseFloat(document.getElementById('wrapPercentage').value);

    if (!width || !bodyPartKey) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    const bodyPart = getBodyPart(bodyPartKey);
    if (!bodyPart) {
      showMessage('Invalid body part', 'error');
      return;
    }

    // Check if design fits
    const fitCheck = checkDesignFit(bodyPartKey, width, 'horizontal');

    // Display results
    displayFitResults({
      bodyPart: bodyPart,
      width: width,
      wrapPercentage: wrapPercentage,
      fitCheck: fitCheck
    });

    placementResults.style.display = 'block';
    placementResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function displayFitResults(data) {
    const circumference = data.bodyPart.circumference_average;
    const actualWrap = (data.width / circumference) * 100;

    let statusClass = 'success';
    let statusIcon = '✅';
    let statusMessage = 'Perfect fit!';

    if (actualWrap > 100) {
      statusClass = 'error';
      statusIcon = '❌';
      statusMessage = 'Design is too large!';
    } else if (actualWrap > data.bodyPart.wrap_threshold) {
      statusClass = 'warning';
      statusIcon = '⚠️';
      statusMessage = 'Significant wrapping - expect distortion';
    }

    const resultsHTML = `
      <div class="stencil-calculator__result-card ${statusClass}">
        <h3>${statusIcon} Placement Fit Analysis</h3>
        <div class="stencil-calculator__result-grid">
          <div class="result-item">
            <span class="result-label">Body Part:</span>
            <span class="result-value">${data.bodyPart.name}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Average Circumference:</span>
            <span class="result-value">${circumference} cm</span>
          </div>
          <div class="result-item">
            <span class="result-label">Design Width:</span>
            <span class="result-value">${data.width} cm</span>
          </div>
          <div class="result-item">
            <span class="result-label">Actual Wrap Percentage:</span>
            <span class="result-value result-highlight">${actualWrap.toFixed(1)}%</span>
          </div>
        </div>

        <div class="stencil-calculator__fit-status ${statusClass}">
          <strong>${statusMessage}</strong>
          <p>${data.fitCheck.message}</p>
        </div>

        <div class="stencil-calculator__placement-notes">
          <strong>💡 Placement Notes:</strong>
          <p>${data.bodyPart.placement_notes}</p>
          <p><strong>Recommended Orientations:</strong> ${data.bodyPart.recommended_orientation.join(', ')}</p>
        </div>
      </div>
    `;

    placementResults.innerHTML = resultsHTML;
  }

  // ========== TAB 3: TEMPLATE LIBRARY ==========
  const templateCategory = document.getElementById('templateCategory');
  const templatesGrid = document.getElementById('templatesGrid');

  if (templateCategory) {
    // Populate categories
    const categories = getTemplateCategories();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
      templateCategory.appendChild(option);
    });

    // Load templates on category change
    templateCategory.addEventListener('change', function() {
      loadTemplates(this.value);
    });

    // Load all templates initially
    loadTemplates('all');
  }

  function loadTemplates(category) {
    if (!templatesGrid) return;

    let templates = [];

    if (category === 'all') {
      // Get all templates
      for (const [key, template] of Object.entries(placementTemplates)) {
        templates.push({ key: key, ...template });
      }
    } else {
      templates = getTemplatesByCategory(category);
    }

    // Display templates
    displayTemplates(templates);
  }

  function displayTemplates(templates) {
    if (templates.length === 0) {
      templatesGrid.innerHTML = '<p class="no-results">No templates found in this category.</p>';
      return;
    }

    const templatesHTML = templates.map(template => {
      const totalHours = calculateTotalHours(template.key);
      const difficultyClass = template.difficulty;

      return `
        <div class="template-card" data-template="${template.key}">
          <div class="template-header">
            <h4>${template.name}</h4>
            <span class="template-difficulty ${difficultyClass}">${template.difficulty}</span>
          </div>
          <div class="template-body">
            <div class="template-detail">
              <strong>Dimensions:</strong> ${template.estimated_dimensions.width} × ${template.estimated_dimensions.height} ${template.estimated_dimensions.unit}
            </div>
            <div class="template-detail">
              <strong>Sessions:</strong> ${template.session_plan.total_sessions} (${totalHours} hours total)
            </div>
            <div class="template-detail">
              <strong>Body Parts:</strong> ${template.body_parts.length}
            </div>
            <div class="template-notes">
              ${template.notes}
            </div>
          </div>
          <button class="template-view-btn" onclick="viewTemplateDetails('${template.key}')">
            View Full Details →
          </button>
        </div>
      `;
    }).join('');

    templatesGrid.innerHTML = templatesHTML;
  }

  // Make viewTemplateDetails globally accessible
  window.viewTemplateDetails = function(templateKey) {
    const template = getTemplate(templateKey);
    if (!template) return;

    const totalHours = calculateTotalHours(templateKey);
    const cost = calculateEstimatedCost(templateKey);
    const timeline = generateSessionTimeline(templateKey);

    // Create modal or expand details
    const modalHTML = `
      <div class="template-modal-overlay" onclick="closeTemplateModal()">
        <div class="template-modal" onclick="event.stopPropagation()">
          <button class="template-modal-close" onclick="closeTemplateModal()">×</button>
          <h2>${template.name}</h2>
          <div class="template-modal-content">
            <div class="template-section">
              <h3>📐 Dimensions</h3>
              <p><strong>${template.estimated_dimensions.width} × ${template.estimated_dimensions.height} ${template.estimated_dimensions.unit}</strong></p>
            </div>

            <div class="template-section">
              <h3>📍 Body Parts</h3>
              <ul>
                ${template.body_parts.map(bp => {
                  const bodyPart = getBodyPart(bp);
                  return `<li>${bodyPart ? bodyPart.name : bp}</li>`;
                }).join('')}
              </ul>
            </div>

            <div class="template-section">
              <h3>⏱️ Session Plan (${template.session_plan.total_sessions} sessions, ${totalHours} hours)</h3>
              <div class="session-timeline">
                ${timeline.sessions.map(session => `
                  <div class="session-item">
                    <div class="session-number">Session ${session.session_number}</div>
                    <div class="session-details">
                      <strong>${session.focus}</strong> (${session.hours} hours)
                      <div class="session-week">Week ${session.week}</div>
                      <div class="session-healing">${session.healing_note}</div>
                    </div>
                  </div>
                `).join('')}
              </div>
              <p class="timeline-total"><strong>Total Project Timeline: ~${Math.ceil(timeline.total_weeks)} weeks</strong></p>
            </div>

            <div class="template-section">
              <h3>💰 Estimated Cost</h3>
              <p>Based on $150/hour average: <strong>${formatCurrencyRange(cost.cost_low, cost.cost_high)}</strong></p>
              <p class="cost-note"><em>Actual costs vary by artist, location, and complexity. Currency: ${getCurrencyName()}</em></p>
            </div>

            <div class="template-section">
              <h3>💡 Notes</h3>
              <p>${template.notes}</p>
            </div>

            <div class="template-section">
              <h3>📊 Difficulty</h3>
              <span class="template-difficulty ${template.difficulty}">${template.difficulty.toUpperCase()}</span>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  };

  window.closeTemplateModal = function() {
    const modal = document.querySelector('.template-modal-overlay');
    if (modal) {
      modal.remove();
    }
  };

  // ========== TAB 4: MULTI-SESSION PLANNER ==========
  const multiSessionForm = document.getElementById('multiSessionForm');
  const multiSessionResults = document.getElementById('multiSessionResults');

  if (multiSessionForm) {
    multiSessionForm.addEventListener('submit', function(e) {
      e.preventDefault();
      calculateProjectTimeline();
    });
  }

  function calculateProjectTimeline() {
    const projectTemplate = document.getElementById('projectTemplate').value;
    const weeksPerSession = parseInt(document.getElementById('weeksPerSession').value);
    const hourlyRate = parseFloat(document.getElementById('hourlyRate').value);

    if (!projectTemplate || !weeksPerSession || !hourlyRate) {
      showMessage('Please fill in all fields', 'error');
      return;
    }

    const template = getTemplate(projectTemplate);
    if (!template) {
      showMessage('Invalid template', 'error');
      return;
    }

    const timeline = generateSessionTimeline(projectTemplate, weeksPerSession);
    const cost = calculateEstimatedCost(projectTemplate, hourlyRate);

    displayProjectTimeline({
      template: template,
      timeline: timeline,
      cost: cost,
      hourlyRate: hourlyRate
    });

    multiSessionResults.style.display = 'block';
    multiSessionResults.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function displayProjectTimeline(data) {
    const resultsHTML = `
      <div class="stencil-calculator__result-card">
        <h3>📅 Project Timeline: ${data.template.name}</h3>

        <div class="stencil-calculator__result-grid">
          <div class="result-item">
            <span class="result-label">Total Sessions:</span>
            <span class="result-value">${data.template.session_plan.total_sessions}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Total Hours:</span>
            <span class="result-value">${data.cost.hours}</span>
          </div>
          <div class="result-item">
            <span class="result-label">Project Duration:</span>
            <span class="result-value result-highlight">~${Math.ceil(data.timeline.total_weeks)} weeks</span>
          </div>
          <div class="result-item">
            <span class="result-label">Estimated Cost:</span>
            <span class="result-value result-highlight">${formatCurrencyRange(data.cost.cost_low, data.cost.cost_high)}</span>
          </div>
        </div>

        <div class="session-timeline">
          <h4>Session Breakdown:</h4>
          ${data.timeline.sessions.map(session => `
            <div class="session-item">
              <div class="session-number">Session ${session.session_number}</div>
              <div class="session-details">
                <strong>${session.focus}</strong>
                <div class="session-meta">
                  ${session.hours} hours | Week ${session.week} | ${formatCurrency(session.hours * data.hourlyRate)}
                </div>
                <div class="session-healing">${session.healing_note}</div>
              </div>
            </div>
          `).join('')}
        </div>

        <div class="stencil-calculator__placement-notes">
          <strong>💡 Project Notes:</strong>
          <p>${data.template.notes}</p>
        </div>
      </div>
    `;

    multiSessionResults.innerHTML = resultsHTML;
  }

  // ========== HELPER FUNCTIONS ==========
  function showMessage(message, type = 'info') {
    // Create message element
    const messageEl = document.createElement('div');
    messageEl.className = `stencil-calculator__message stencil-calculator__message--${type}`;
    messageEl.textContent = message;

    // Insert at top of page
    document.body.insertBefore(messageEl, document.body.firstChild);

    // Remove after 5 seconds
    setTimeout(() => {
      messageEl.remove();
    }, 5000);
  }

  // Populate project template dropdown
  const projectTemplateSelect = document.getElementById('projectTemplate');
  if (projectTemplateSelect) {
    for (const [key, template] of Object.entries(placementTemplates)) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = `${template.name} (${template.session_plan.total_sessions} sessions)`;
      projectTemplateSelect.appendChild(option);
    }
  }
});
