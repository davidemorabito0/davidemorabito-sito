/* Cookie consent — Google Consent Mode v2
   Blocca la profilazione GA4 finché l'utente non acconsente.
   Nessun servizio esterno: scelta salvata in localStorage. */
(function () {
  "use strict";

  var STORAGE_KEY = "dm_cookie_consent"; // "granted" | "denied"
  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) {}

  // Applica la scelta salvata a GA (se gtag è già presente)
  function applyConsent(state) {
    if (typeof gtag === "function") {
      gtag("consent", "update", {
        ad_storage: state,
        analytics_storage: state,
        ad_user_data: state,
        ad_personalization: state
      });
    }
  }

  // Se l'utente ha già scelto in passato, applica e non mostrare il banner
  if (saved === "granted") { applyConsent("granted"); return; }
  if (saved === "denied")  { applyConsent("denied");  return; }

  // Altrimenti costruisci il banner
  function buildBanner() {
    var wrap = document.createElement("div");
    wrap.id = "cookie-banner";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-label", "Informativa cookie");
    wrap.innerHTML =
      '<div class="cb-inner">' +
        '<div class="cb-text">' +
          'Questo sito usa cookie tecnici e, previo consenso, cookie di ' +
          'statistica (Google Analytics) per capire come viene usato il sito. ' +
          'Puoi accettare o rifiutare. ' +
          '<a href="/privacy.html">Privacy &amp; Cookie</a>.' +
        '</div>' +
        '<div class="cb-actions">' +
          '<button type="button" class="cb-btn cb-reject" id="cbReject">Rifiuta</button>' +
          '<button type="button" class="cb-btn cb-accept" id="cbAccept">Accetta</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);

    function choose(state) {
      try { localStorage.setItem(STORAGE_KEY, state); } catch (e) {}
      applyConsent(state);
      wrap.classList.add("cb-hide");
      setTimeout(function () { wrap.remove(); }, 350);
    }

    document.getElementById("cbAccept").addEventListener("click", function () { choose("granted"); });
    document.getElementById("cbReject").addEventListener("click", function () { choose("denied"); });
    requestAnimationFrame(function () { wrap.classList.add("cb-show"); });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", buildBanner);
  } else {
    buildBanner();
  }
})();
