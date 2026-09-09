/**
 * Google AdSense Centralized Configuration
 * 
 * Instructions:
 * 1. Replace 'ca-pub-0000000000000000' with your actual AdSense Publisher ID.
 * 2. Replace the slot IDs with your Google AdSense Ad Unit IDs.
 * 3. Set 'isDemoMode' to false once your AdSense account is approved.
 */
const AD_CONFIG = {
  // Set to false when ready for live Google Ads
  isDemoMode: true,

  // Your Google AdSense Publisher Client ID
  clientId: "ca-pub-0000000000000000",

  // Ad slot IDs for different placements
  slots: {
    topLeaderboard: "1234567890", // Desktop 728x90 / Mobile 320x50 & 300x100
    screen1Bottom: "2345678901",  // Screen 1 Responsive In-Feed / Rectangle
    screen2Mid: "3456789012",     // Screen 2 In-Form Native Card Ad
    screen3PostSubmit: "4567890123", // Screen 3 High CTR Box (300x250 / 336x280)
    stickyMobileFooter: "5678901234" // Mobile sticky anchor bottom bar
  }
};

// Initialize Google Ads
(function initGoogleAds() {
  window.addEventListener("DOMContentLoaded", () => {
    if (!AD_CONFIG.isDemoMode && AD_CONFIG.clientId && !AD_CONFIG.clientId.includes("0000000000000000")) {
      // 1. Hide all demo preview ad boxes
      document.querySelectorAll(".demo-ad-box").forEach(el => {
        el.style.display = "none";
      });

      // 2. Inject official Google AdSense script tag
      const script = document.createElement("script");
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CONFIG.clientId}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);

      // 3. Update data-ad-client on all ad units
      document.querySelectorAll(".adsbygoogle").forEach(ad => {
        ad.setAttribute("data-ad-client", AD_CONFIG.clientId);
        try {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
          console.warn("AdSense push error:", e);
        }
      });
    }
  });
})();
