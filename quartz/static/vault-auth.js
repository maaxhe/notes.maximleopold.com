(function() {
  'use strict';

  // ============================================
  // CONFIGURATION - CHANGE THESE BEFORE DEPLOY
  // ============================================
  // Pre-computed SHA-256 hash of the vault password (never store plaintext)
  const VAULT_HASH = "77543512afcd747280b1f4fb1d4b9d4b88d5008c61f8c9a1ddb477f428e80b44";
  const TOKEN_VALIDITY_DAYS = 30;
  const STORAGE_KEY = "vault_auth_token";
  const STORAGE_TIMESTAMP_KEY = "vault_auth_timestamp";

  // ============================================
  // MAGIC LINK CONFIGURATION (Guest Access)
  // ============================================
  const MAGIC_LINK_ID = "recruiter-access-2026-v2-mxlpd";
  const MAGIC_LINK_EXPIRY = new Date("2026-12-31T23:59:59").getTime();
  const MAGIC_LINK_PARAM = "access_token";

  // ============================================
  // IMPLEMENTATION
  // ============================================

  // Check if Magic Link token is valid
  function checkMagicLink() {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const accessToken = urlParams.get(MAGIC_LINK_PARAM);

      if (!accessToken) {
        return { valid: false, reason: 'no_token' };
      }

      // Check if token matches
      if (accessToken !== MAGIC_LINK_ID) {
        return { valid: false, reason: 'invalid_token' };
      }

      // Check if token has expired
      const now = Date.now();
      if (now > MAGIC_LINK_EXPIRY) {
        return { valid: false, reason: 'expired' };
      }

      return { valid: true };
    } catch (e) {
      return { valid: false, reason: 'error' };
    }
  }

  // Clean URL by removing the access_token parameter
  function cleanMagicLinkUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete(MAGIC_LINK_PARAM);
    window.history.replaceState({}, document.title, url.toString());
  }

  // Check authentication status
  function isTokenValid() {
    try {
      const storedToken = localStorage.getItem(STORAGE_KEY);
      const storedTimestamp = localStorage.getItem(STORAGE_TIMESTAMP_KEY);

      if (!storedToken || !storedTimestamp) {
        return false;
      }

      const timestamp = parseInt(storedTimestamp, 10);
      const now = Date.now();
      const daysSince = (now - timestamp) / (1000 * 60 * 60 * 24);

      return daysSince < TOKEN_VALIDITY_DAYS;
    } catch (e) {
      return false;
    }
  }

  // Add main styles for overlay
  const style = document.createElement('style');
  style.textContent = `
    body.vault-locked {
      overflow: hidden !important;
    }

    #vault-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: #0a0a0a;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    }

    #vault-card {
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 12px;
      padding: 40px;
      width: 90%;
      max-width: 400px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    }

    #vault-card h1 {
      margin: 0 0 10px 0;
      font-size: 24px;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
    }

    #vault-card p {
      margin: 0 0 30px 0;
      font-size: 14px;
      color: #999;
      text-align: center;
    }

    #vault-card input {
      width: 100%;
      padding: 12px 16px;
      font-size: 16px;
      border: 1px solid #333;
      border-radius: 6px;
      background: #0a0a0a;
      color: #ffffff;
      box-sizing: border-box;
      margin-bottom: 16px;
      transition: border-color 0.2s;
    }

    #vault-card input:focus {
      outline: none;
      border-color: #4a9eff;
    }

    #vault-card button {
      width: 100%;
      padding: 12px 16px;
      font-size: 16px;
      font-weight: 600;
      background: #4a9eff;
      color: #ffffff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.2s;
    }

    #vault-card button:hover {
      background: #3a8eef;
    }

    #vault-card button:active {
      background: #2a7edf;
    }

    #vault-error {
      margin-top: 16px;
      padding: 12px;
      background: rgba(220, 53, 69, 0.1);
      border: 1px solid rgba(220, 53, 69, 0.3);
      border-radius: 6px;
      color: #ff6b6b;
      font-size: 14px;
      text-align: center;
      display: none;
    }

    #vault-error.show {
      display: block;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
      20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
  `;
  document.head.appendChild(style);

  // SHA-256 hash function
  async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  // Unlock the vault (show content)
  function unlockVault() {
    document.body.classList.remove('vault-locked');
    const overlay = document.getElementById('vault-overlay');
    if (overlay) {
      overlay.remove();
    }
    // Remove the inline overlay style
    const overlayStyle = document.getElementById('vault-overlay-style');
    if (overlayStyle) {
      overlayStyle.remove();
    }
  }

  // Save authentication token
  async function saveAuthToken() {
    const token = await sha256(VAULT_HASH + Date.now());
    localStorage.setItem(STORAGE_KEY, token);
    localStorage.setItem(STORAGE_TIMESTAMP_KEY, Date.now().toString());
  }

  // Show error message
  function showError(message) {
    const errorDiv = document.getElementById('vault-error');
    errorDiv.textContent = message;
    errorDiv.classList.add('show');

    // Shake animation
    const card = document.getElementById('vault-card');
    card.style.animation = 'shake 0.5s';
    setTimeout(() => {
      card.style.animation = '';
    }, 500);
  }

  // Create and show the password overlay
  function showPasswordOverlay() {
    // Add locked class to prevent scrolling
    document.body.classList.add('vault-locked');

    // Title depends on the site: Funkkurs vs. the research vault
    var siteTitle = location.hostname.indexOf('funk') !== -1 ? 'Funkkurs SRC & UBI' : 'Research Vault';

    const overlay = document.createElement('div');
    overlay.id = 'vault-overlay';
    overlay.innerHTML = `
      <div id="vault-card">
        <h1>🔒 ${siteTitle} – Zugang</h1>
        <p>Bitte Passwort eingeben</p>
        <form id="vault-form">
          <input
            type="password"
            id="vault-password-input"
            placeholder="Passwort"
            autocomplete="off"
            required
          />
          <button type="submit">Zugang gewähren</button>
        </form>
        <div id="vault-error"></div>
      </div>
    `;

    document.body.appendChild(overlay);

    // Focus the input
    const input = document.getElementById('vault-password-input');
    input.focus();

    // Handle form submission
    document.getElementById('vault-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      const enteredPassword = input.value;

      // Hash the entered password and compare with stored hash
      const enteredHash = await sha256(enteredPassword);

      if (enteredHash === VAULT_HASH) {
        await saveAuthToken();
        unlockVault();
      } else {
        showError('Falsches Passwort. Bitte versuchen Sie es erneut.');
        input.value = '';
        input.focus();
      }
    });
  }

  // Main initialization
  async function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      await new Promise(resolve => {
        document.addEventListener('DOMContentLoaded', resolve);
      });
    }

    // 1. Check for Magic Link access first
    const magicLinkResult = checkMagicLink();
    if (magicLinkResult.valid) {
      // Valid magic link - auto-login and clean URL
      await saveAuthToken();
      cleanMagicLinkUrl();
      return; // User is now authenticated, no overlay needed
    }

    // 2. Check if user is already authenticated via stored token
    if (!isTokenValid()) {
      // Not authenticated, show password overlay
      showPasswordOverlay();
    }
    // If authenticated, the inline script already didn't add the overlay, so nothing to do
  }

  // Start the authentication check
  init();
})();
