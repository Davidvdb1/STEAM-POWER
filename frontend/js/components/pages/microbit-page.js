import SPAComponent from "../model/SPAComponent.js";

class MicrobitPage extends SPAComponent {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML =
      `<div id="main-content">
        <data-overview></data-overview>
        <microbit-manual></microbit-manual>
      </div>`;
  }
}

customElements.define("microbit-page", MicrobitPage);
