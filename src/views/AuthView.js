"use strict";

export class AuthView {
  constructor() {
    this._authArea = document.querySelector("#auth-area");
    this._modal = document.querySelector("#auth-modal");
    this._isSignUpMode = false;
  }

  renderAuthArea(user) {
    if (user) {
      this._authArea.innerHTML = `
        <span class="auth-email">${user.email}</span>
        <button id="sign-out-btn" class="auth-btn">Sign out</button>
        `;
    } else {
      this._authArea.innerHTML = `
        <button id="sign-in-btn" class="auth-btn auth-btn--primary">Sign in</button>
        `;
    }
  }

  openModal() {
    this._modal.classList.remove("hidden");
    document.querySelector("#auth-error").textContent = "";
    document.querySelector("#auth-error").classList.remove("auth-message--info");
  }

  closeModal() {
    this._modal.classList.add("hidden");
    document.querySelector("#auth-email").textContent = "";
    document.querySelector("#auth-password").textContent = "";
  }

  showMessage(message) {
    const errEl = document.querySelector("#auth-error");
    errEl.textContent = message;
    errEl.classList.add("auth-message--info");
  }

  showError(message) {
    const errEl = document.querySelector("#auth-error");
    errEl.textContent = message;
    errEl.classList.add("auth-message--info");
  }

  get isSignUpMode() {
    return this._isSignUpMode;
  }

  toggleMode() {
    this._isSignUpMode = !this._isSignUpMode;

    const title = this._isSignUpMode ? "Sign up" : "Sign in";
    document.querySelector("#auth-modal-title").textContent = title;
    document.querySelector("#auth-submit").textContent = title;
    document.querySelector("#auth-toggle-text").textContent = this._isSignUpMode
      ? "Already have an account?"
      : "Don't have an account?";
    document.querySelector("#auth-toggle-btn").textContent = this._isSignUpMode ? "Sign in" : "Sign up";
  }

  addSignInHandler(handler) {
    this._authArea.addEventListener("click", (e) => {
      if (e.target.closest("#sign-in-btn")) handler();
    });
  }

  addSignOutHandler(handler) {
    this._authArea.addEventListener("click", (e) => {
      if (e.target.closest("#sign-out-btn")) handler();
    });
  }

  addCancelHandler(handler) {
    this._authArea.addEventListener("click", (e) => {
      if (e.target.closest("#sign-out-btn")) handler();
    });
  }

  addModalHandlers({ onSubmit, onToggle }) {
    // Cancel button + backdrop click close the modal
    document.querySelector("#auth-cancel").addEventListener("click", () => {
      this.closeModal();
    });

    this._modal.addEventListener("click", (e) => {
      if (e.target === this._modal) this.closeModal();
    });

    // Toggle between sign-in and sign-up mode
    document.querySelector("#auth-toggle-btn").addEventListener("click", () => {
      this.toggleMode();
    });

    // Submit
    document.querySelector("#auth-submit").addEventListener("click", () => {
      const email = document.querySelector("#auth-email").value;
      const password = document.querySelector("#auth-password").value;
      onSubmit(email, password, this._isSignUpMode);
    });
  }
}
