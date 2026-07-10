"use strict";

export class ModalView {
  constructor() {
    this._overlay = document.querySelector("#modal-overlay");
    this._message = document.querySelector("#modal-message");
    this._confirmBtn = document.querySelector("#modal-confirm");
    this._cancelBtn = document.querySelector("#modal-cancel");
  }

  confirm(message) {
    this._message.textContent = message;
    this._overlay.classList.remove("hidden");

    return new Promise((resolve) => {
      const cleanup = () => {
        this._overlay.classList.add("hidden");
        this._confirmBtn.removeEventListener("click", onConfirm);
        this._cancelBtn.removeEventListener("click", onCancel);
        this._overlay.removeEventListener("click", onOverlayClick);
      };

      const onConfirm = () => {
        cleanup();
        resolve(true);
      };

      const onCancel = () => {
        cleanup();
        resolve(false);
      };

      const onOverlayClick = (e) => {
        if (e.target === this._overlay) {
          cleanup();
          resolve(false);
        }
      };

      this._confirmBtn.addEventListener("click", onConfirm);
      this._cancelBtn.addEventListener("click", onCancel);
      this._overlay.addEventListener("click", onOverlayClick);
    });
  }
}
