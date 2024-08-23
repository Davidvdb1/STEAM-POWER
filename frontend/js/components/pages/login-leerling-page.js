class LoginLeerlingPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `<group-join></group-join>`;

    // Check if currentGroup is set in sessionStorage
    const currentGroup = sessionStorage.getItem('currentGroup');
    // If currentGroup is set, redirect to the root page
    if (currentGroup) {
      navs.switchView(navs.OVERZICHT);
    }
  }
}

customElements.define("login-leerling-page", LoginLeerlingPage);
