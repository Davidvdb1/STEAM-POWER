class Footer extends HTMLElement {
  constructor() {
    super();
  }



  connectedCallback() {
    this.innerHTML = `
      <footer class="footer">
          <div class="container-footer text-center py-3">
              <p class="footer-text m-0">TWA-Leuven 2024 - All rights reserved</p>
          </div>
      </footer>
    `;
  }
}

customElements.define("custom-footer", Footer);
