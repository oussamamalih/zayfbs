'use strict';

/* ================================================================
   CONTACT PAGE — contact.js
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const submitBtn = document.getElementById('cf-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', handleContactSubmit);
  }
});

function handleContactSubmit() {
  const nameEl    = document.getElementById('cf-name');
  const emailEl   = document.getElementById('cf-email');
  const messageEl = document.getElementById('cf-message');
  const errorEl   = document.getElementById('cf-error');
  const submitBtn = document.getElementById('cf-submit');

  const name    = nameEl.value.trim();
  const email   = emailEl.value.trim();
  const message = messageEl.value.trim();

  // Validation
  if (!name || !email || !message) {
    errorEl.textContent = '⚠ Veuillez remplir tous les champs obligatoires.';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errorEl.textContent = '⚠ Adresse email invalide.';
    return;
  }

  errorEl.textContent = '';

  // Simulate sending
  submitBtn.textContent = 'Envoi en cours…';
  submitBtn.classList.add('sending');
  submitBtn.disabled = true;

  setTimeout(() => {
    submitBtn.textContent = '✓ Message envoyé';
    submitBtn.disabled = false;
    submitBtn.classList.remove('sending');

    // Reset form
    nameEl.value    = '';
    emailEl.value   = '';
    document.getElementById('cf-subject').value = '';
    messageEl.value = '';

    alert(`✉ Merci ${name} ! Votre message a bien été envoyé. Nous vous répondrons sous 24h.`);

    setTimeout(() => {
      submitBtn.textContent = 'Envoyez-nous un message';
    }, 2000);
  }, 1200);
}