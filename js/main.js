/**
 * Pinnacle Tech - Main JavaScript File
 * Lightweight Vanilla JS handling WHMCS URL redirects, event tracking, and UI enhancements.
 */

/* ==========================================================================
   1. WHMCS CONFIGURATION & URL MANAGEMENT
   Replace these placeholders with your actual WHMCS product/package order URLs.
   Example: basic: "https://yourdomain.com/whmcs/cart.php?a=add&pid=1"
   ========================================================================== */
const WHMCS_URLS = {
  basic: "https://clients.pinnacletech.us/index.php?rp=/store/pinnacle-website-hosting-and-onging-development/basic-website-care",
  advanced: "https://clients.pinnacletech.us/index.php?rp=/store/pinnacle-website-hosting-and-onging-development/advanced-website-care",
  pro: "https://clients.pinnacletech.us/index.php?rp=/store/pinnacle-website-hosting-and-onging-development/pro-website-care",
  default: "https://clients.pinnacletech.us/index.php?rp=/store/pinnacle-website-hosting-and-onging-development"
};

/* ==========================================================================
   2. TRACKING PREPARATION (Google Analytics & Meta Pixel Placeholders)
   Replace these IDs in your HTML <head> or let main.js initialize them.
   ========================================================================== */
const TRACKING_CONFIG = {
  googleAnalyticsId: "YOUR_GOOGLE_ANALYTICS_ID",
  metaPixelId: "YOUR_META_PIXEL_ID"
};

document.addEventListener("DOMContentLoaded", function () {
  const tableWrapper = document.querySelector(".table-scroll-hint");

  if (!tableWrapper) return;

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          tableWrapper.classList.add("is-hinting");

          setTimeout(function () {
            tableWrapper.classList.remove("is-hinting");
          }, 1300);

          observer.unobserve(tableWrapper);
        }
      });
    },
    {
      threshold: 0.4
    }
  );

  observer.observe(tableWrapper);
});

/**
 * Universal Event Tracker
 * Fires events to Google Analytics & Meta Pixel if configured.
 */
function trackEvent(eventName, eventData = {}) {
  console.log(`[Pinnacle Tech Tracking] Event: ${eventName}`, eventData);
  
  // Google Analytics Event
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, eventData);
  }
  
  // Meta Pixel Event
  if (typeof window.fbq === 'function') {
    window.fbq('track', eventName, eventData);
  }
}

/* ==========================================================================
   3. WHMCS REDIRECT HANDLER
   ========================================================================== */
function handleWHMCSRedirect(planKey) {
  const targetUrl = WHMCS_URLS[planKey] || WHMCS_URLS.default;
  const planNames = {
    basic: "BASIC Plan ($40/month)",
    advanced: "ADVANCED Plan ($60/month - Most Popular)",
    pro: "PRO Plan ($80/month)",
    default: "Pinnacle Tech Starter Plan"
  };
  const planName = planNames[planKey] || "Selected Package";

  // Track the plan selection event
  trackEvent('plan_selected', { plan: planKey, plan_name: planName });

  // Check if WHMCS URL is configured
  const isConfigured = targetUrl && 
                       !targetUrl.includes("YOUR_") && 
                       (targetUrl.startsWith("http://") || targetUrl.startsWith("https://"));

  if (isConfigured) {
    // Redirect directly to the live WHMCS page
      window.open(targetUrl, '_blank', 'noopener,noreferrer');

  } else {
    // Show user-friendly WHMCS Setup Information Modal
    showWHMCSModal(planName, planKey, targetUrl);
  }
}

/**
 * Renders the Bootstrap Modal for unconfigured WHMCS URLs
 */
function showWHMCSModal(planName, planKey, targetUrl) {
  let modalElement = document.getElementById('whmcsConfigModal');
  
  if (!modalElement) {
    const modalHTML = `
      <div class="modal fade" id="whmcsConfigModal" tabindex="-1" aria-labelledby="whmcsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header bg-slate-900 text-white rounded-top-4 p-4">
              <div class="d-flex align-items-center gap-3">
                <div class="bg-primary bg-opacity-25 p-2 rounded-3 text-primary fs-4">
                  <i class="bi bi-box-arrow-up-right"></i>
                </div>
                <div>
                  <h5 class="modal-title mb-0 fw-bold" id="whmcsModalLabel">WHMCS Order Link Notice</h5>
                  <small class="text-slate-400">Pinnacle Tech Integration Helper</small>
                </div>
              </div>
              <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body p-4 text-slate-700">
              <div class="alert alert-info border-0 bg-primary bg-opacity-10 text-primary mb-3 rounded-3">
                <i class="bi bi-info-circle-fill me-2"></i> You selected the <strong id="modalPlanName"></strong>.
              </div>
              <p class="mb-3 fs-6">
                In production, clicking this button redirects your customer directly to your <strong>WHMCS</strong> order cart to complete their account creation and payment.
              </p>
              <div class="bg-slate-100 p-3 rounded-3 border mb-3 font-monospace fs-7">
                <div class="text-slate-500 mb-1">// Currently configured URL:</div>
                <code class="text-primary fw-bold" id="modalConfiguredUrl">${targetUrl}</code>
              </div>
              <p class="small text-slate-500 mb-0">
                <i class="bi bi-gear-fill me-1"></i> To connect your live WHMCS links, open <code>js/main.js</code> and update the <code>WHMCS_URLS.${planKey}</code> property!
              </p>
            </div>
            <div class="modal-footer bg-slate-50 p-3 rounded-bottom-4">
              <button type="button" class="btn btn-pt-secondary" data-bs-dismiss="modal">Close Preview</button>
              <button type="button" class="btn btn-pt-primary" onclick="window.scrollTo({top: 0, behavior: 'smooth'}); bootstrap.Modal.getInstance(document.getElementById('whmcsConfigModal')).hide();">
                Got It
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    modalElement = document.getElementById('whmcsConfigModal');
  } else {
    document.getElementById('modalPlanName').textContent = planName;
    document.getElementById('modalConfiguredUrl').textContent = targetUrl;
  }

  const bsModal = new bootstrap.Modal(modalElement);
  bsModal.show();
}

/* ==========================================================================
   4. DOM CONTENT LOADED EVENT LISTENERS
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  // Bind all WHMCS action buttons
  document.querySelectorAll('[data-whmcs-plan]').forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const planKey = button.getAttribute('data-whmcs-plan');
      handleWHMCSRedirect(planKey);
    });
  });

  // Track page view event
  trackEvent('page_view', { page: window.location.pathname });

  // FAQ Search Filter (if on FAQ page)
  const faqSearchInput = document.getElementById('faqSearchInput');
  if (faqSearchInput) {
    faqSearchInput.addEventListener('keyup', function() {
      const query = this.value.toLowerCase().trim();
      const accordionItems = document.querySelectorAll('.accordion-item');
      
      accordionItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // Contact Form Submission Handler (Frontend Preview)
  const contactForm = document.getElementById('pinnacleContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const submitBtn = this.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2" role="status"></span> Sending message...`;
      
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        
        // Show success alert
        const alertBox = document.getElementById('contactFormAlert');
        if (alertBox) {
          alertBox.className = 'alert alert-success border-0 shadow-sm rounded-3 mt-3 d-block';
          alertBox.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i> Thank you! Your message has been sent. Our team will contact you shortly.`;
        }
        
        contactForm.reset();
        trackEvent('contact_form_submitted');
      }, 1200);
    });
  }
});
