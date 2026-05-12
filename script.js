// Soumission du formulaire en AJAX vers Web3Forms : evite le redirect
// vers la page de succes du provider, on garde l'utilisateur sur la
// landing et on lui montre une vraie carte de succes.
(() => {
  const form = document.getElementById('waitlist-form');
  const status = document.getElementById('form-status');
  const submit = form.querySelector('button[type="submit"]');
  const successCard = document.getElementById('waitlist-success');
  const shareBtn = document.getElementById('share-btn');
  const SHARE_LABEL_DEFAULT = '📲 Partager findjob237';

  // ============== Soumission du formulaire ==============
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.className = 'form-status';
    status.textContent = 'Envoi en cours…';
    submit.disabled = true;

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        // Reset des champs (si jamais l'utilisateur revient en arriere
        // ou que le navigateur restaure le formulaire, il sera propre).
        form.reset();
        // Bascule vers la carte de succes.
        form.hidden = true;
        successCard.hidden = false;
        successCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Erreur réseau');
      }
    } catch (err) {
      status.className = 'form-status error';
      status.textContent = "Problème d'envoi. Réessaie dans un instant.";
      // eslint-disable-next-line no-console
      console.error(err);
      submit.disabled = false;
    }
  });

  // ============== Bouton Partager ==============
  // Strategie : Web Share API (mobile natif) -> clipboard -> prompt en
  // dernier recours. Toujours du feedback visible — jamais silencieux.
  const showShareFeedback = (label, durationMs = 2000) => {
    shareBtn.textContent = label;
    setTimeout(() => { shareBtn.textContent = SHARE_LABEL_DEFAULT; }, durationMs);
  };

  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: 'findjob237',
      text: 'Toutes les offres d\'emploi du Cameroun, filtrées des arnaques. Inscris-toi avant le lancement.',
      url: window.location.href,
    };

    // 1. Tente l'API Web Share native (Android, iOS, Chrome desktop).
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // L'utilisateur a annule le partage : on ne fait rien, pas un bug.
        if (err && err.name === 'AbortError') return;
        // Sinon on continue vers le fallback clipboard.
        // eslint-disable-next-line no-console
        console.debug('Web Share API a echoue, fallback clipboard', err);
      }
    }

    // 2. Fallback clipboard (desktop, navigateurs sans Web Share).
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        showShareFeedback('✓ Lien copié !');
        return;
      } catch (err) {
        // eslint-disable-next-line no-console
        console.debug('Clipboard API a echoue, fallback prompt', err);
      }
    }

    // 3. Dernier recours : prompt() pour que l'utilisateur copie a la main
    //    (ouvre `file://` ou navigateur tres ancien).
    // eslint-disable-next-line no-alert
    window.prompt('Copie ce lien :', window.location.href);
  });

  // ============== Adapt CTA wording selon device ==============
  // Sur mobile, on parle d'install (la PWA s'installe nativement via le
  // prompt Chrome quand on arrive sur l'app avec ?install=1).
  // Sur desktop, "Installer" est moins evident (Chrome desktop le supporte
  // mais c'est moins habituel), on dit "Ouvrir".
  // Detection naive mais suffisante : matchMedia max-width + UA mobile.
  const isMobile =
    window.matchMedia('(max-width: 768px)').matches ||
    /iPhone|iPad|iPod|Android/.test(navigator.userAgent);

  const launchLabel = isMobile ? '📲 Installer findjob237' : '🚀 Ouvrir findjob237';
  const launchHref = isMobile
    ? 'https://app.findjob237.online/?install=1'
    : 'https://app.findjob237.online/';

  ['hero-cta-launch', 'final-cta-launch'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.textContent = launchLabel;
      el.href = launchHref;
    }
  });
})();
