// Soumission du formulaire en AJAX vers Web3Forms : evite le redirect
// vers leur page de succes, on garde l'utilisateur sur ta landing.
(() => {
  const form = document.getElementById('waitlist-form');
  const status = document.getElementById('form-status');
  const submit = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    status.className = 'form-status';
    status.textContent = 'Envoi...';
    submit.disabled = true;

    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok) {
        form.reset();
        status.className = 'form-status ok';
        status.textContent = 'Inscrit·e ! On te previent au lancement. Merci 🙏';
      } else {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || 'Erreur reseau');
      }
    } catch (err) {
      status.className = 'form-status error';
      status.textContent = "Probleme d'envoi. Reessaye dans un instant ou ecris a contact@findjob237.";
      // eslint-disable-next-line no-console
      console.error(err);
    } finally {
      submit.disabled = false;
    }
  });
})();
