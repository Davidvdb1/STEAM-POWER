class WorkshopsPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <custom-planning></custom-planning>
        `;
    }
}

customElements.define("workshops-page", WorkshopsPage);
