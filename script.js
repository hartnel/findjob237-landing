// Soumission du formulaire en AJAX vers Web3Forms : evite le redirect
// vers la page de succes du provider, on garde l'utilisateur sur la
// landing et on lui montre une vraie carte de succes.
(() => {
  const form = document.getElementById('waitlist-form');
  const status = document.getElementById('form-status');
  const submit = form.querySelector('button[type="submit"]');
  const successCard = document.getElementById('waitlist-success');
  const shareBtn = document.getElementById('share-btn');

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
        // On bascule vers la carte de succes : plus visible qu'un simple
        // message texte, et incite au partage.
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

  // Bouton "Partager" : utilise l'API Web Share native quand dispo
  // (mobile), retombe sur copie du lien sinon.
  shareBtn.addEventListener('click', async () => {
    const shareData = {
      title: 'findjob237',
      text: 'Toutes les offres d\'emploi du Cameroun, filtrées des arnaques. Inscris-toi avant le lancement.',
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        shareBtn.textContent = '✓ Lien copié !';
        setTimeout(() => {
          shareBtn.textContent = '📲 Partager findjob237';
        }, 2000);
      }
    } catch (err) {
      // L'utilisateur a annule le partage : pas une erreur.
      // eslint-disable-next-line no-console
      console.debug('share cancelled', err);
    }
  });
})();
