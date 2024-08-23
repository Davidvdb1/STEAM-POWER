class GroepenPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
        <create-group></create-group>
        <group-overview></group-overview>`
      ;
  }
}

customElements.define('groepen-page', GroepenPage);
