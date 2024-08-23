import SPAComponent from "../model/SPAComponent.js";

class LoginPage extends SPAComponent {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <signup-form></signup-form>
        `;
    }
}

customElements.define('sign-up-page', LoginPage);
