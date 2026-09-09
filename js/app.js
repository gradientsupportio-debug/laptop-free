/**
 * Free Student Laptop Initiative - Application Logic
 * Manages 3-screen progression, form validation, viral share tracker, and legal modals.
 */

document.addEventListener("DOMContentLoaded", () => {
  // App State
  const state = {
    currentScreen: 1,
    studentName: "",
    educationLevel: "",
    institution: "",
    shareCount: parseInt(localStorage.getItem("student_laptop_shares") || "0", 10),
    targetShares: 10,
    voucherId: "STU-2026-" + Math.floor(100000 + Math.random() * 900000)
  };

  // DOM Elements
  const screen1 = document.getElementById("screen-1");
  const screen2 = document.getElementById("screen-2");
  const screen3 = document.getElementById("screen-3");
  
  const toScreen2Btn = document.getElementById("btn-goto-screen-2");
  const studentForm = document.getElementById("student-verification-form");
  const studentNameInput = document.getElementById("student-name");
  const educationLevelSelect = document.getElementById("education-level");
  const institutionInput = document.getElementById("student-institution");
  
  const formFieldsContainer = document.getElementById("form-fields-container");
  const verifyLoadingBox = document.getElementById("verify-loading-box");
  const loaderStatus = document.getElementById("loader-status");
  
  // Screen 3 Elements
  const confirmedStudentName = document.getElementById("confirmed-student-name");
  const confirmedStudentLevel = document.getElementById("confirmed-student-level");
  const shareCounterText = document.getElementById("share-counter-text");
  const progressBarFill = document.getElementById("progress-bar-fill");
  const progressPercentText = document.getElementById("progress-percent-text");
  const btnShareWhatsapp = document.getElementById("btn-share-whatsapp");
  const btnCopyLink = document.getElementById("btn-copy-link");
  const btnShareTelegram = document.getElementById("btn-share-telegram");
  const btnClaimDispatch = document.getElementById("btn-claim-dispatch");
  
  // Modals & Toast
  const policyModal = document.getElementById("policy-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalBody = document.getElementById("modal-body");
  const modalClose = document.getElementById("modal-close");
  const toast = document.getElementById("toast");
  const stickyAd = document.getElementById("sticky-mobile-ad");
  const closeStickyBtn = document.getElementById("close-sticky-ad");
  const tickerText = document.getElementById("ticker-text");

  // Recent Claims Ticker Data
  const recentClaims = [
    "Sarah M. (Undergrad) just reserved an M2 Laptop 2m ago",
    "David K. (High School Senior) claimed an Intel Core i7 Unit 4m ago",
    "Elena R. (Master's Scholar) secured a 16GB RAM Grant 1m ago",
    "Ahmed T. (Ph.D. Candidate) completed verification 3m ago",
    "Priya S. (Engineering Student) dispatched allocation pass 5m ago"
  ];
  let tickerIdx = 0;
  setInterval(() => {
    if (tickerText) {
      tickerIdx = (tickerIdx + 1) % recentClaims.length;
      tickerText.style.opacity = "0";
      setTimeout(() => {
        tickerText.textContent = recentClaims[tickerIdx];
        tickerText.style.opacity = "1";
      }, 200);
    }
  }, 5000);

  // Screen Navigation
  function showScreen(screenNum) {
    state.currentScreen = screenNum;
    [screen1, screen2, screen3].forEach((el, index) => {
      if (el) {
        if (index + 1 === screenNum) {
          el.classList.add("active");
        } else {
          el.classList.remove("active");
        }
      }
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  // Screen 1 -> Screen 2
  if (toScreen2Btn) {
    toScreen2Btn.addEventListener("click", () => {
      showScreen(2);
    });
  }

  // Screen 2: Form Submission & Verification Simulation
  if (studentForm) {
    studentForm.addEventListener("submit", (e) => {
      e.preventDefault();
      
      const name = studentNameInput.value.trim();
      const level = educationLevelSelect.value;
      const institution = institutionInput.value.trim();

      if (!name) {
        showToast("Please enter your full legal student name.");
        studentNameInput.focus();
        return;
      }

      if (!level) {
        showToast("Please select your current education level.");
        educationLevelSelect.focus();
        return;
      }

      state.studentName = name;
      state.educationLevel = level;
      state.institution = institution || "Accredited Institution";

      // Show simulated high-tech verification sequence
      formFieldsContainer.style.display = "none";
      verifyLoadingBox.style.display = "flex";

      const steps = [
        "Verifying student grant allocation database...",
        "Validating eligibility for " + level + "...",
        "Reserving hardware serial for " + name + "...",
        "Generating Grant Voucher: " + state.voucherId + "..."
      ];

      let step = 0;
      const interval = setInterval(() => {
        step++;
        if (step < steps.length) {
          loaderStatus.textContent = steps[step];
        } else {
          clearInterval(interval);
          // Transition to Screen 3
          populateScreen3();
          showScreen(3);
        }
      }, 700);
    });
  }

  // Populate Screen 3 with Student Data & Progress
  function populateScreen3() {
    if (confirmedStudentName) confirmedStudentName.textContent = state.studentName;
    if (confirmedStudentLevel) confirmedStudentLevel.textContent = state.educationLevel;
    updateShareUI();
  }

  // Update Share Progress UI
  function updateShareUI() {
    const count = Math.min(state.shareCount, state.targetShares);
    const percentage = Math.round((count / state.targetShares) * 100);

    if (shareCounterText) {
      shareCounterText.textContent = `${count} / ${state.targetShares} Shared`;
    }
    if (progressBarFill) {
      progressBarFill.style.width = `${percentage}%`;
    }
    if (progressPercentText) {
      progressPercentText.textContent = `${percentage}% Completed`;
    }

    if (btnClaimDispatch) {
      if (count >= state.targetShares) {
        btnClaimDispatch.classList.add("unlocked");
        btnClaimDispatch.removeAttribute("disabled");
        btnClaimDispatch.innerHTML = "🎉 Unlock & Download Dispatch Voucher →";
      } else {
        btnClaimDispatch.classList.remove("unlocked");
        btnClaimDispatch.setAttribute("disabled", "true");
        btnClaimDispatch.innerHTML = `🔒 Locked (Need ${state.targetShares - count} More Shares)`;
      }
    }
  }

  // Handle Sharing Action (WhatsApp, Telegram, Copy Link)
  function handleShare(platform) {
    const siteUrl = window.location.origin + window.location.pathname;
    const shareMessage = `🎓 FREE LAPTOPS FOR STUDENTS (Academic Year 2026-2027)\n\nGovernment-backed hardware grant for High School to PhD students. 100% Free, zero hidden fees.\n\nI just reserved my student laptop! Check your eligibility and claim yours before today's quota runs out:\n👉 ${siteUrl}`;

    if (platform === "whatsapp") {
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
      window.open(whatsappUrl, "_blank");
    } else if (platform === "telegram") {
      const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(siteUrl)}&text=${encodeURIComponent(shareMessage)}`;
      window.open(telegramUrl, "_blank");
    }

    // Increment share count
    if (state.shareCount < state.targetShares) {
      state.shareCount++;
      localStorage.setItem("student_laptop_shares", state.shareCount);
      updateShareUI();
      showToast(`Share recorded! (${state.shareCount}/${state.targetShares})`);
    } else {
      showToast("Verification goal reached! You can now claim your laptop pass.");
    }
  }

  // Share Event Listeners
  if (btnShareWhatsapp) {
    btnShareWhatsapp.addEventListener("click", () => handleShare("whatsapp"));
  }
  if (btnShareTelegram) {
    btnShareTelegram.addEventListener("click", () => handleShare("telegram"));
  }

  if (btnCopyLink) {
    btnCopyLink.addEventListener("click", () => {
      const siteUrl = window.location.href;
      navigator.clipboard.writeText(siteUrl).then(() => {
        showToast("Link copied to clipboard! Share with classmates.");
        if (state.shareCount < state.targetShares) {
          state.shareCount++;
          localStorage.setItem("student_laptop_shares", state.shareCount);
          updateShareUI();
        }
      }).catch(() => {
        showToast("Link: " + siteUrl);
      });
    });
  }

  // Final Voucher Modal
  if (btnClaimDispatch) {
    btnClaimDispatch.addEventListener("click", () => {
      if (state.shareCount >= state.targetShares) {
        openModal("Student Laptop Dispatch Voucher", `
          <div style="text-align: center; padding: 10px 0;">
            <div style="background:#ecfdf5; border:1px solid #a7f3d0; border-radius:12px; padding:20px; margin-bottom:16px;">
              <h3 style="color:#065f46; font-size:18px; margin-bottom:6px;">Official Dispatch Voucher Ready</h3>
              <p style="color:#047857; font-size:13px;">Voucher Serial: <strong>${state.voucherId}</strong></p>
            </div>
            <p style="color:#334155; font-size:14px; margin-bottom:12px;"><strong>Student Name:</strong> ${state.studentName}</p>
            <p style="color:#334155; font-size:14px; margin-bottom:12px;"><strong>Academic Level:</strong> ${state.educationLevel}</p>
            <p style="color:#334155; font-size:14px; margin-bottom:16px;"><strong>Assigned Hardware:</strong> 15.6" Full HD Quad-Core Student Notebook (16GB RAM / 512GB NVMe SSD)</p>
            <p style="color:#64748b; font-size:12px; line-height:1.5;">Our student logistics partner will reach out within 24–48 hours to confirm your physical shipping address. No payment or credit card is required at any time.</p>
          </div>
        `);
      }
    });
  }

  // Toast Notification
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 3000);
  }

  // Sticky Mobile Ad Close
  if (closeStickyBtn && stickyAd) {
    closeStickyBtn.addEventListener("click", () => {
      stickyAd.style.display = "none";
      document.body.style.paddingBottom = "20px";
    });
  }

  // Policy Modals (Strictly required for Google AdSense compliance)
  const legalDocs = {
    privacy: {
      title: "Privacy Policy",
      body: `
        <p>Last updated: September 2026</p>
        <h4>1. Information We Collect</h4>
        <p>We respect your privacy. Any student details (such as name and academic level) submitted via the eligibility verification form are stored locally in your browser session for qualification purposes and are not sold or redistributed to third parties.</p>
        <h4>2. Google AdSense & Cookies</h4>
        <p>This website uses Google AdSense, a service for including advertisements from Google Inc. Google uses cookies (including the DoubleClick DART cookie) to serve ads based on user visits to this site and other sites on the Internet. Users may opt out of personalized advertising by visiting Google's Ads Settings.</p>
        <h4>3. Log Data</h4>
        <p>Like many site operators, we collect information that your browser sends whenever you visit our site (browser type, IP address, referral sources, and page interactions).</p>
      `
    },
    terms: {
      title: "Terms of Service & Distribution",
      body: `
        <h4>1. Free for Students Policy</h4>
        <p>The Student Hardware Grant initiative is designed exclusively for verified enrolled students ranging from High School seniors to Doctoral/Ph.D. candidates. Laptops and educational devices provided under this program are 100% free of charge with zero retail costs.</p>
        <h4>2. Eligibility & Verification</h4>
        <p>Applicants must be actively enrolled in a recognized secondary, tertiary, or vocational academic program. One grant allocation is permitted per eligible student identification per academic calendar year.</p>
        <h4>3. Fair Use & Anti-Scalping</h4>
        <p>Recipients agree that devices received are intended solely for personal educational use, research, and coursework. Resale or commercial redistribution of granted hardware is strictly prohibited.</p>
      `
    },
    disclaimer: {
      title: "Program Disclaimer & Institutional Notice",
      body: `
        <h4>General Information Disclaimer</h4>
        <p>This portal operates as an independent educational hardware access initiative supported through corporate sponsorship, educational endowments, and authorized advertising revenue. This website is not directly affiliated with or endorsed by any specific computer hardware manufacturer or specific government department unless explicitly stated.</p>
        <h4>Advertisement Disclosure</h4>
        <p>To keep the grant program completely free for students, third-party advertisements provided by Google AdSense and approved advertising partners are displayed across this platform.</p>
      `
    },
    contact: {
      title: "Contact & Grant Support",
      body: `
        <p>For inquiries regarding hardware allocations, institutional bulk grants, or privacy inquiries, please contact our student assistance desk:</p>
        <p style="margin-top:10px;"><strong>Email:</strong> support@student-laptop-grant.org</p>
        <p><strong>Support Hours:</strong> Monday – Friday, 9:00 AM – 6:00 PM EST</p>
        <p><strong>Response Time:</strong> Within 24–48 business hours</p>
      `
    }
  };

  function openModal(title, htmlContent) {
    if (modalTitle) modalTitle.textContent = title;
    if (modalBody) modalBody.innerHTML = htmlContent;
    if (policyModal) policyModal.classList.add("open");
  }

  function closeModal() {
    if (policyModal) policyModal.classList.remove("open");
  }

  document.querySelectorAll("[data-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-modal");
      if (legalDocs[type]) {
        openModal(legalDocs[type].title, legalDocs[type].body);
      }
    });
  });

  if (modalClose) modalClose.addEventListener("click", closeModal);
  if (policyModal) {
    policyModal.addEventListener("click", (e) => {
      if (e.target === policyModal) closeModal();
    });
  }
});
