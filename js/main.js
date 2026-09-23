/**
 * XOTIC QUEENS BEAUTY & MEDSPA — REFINED JAVASCRIPT
 * Port Harcourt, Nigeria · CPD & ITEC Certified Clinical Medspa
 * Brand Palette: Royal Green #1A5C38 | Deep Forest #0F3D25 | Signature Gold #C9A84C
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSequence();
  initStickyHeader();
  initMobileDrawer();
  initFloatingDock();
  initTestimonialsMobile();
  initTreatmentTabs();
  initCardTiltEffect();
  initSkinAnalyzer3D();
  initBeforeAfterSlider();
  initPatientJourneyTracker();
  initBookingModal();
  initSmoothScroll();
  initScrollReveal();

  // Test helper: scroll to section if specified via query param (e.g. ?section=skin-analyzer)
  const urlParams = new URLSearchParams(window.location.search);
  const sectionTarget = urlParams.get('section');
  if (sectionTarget) {
    const el = document.getElementById(sectionTarget);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView();
      }, 300);
    }
  }
});

/* ==========================================================================
   0. CINEMATIC PHOTOGRAPHIC MOTION REEL & MASKED REVEALS
   ========================================================================== */
function initHeroSequence() {
  const heroSection = document.querySelector('.hero-section');
  if (!heroSection) return;

  // Trigger masked text reveals and entrance animations
  requestAnimationFrame(() => {
    setTimeout(() => {
      heroSection.classList.add('hero-loaded');
    }, 120);
  });

  // Cinema Photographic Reel Controller
  const slides = document.querySelectorAll('.cinema-slide');
  const dots = document.querySelectorAll('.cinema-dot');
  const currentTag = document.getElementById('cinemaCurrentTag');
  const currentTitle = document.getElementById('cinemaCurrentTitle');
  const currentTech = document.getElementById('cinemaCurrentTech');

  if (!slides.length) return;

  let currentIndex = 0;
  let timer = null;
  let isPaused = false;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function goToSlide(index) {
    if (index < 0) index = slides.length - 1;
    if (index >= slides.length) index = 0;
    currentIndex = index;

    slides.forEach((slide, i) => {
      if (i === currentIndex) {
        slide.classList.add('active');
        const label = slide.getAttribute('data-label') || '';
        const tech = slide.getAttribute('data-tech') || '';
        if (currentTag) currentTag.textContent = `PROCEDURE 0${currentIndex + 1} / 0${slides.length}`;
        if (currentTitle) currentTitle.textContent = label;
        if (currentTech) currentTech.textContent = tech;
      } else {
        slide.classList.remove('active');
      }
    });

    dots.forEach((dot, i) => {
      if (i === currentIndex) {
        dot.classList.add('active');
        dot.setAttribute('aria-selected', 'true');
      } else {
        dot.classList.remove('active');
        dot.setAttribute('aria-selected', 'false');
      }
    });
  }

  function nextSlide() {
    if (!isPaused && !prefersReducedMotion) {
      goToSlide(currentIndex + 1);
    }
  }

  function startAutoplay() {
    if (prefersReducedMotion) return;
    stopAutoplay();
    timer = setInterval(nextSlide, 5500);
  }

  function stopAutoplay() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }

  // Dots click events
  dots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const targetIdx = parseInt(dot.getAttribute('data-slide'), 10);
      if (!isNaN(targetIdx)) {
        goToSlide(targetIdx);
        startAutoplay(); // reset timer on manual interaction
      }
    });
  });

  // Pause on hover over cinema frame
  const cinemaFrame = document.querySelector('.hero-cinema-frame');
  if (cinemaFrame) {
    cinemaFrame.addEventListener('mouseenter', () => { isPaused = true; });
    cinemaFrame.addEventListener('mouseleave', () => { isPaused = false; });
  }

  // Observe visibility so reel doesn't run when offscreen
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isPaused = false;
          startAutoplay();
        } else {
          isPaused = true;
          stopAutoplay();
        }
      });
    }, { threshold: 0.15 });

    observer.observe(heroSection);
  } else {
    startAutoplay();
  }
}

/* ==========================================================================
   1. STICKY HEADER WITH RESTRAINED BLUR & COMPRESSION
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   2. MOBILE DRAWER NAVIGATION
   ========================================================================== */
function initMobileDrawer() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const closeBtn = document.querySelector('.mobile-close-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const overlay = document.querySelector('.drawer-overlay');
  const navLinks = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('active');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('active');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  navLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });
}

/* ==========================================================================
   3. EDITORIAL TREATMENT DISCOVERY — CONCERN PATHWAYS SWITCHER
   ========================================================================== */
function initTreatmentTabs() {
  const tabs = document.querySelectorAll('.pathway-tab-btn');
  const panels = document.querySelectorAll('.pathway-panel');

  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const concern = tab.getAttribute('data-concern');
      if (!concern) return;

      // Update Tabs State
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Update Pathway Panels
      panels.forEach(panel => {
        panel.classList.remove('active-panel');
      });

      const targetPanel = document.getElementById(`pathway-${concern}`);
      if (targetPanel) {
        targetPanel.classList.add('active-panel');
      }
    });
  });
}

/* ==========================================================================
   4. RESTRAINED 3D CARD TILT (DESKTOP MOUSEMOVE ONLY)
   ========================================================================== */
function initCardTiltEffect() {
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!isFinePointer || prefersReduced) return;

  const cards = document.querySelectorAll('.treatment-card');
  const maxTilt = 3; // Maximum tilt angle in degrees for restrained luxury feel

  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const normX = (x / rect.width) * 2 - 1; // -1 to 1
      const normY = (y / rect.height) * 2 - 1; // -1 to 1

      const tiltX = -normY * maxTilt;
      const tiltY = normX * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) translateY(-5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ==========================================================================
   5. SIGNATURE 3D SKIN ANALYZER EXPERIENCE (Dynamic Stratified Depth)
   ========================================================================== */
function initSkinAnalyzer3D() {
  const paramButtons = document.querySelectorAll('.param-marker-btn, .param-pill-btn');
  const depthBeam = document.getElementById('depth-beam');
  const depthReadout = document.getElementById('visualizer-depth-readout');
  const strataCards = document.querySelectorAll('.strata-layer-card');

  // Console card fields
  const markerEl = document.getElementById('analyzer-marker');
  const depthEl = document.getElementById('analyzer-depth');
  const statusEl = document.getElementById('analyzer-status');
  const suitabilityEl = document.getElementById('analyzer-suitability');
  const protocolEl = document.getElementById('analyzer-protocol');
  const descEl = document.getElementById('analyzer-desc');

  if (!paramButtons.length) return;

  // 8 Verified Clinical Parameters with Anatomical Strata Mapping
  const parameterData = {
    pigmentation: {
      strata: "epidermal-melanin",
      depthMm: "0.10 mm",
      marker: "Pigmentation & Melanin Dispersion",
      primaryLayer: "Epidermal Melanin Zone (0.10mm)",
      status: "Localized Melanin Clusters Detected",
      suitability: "Fitzpatrick IV–VI Safe",
      protocol: "Targeted Chemical Peel + Mesotherapy Infusion",
      desc: "Assessment identifies trapped epidermal pigmentation. Queen recommends our corrective peel protocol combined with nutrient infusion to clear dark spots safely without post-inflammatory risk."
    },
    hydration: {
      strata: "stratum-corneum",
      depthMm: "0.02 mm",
      marker: "Hydration & Moisture Barrier Integrity",
      primaryLayer: "Stratum Corneum (0.02mm)",
      status: "Elevated Transepidermal Water Loss (TEWL)",
      suitability: "Universal Skin Suitability",
      protocol: "HydraFacial Deluxe + Lipid Barrier Restoration",
      desc: "Surface dehydration impairs barrier function. Our restorative protocol infuses medical-grade hyaluronic acid and biomimetic ceramides to lock in moisture and soothe sensitivity."
    },
    pores: {
      strata: "stratum-corneum",
      depthMm: "0.05 mm",
      marker: "Pores & Surface Texture Uniformity",
      primaryLayer: "Stratum Corneum & Follicular Inlets",
      status: "Keratin Congestion & Visible Pores",
      suitability: "Acne-Prone & Textured Skin",
      protocol: "Clinical Clarifying Facial + AquaGold Micro-Channeling",
      desc: "Pore dilation and follicular debris detected. Queen uses targeted gentle acid extractions combined with micro-channeling to smooth epidermal texture without trauma."
    },
    wrinkles: {
      strata: "deep-dermis",
      depthMm: "1.50 mm",
      marker: "Fine Lines & Structural Collagen Density",
      primaryLayer: "Reticular Dermis (1.50mm)",
      status: "Dermal Matrix Depletion & Expression Creases",
      suitability: "Mature & Volume-Loss Patients",
      protocol: "PDO Thread Lift + Hyaluronic Profile Contouring",
      desc: "Structural laxity identified in deep dermal scaffolding. Dissolvable PDO collagen-stimulating threads paired with filler contouring restore firm, natural facial architecture."
    },
    acne: {
      strata: "dermo-epidermal",
      depthMm: "0.50 mm",
      marker: "Acne Bacteria & Follicular Inflammation",
      primaryLayer: "Dermo-Epidermal Junction (0.50mm)",
      status: "Subsurface Bacterial Colonization & Erythema",
      suitability: "Active Breakouts & Melanin Skin Safe",
      protocol: "Anti-Acne Purifying Peel + High-Frequency Therapy",
      desc: "Deep follicular inflammation detected beneath visible blemishes. Queen's clarifying peel protocol eliminates p.acnes bacteria while preventing hyperpigmented scarring."
    },
    uv: {
      strata: "epidermal-melanin",
      depthMm: "0.10 mm",
      marker: "UV Photo-Aging & Actinic Micro-Damage",
      primaryLayer: "Epidermal Melanin Zone (0.10mm)",
      status: "Subsurface Solar Oxidative Stress",
      suitability: "Melanin-Rich Skin Specialization",
      protocol: "PRX-T33 Biorevitalization + Glutathione IV Drip",
      desc: "Solar oxidative damage detected in upper basal cells. Needle-free PRX revitalization stimulates cellular regeneration while antioxidant IV therapy neutralizes systemic free radicals."
    },
    tone: {
      strata: "dermo-epidermal",
      depthMm: "0.50 mm",
      marker: "Skin Tone Uniformity & Capillary Circulation",
      primaryLayer: "Dermo-Epidermal Junction (0.50mm)",
      status: "Uneven Vascular Pattern & Dull Tone",
      suitability: "All Fitzpatrick Phototypes",
      protocol: "Radiance Glow IV Infusion + Enzyme Micro-Peel",
      desc: "Vascular irregularity and sluggish cellular turnover identified. Our signature brightening infusion and botanical enzyme peel restore even radiance across the entire face."
    },
    sebum: {
      strata: "stratum-corneum",
      depthMm: "0.03 mm",
      marker: "Sebum & Lipid Balance Regulation",
      primaryLayer: "Stratum Corneum & Sebaceous Duct",
      status: "Excess Lipid Excretion & Surface Shine",
      suitability: "Oily & Combination Complexions",
      protocol: "Botanical Mattifying Treatment + Micro-Exfoliation",
      desc: "Sebaceous hyper-activity causing midday congestion. Queen balances sebum secretion using oil-regulating actives, clarifying masks, and light hydration seals."
    }
  };

  function updateDepthVisualizer(paramKey) {
    const data = parameterData[paramKey];
    if (!data) return;

    // 1. Highlight Strata Card
    let targetCard = null;
    strataCards.forEach(card => {
      if (card.getAttribute('data-strata') === data.strata) {
        card.classList.add('is-active-layer');
        targetCard = card;
      } else {
        card.classList.remove('is-active-layer');
      }
    });

    // 2. Position Gold Marker Beam
    if (depthBeam && targetCard) {
      const cardTop = targetCard.offsetTop;
      const cardHeight = targetCard.offsetHeight;
      depthBeam.style.top = `${cardTop + (cardHeight / 2) - 24}px`;
    }

    // 3. Update Visualizer Depth Readout
    if (depthReadout) {
      depthReadout.textContent = `Target Depth: ${data.depthMm}`;
    }

    // 4. Update Console Card with Smooth Micro-Fade
    const consoleCard = document.querySelector('.analyzer-console-card');
    if (consoleCard) {
      consoleCard.style.opacity = '0.75';
      setTimeout(() => {
        if (markerEl) markerEl.textContent = data.marker;
        if (depthEl) depthEl.textContent = data.primaryLayer;
        if (statusEl) statusEl.textContent = data.status;
        if (suitabilityEl) suitabilityEl.textContent = data.suitability;
        if (protocolEl) protocolEl.textContent = data.protocol;
        if (descEl) descEl.textContent = data.desc;
        consoleCard.style.opacity = '1';
      }, 100);
    }
  }

  // Setup Button Click Listeners
  paramButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      paramButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const param = btn.getAttribute('data-param');
      updateDepthVisualizer(param);
    });
  });

  // Initial alignment of depth beam
  setTimeout(() => {
    updateDepthVisualizer('pigmentation');
  }, 250);
}

/* ==========================================================================
   6. REAL RESULTS — BEFORE & AFTER COMPARISON SLIDER & CATEGORIZED CASE SWITCHER
   ========================================================================== */
function initBeforeAfterSlider() {
  const slider = document.querySelector('.ba-range-slider');
  const afterLayer = document.getElementById('ba-after-layer') || document.querySelector('.ba-after-layer');
  const handleLine = document.getElementById('ba-handle-line') || document.querySelector('.ba-handle-line');
  const handleThumb = document.getElementById('ba-handle-thumb') || document.querySelector('.ba-handle-thumb');
  const container = document.querySelector('.ba-slider-component');

  const caseTabs = document.querySelectorAll('.case-tab-btn');
  const imgBefore = document.getElementById('ba-img-before');
  const imgAfter = document.getElementById('ba-img-after');
  const caseIdTag = document.getElementById('case-id-tag');
  const caseTitle = document.getElementById('case-procedure-title');
  const caseSummary = document.getElementById('case-summary-text');
  const caseProc = document.getElementById('case-spec-procedure');
  const caseTimeline = document.getElementById('case-spec-timeline');
  const caseDowntime = document.getElementById('case-spec-downtime');
  const caseRes = document.getElementById('case-spec-result');

  if (!slider || !afterLayer || !handleLine || !handleThumb) return;

  function updateSlider(val) {
    afterLayer.style.width = `${val}%`;
    handleLine.style.left = `${val}%`;
    handleThumb.style.left = `${val}%`;
  }

  slider.addEventListener('input', (e) => {
    updateSlider(e.target.value);
  });

  if (container) {
    let isDragging = false;

    function moveHandler(clientX) {
      const rect = container.getBoundingClientRect();
      let offsetX = clientX - rect.left;
      let percentage = (offsetX / rect.width) * 100;
      percentage = Math.max(0, Math.min(100, percentage));
      slider.value = percentage;
      updateSlider(percentage);
    }

    container.addEventListener('mousedown', (e) => {
      isDragging = true;
      moveHandler(e.clientX);
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      moveHandler(e.clientX);
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    container.addEventListener('touchstart', (e) => {
      isDragging = true;
      if (e.touches[0]) moveHandler(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      if (!isDragging || !e.touches[0]) return;
      moveHandler(e.touches[0].clientX);
    }, { passive: true });

    window.addEventListener('touchend', () => {
      isDragging = false;
    });
  }

  // 3 Verified Clinical Case Studies
  const caseData = {
    case1: {
      id: "CASE REF: XQ-PB01",
      beforeImg: "assets/img/before-after/profile-balancing.jpg",
      afterImg: "assets/img/before-after/profile-balancing-2.jpg",
      title: "Non-Surgical Facial Profile Balancing",
      summary: "Patient presented with lower-face recession and a retruded chin profile affecting lateral facial proportions. Queen Uboegbulam performed cannula-directed hyaluronic acid contouring to restore harmonious chin projection, sharpen the mandibular jawline, and establish aesthetic symmetry without surgery or incisions.",
      procedure: "Dermal Fillers + Blunt Cannula Profile Balancing",
      timeline: "Single In-Clinic Session · 45 Minutes",
      downtime: "Minimal (24–48 Hours Social Downtime)",
      result: "Refined Chin Projection & Symmetrical Jawline"
    },
    case2: {
      id: "CASE REF: XQ-CP04",
      beforeImg: "assets/img/blog/chemical-peel-black.png",
      afterImg: "assets/img/blog/microneedling-black.png",
      title: "Melanin-Safe Corrective Chemical Peel Series",
      summary: "Client presented with chronic epidermal melasma and post-inflammatory dark marks across the mid-face. Queen administered our specialized multi-acid peel series formulated for Fitzpatrick IV–VI complexions, gently lifting stubborn pigment clusters with zero rebound hyperpigmentation.",
      procedure: "Multi-Acid Melanin-Safe Peel + Tyrosinase Inhibitor Protocol",
      timeline: "3 Fortnightly Sessions Over 6 Weeks",
      downtime: "3–5 Days Mild Micro-Flaking",
      result: "Visible Clearance of Melasma & Luminous Tone Uniformity"
    },
    case3: {
      id: "CASE REF: XQ-LD02",
      beforeImg: "assets/img/blog/laser-dermatology.jpg",
      afterImg: "assets/img/before-after/profile-balancing-2.jpg",
      title: "Laser Dermatology Resurfacing & Texture Renewal",
      summary: "Patient presented with enlarged follicular pore diameter and rough surface texture across the cheek planes. Queen utilized safe laser fractional wavelengths paired with deep cellular hydrators to stimulate rapid elastin synthesis and refine epidermal texture.",
      procedure: "Precision Laser Dermatology + Barrier Infusion",
      timeline: "2 Sessions Spaced 4 Weeks Apart",
      downtime: "24 Hours Mild Transient Redness",
      result: "Pore Diameter Contraction & Silky Smooth Epidermis"
    }
  };

  caseTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      caseTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const caseKey = tab.getAttribute('data-case');
      const item = caseData[caseKey];

      if (item && imgBefore && imgAfter) {
        imgBefore.style.opacity = '0.4';
        imgAfter.style.opacity = '0.4';

        setTimeout(() => {
          imgBefore.src = item.beforeImg;
          imgAfter.src = item.afterImg;
          if (caseIdTag) caseIdTag.textContent = item.id;
          if (caseTitle) caseTitle.textContent = item.title;
          if (caseSummary) caseSummary.textContent = item.summary;
          if (caseProc) caseProc.textContent = item.procedure;
          if (caseTimeline) caseTimeline.textContent = item.timeline;
          if (caseDowntime) caseDowntime.textContent = item.downtime;
          if (caseRes) caseRes.textContent = item.result;

          imgBefore.style.opacity = '1';
          imgAfter.style.opacity = '1';
        }, 120);

        // Reset slider to 50%
        slider.value = 50;
        updateSlider(50);
      }
    });
  });
}

/* ==========================================================================
   7. PATIENT JOURNEY INTERACTIVE PROGRESS TRACKER
   ========================================================================== */
function initPatientJourneyTracker() {
  const journeySection = document.querySelector('.journey-section');
  const progressBar = document.querySelector('.journey-flow-progress-bar');
  const stepCards = document.querySelectorAll('.journey-step-card');

  if (!journeySection || !progressBar || !stepCards.length) return;

  function updateJourneyProgress() {
    const rect = journeySection.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;

    // Check if section is currently active in viewport
    if (rect.top <= windowHeight && rect.bottom >= 0) {
      const totalScrollable = rect.height + windowHeight;
      const currentProgress = windowHeight - rect.top;
      const scrollPct = Math.max(0, Math.min(1, currentProgress / totalScrollable));

      // Calculate 4 active milestones
      const stepIndex = Math.min(3, Math.floor(scrollPct * 4));
      const targetWidth = Math.max(25, (stepIndex + 1) * 25);

      progressBar.style.width = `${targetWidth}%`;

      stepCards.forEach((card, idx) => {
        if (idx <= stepIndex) {
          card.classList.add('is-active-step');
        } else {
          card.classList.remove('is-active-step');
        }
      });
    }
  }

  window.addEventListener('scroll', updateJourneyProgress, { passive: true });
  updateJourneyProgress();
}

/* ==========================================================================
   6. INTERACTIVE MULTI-STEP BOOKING MODAL WITH WHATSAPP CONCIERGE
   ========================================================================== */
/* ==========================================================================
   6. INTERACTIVE MULTI-STEP BOOKING MODAL WITH WHATSAPP CONCIERGE (5-STEP)
   ========================================================================== */
function initBookingModal() {
  const overlay = document.querySelector('.booking-modal-overlay');
  const closeBtn = document.querySelector('.modal-close-trigger');
  const openTriggers = document.querySelectorAll('.open-booking-modal');
  const nextBtn = document.getElementById('modal-btn-next');
  const backBtn = document.getElementById('modal-btn-back');
  const steps = document.querySelectorAll('.modal-step-body');
  const indicatorBars = document.querySelectorAll('.step-indicator-bar');

  if (!overlay || !steps.length) return;

  let currentStep = 1;
  const totalSteps = steps.length;

  const bookingData = {
    concernKey: "acne",
    service: "Acne & Blemish Revision",
    date: "",
    time: "10:00 AM - 12:00 PM",
    name: "",
    phone: "",
    email: "",
    concern: ""
  };

  const guidancePresets = {
    acne: {
      title: "Acne & Blemish Consultation Path",
      desc: "Queen Uboegbulam and our clinical team recommend an in-person skin analysis to evaluate your skin condition before prescribing your customized acne peel and clarifying protocol."
    },
    pigmentation: {
      title: "Hyperpigmentation & Melasma Consultation Path",
      desc: "Our clinical team will evaluate your skin tone and pigment depth during consultation to recommend a safe, melanin-conscious peel treatment plan."
    },
    aging: {
      title: "Anti-Aging & Skin Firming Consultation Path",
      desc: "Evaluation focuses on skin elasticity and firmness. Queen Uboegbulam formulates targeted PDO thread or facial balancing options tailored to your aesthetic goals."
    },
    rejuvenation: {
      title: "Skin Rejuvenation & Radiance Consultation Path",
      desc: "Assessment measures skin hydration and cellular turnover to recommend optimal micro-channeling or skin revitalization therapy."
    },
    balancing: {
      title: "Facial Balancing Consultation Path",
      desc: "Queen Uboegbulam evaluates chin projection, jawline definition, and overall facial proportions to design your customized contouring treatment plan."
    },
    laser: {
      title: "Laser Treatments Consultation Path",
      desc: "Consultation checks evaluate skin type tolerance and skin parameters to ensure precision laser settings and safe results."
    },
    body: {
      title: "Body Treatments Consultation Path",
      desc: "Clinical evaluation assesses targeted body areas before recommending specialized lipolysis or skin care protocols."
    },
    general: {
      title: "Comprehensive Skin Analysis Consultation",
      desc: "Includes a complete 8-marker skin analysis conducted by Clinical Director Queen Uboegbulam to guide your personalized treatment plan."
    }
  };

  openTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const preselected = trigger.getAttribute('data-preset-service');
      if (preselected) {
        bookingData.service = preselected;
        highlightSelectedService(preselected);
      }
      openModal();
    });
  });

  function openModal() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    goToStep(1);
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeModal();
    }
  });

  const serviceButtons = document.querySelectorAll('.service-opt-btn');
  serviceButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      const key = btn.getAttribute('data-concern-key') || 'general';
      bookingData.concernKey = key;
      bookingData.service = btn.getAttribute('data-service') || btn.querySelector('strong').textContent;
      updateStep2Guidance(key);
    });
  });

  function updateStep2Guidance(key) {
    const preset = guidancePresets[key] || guidancePresets.general;
    const titleEl = document.getElementById('guidance-title');
    const descEl = document.getElementById('guidance-desc');
    const displayInput = document.getElementById('selected-service-display');

    if (titleEl) titleEl.textContent = preset.title;
    if (descEl) descEl.textContent = preset.desc;
    if (displayInput) displayInput.value = bookingData.service;
  }

  function highlightSelectedService(serviceName) {
    serviceButtons.forEach(btn => {
      const name = btn.getAttribute('data-service') || btn.querySelector('strong').textContent;
      if (name.toLowerCase().includes(serviceName.toLowerCase()) || serviceName.toLowerCase().includes(name.toLowerCase())) {
        btn.classList.add('selected');
        const key = btn.getAttribute('data-concern-key') || 'general';
        bookingData.concernKey = key;
        bookingData.service = name;
        updateStep2Guidance(key);
      } else {
        btn.classList.remove('selected');
      }
    });
  }

  function goToStep(stepNum) {
    currentStep = stepNum;
    steps.forEach((s, idx) => {
      if (idx + 1 === currentStep) {
        s.classList.add('active');
      } else {
        s.classList.remove('active');
      }
    });

    indicatorBars.forEach((bar, idx) => {
      if (idx < currentStep) {
        bar.classList.add('active');
      } else {
        bar.classList.remove('active');
      }
    });

    if (currentStep === 1) {
      backBtn.style.display = 'none';
      nextBtn.textContent = 'Continue to Consultation Path →';
    } else if (currentStep === 2) {
      backBtn.style.display = 'inline-flex';
      nextBtn.textContent = 'Continue to Schedule →';
      updateStep2Guidance(bookingData.concernKey);
    } else if (currentStep === 3) {
      backBtn.style.display = 'inline-flex';
      nextBtn.textContent = 'Continue to Details →';
    } else if (currentStep === 4) {
      backBtn.style.display = 'inline-flex';
      nextBtn.textContent = 'Review & Confirm →';
    } else if (currentStep === 5) {
      backBtn.style.display = 'inline-flex';
      nextBtn.textContent = 'Confirm via WhatsApp Concierge ✓';
      populateSummary();
    }
  }

  function populateSummary() {
    const serviceEl = document.getElementById('sum-service');
    const dateEl = document.getElementById('sum-date');
    const timeEl = document.getElementById('sum-time');
    const patientEl = document.getElementById('sum-patient');
    const phoneEl = document.getElementById('sum-phone');

    if (serviceEl) serviceEl.textContent = bookingData.service;
    if (dateEl) dateEl.textContent = bookingData.date || "Next Available Clinic Slot";
    if (timeEl) timeEl.textContent = bookingData.time;
    if (patientEl) patientEl.textContent = bookingData.name || "Valued Client";
    if (phoneEl) phoneEl.textContent = bookingData.phone || "Not specified";
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentStep === 3) {
        const dateInput = document.getElementById('booking-date');
        const timeInput = document.getElementById('booking-time');
        if (dateInput && dateInput.value) bookingData.date = dateInput.value;
        if (timeInput && timeInput.value) bookingData.time = timeInput.value;
      } else if (currentStep === 4) {
        const nameInput = document.getElementById('booking-name');
        const phoneInput = document.getElementById('booking-phone');
        const emailInput = document.getElementById('booking-email');
        const concernInput = document.getElementById('booking-concern');
        const phoneValMsg = document.getElementById('phone-val-msg');

        if (nameInput && nameInput.value.trim()) bookingData.name = nameInput.value.trim();
        if (phoneInput && phoneInput.value.trim()) bookingData.phone = phoneInput.value.trim();
        if (emailInput && emailInput.value.trim()) bookingData.email = emailInput.value.trim();
        if (concernInput && concernInput.value.trim()) bookingData.concern = concernInput.value.trim();

        if (!bookingData.name) {
          alert('Please enter your full name.');
          if (nameInput) nameInput.focus();
          return;
        }

        // Phone validation (minimum 10 characters matching phone pattern)
        const phoneRegex = /^[0-9+\s\-()]{10,}$/;
        if (!bookingData.phone || !phoneRegex.test(bookingData.phone)) {
          if (phoneValMsg) phoneValMsg.textContent = 'Please enter a valid phone or WhatsApp number (at least 10 digits).';
          if (phoneInput) phoneInput.focus();
          return;
        } else {
          if (phoneValMsg) phoneValMsg.textContent = '';
        }
      } else if (currentStep === 5) {
        sendToWhatsApp(bookingData);
        closeModal();
        return;
      }

      if (currentStep < totalSteps) {
        goToStep(currentStep + 1);
      }
    });
  }

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      if (currentStep > 1) {
        goToStep(currentStep - 1);
      }
    });
  }

  function sendToWhatsApp(data) {
    const phone = "2348138094822";
    const text = `Hello Queen & Xotic Queens Medspa team, I would like to reserve my consultation:

✦ Service Focus: ${data.service}
✦ Preferred Date: ${data.date || 'Next Available Slot'}
✦ Preferred Window: ${data.time}
✦ Client Name: ${data.name}
✦ Phone / WhatsApp: ${data.phone}
${data.email ? `✦ Email: ${data.email}\n` : ''}✦ Skin Goals / Notes: ${data.concern || 'General consultation & analysis'}

Please confirm slot availability and ₦25,000 credit deposit details. Thank you!`;

    const encoded = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phone}?text=${encoded}`;
    window.open(whatsappUrl, '_blank');
  }
}

/* ==========================================================================
   7. SMOOTH IN-PAGE SCROLL
   ========================================================================== */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = 78;
        const targetPos = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   8. RESTRAINED SCROLL REVEAL (INTERSECTION OBSERVER)
   ========================================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  } else {
    elements.forEach(el => el.classList.add('is-visible'));
  }
}

/* ==========================================================================
   9. SLIM FLOATING ACTION DOCK (Post-Hero Display & Smart Scroll Physics)
   ========================================================================== */
function initFloatingDock() {
  const dock = document.getElementById('mobileFloatingDock');
  const heroSection = document.getElementById('hero');
  if (!dock || !heroSection) return;

  let lastScrollY = window.scrollY;
  let isPastHero = false;
  let scrollTimeout = null;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          isPastHero = false;
          dock.classList.remove('is-visible');
        } else if (entry.boundingClientRect.top < 0) {
          isPastHero = true;
          dock.classList.add('is-visible');
        } else {
          isPastHero = false;
          dock.classList.remove('is-visible');
        }
      });
    }, { threshold: 0 });

    observer.observe(heroSection);
  } else {
    isPastHero = window.scrollY > 800;
  }

  window.addEventListener('scroll', () => {
    if (!isPastHero) {
      dock.classList.remove('is-visible');
      return;
    }

    const currentScrollY = window.scrollY;
    const scrollDiff = currentScrollY - lastScrollY;

    if (scrollDiff > 7) {
      // User is scrolling down: gently hide dock
      dock.classList.remove('is-visible');
    } else if (scrollDiff < -3) {
      // User is scrolling up: reveal dock immediately
      dock.classList.add('is-visible');
    }

    // When scrolling pauses, reveal dock
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (isPastHero) {
        dock.classList.add('is-visible');
      }
    }, 280);

    lastScrollY = currentScrollY;
  }, { passive: true });
}

/* ==========================================================================
   10. MOBILE TESTIMONIALS PAGINATION & SWIPE
   ========================================================================== */
function initTestimonialsMobile() {
  const dots = document.querySelectorAll('.t-dot');
  const slides = document.querySelectorAll('[data-t-slide]');
  if (!dots.length || !slides.length) return;

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-t-index'), 10);
      dots.forEach(d => {
        d.classList.remove('active');
        d.setAttribute('aria-selected', 'false');
      });
      dot.classList.add('active');
      dot.setAttribute('aria-selected', 'true');

      const targetSlide = document.querySelector(`[data-t-slide="${idx}"]`);
      if (targetSlide) {
        targetSlide.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  });
}

