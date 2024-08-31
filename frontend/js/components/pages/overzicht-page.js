class OverzichtPage extends HTMLElement {
  constructor() {
    super();
    this.energy = 0.00;
  }

  connectedCallback() {
    this.innerHTML =
      `<div id="content">
          <energy-overview></energy-overview>
          ${sessionStorage.getItem('currentGroup') ? "<battery-view></battery-view>" : ""}
          <div style="${sessionStorage.getItem('token') ? "margin-top: 1rem;" : ""}">
            <energy-voorwerp-overview></energy-voorwerp-overview>
          </div>
        </div>`;
  }
}

customElements.define("overzicht-page", OverzichtPage);
