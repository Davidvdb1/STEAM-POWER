class CampsPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <h1>Welkom bij TWA</h1>
            <custom-camps></custom-camps>
        `;
    }
}

customElements.define('camps-page', CampsPage);
