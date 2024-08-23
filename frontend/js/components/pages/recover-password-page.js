
class RecoverPasswordPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
            <recover-password-form></recover-password-form>
        `;
    }
}

customElements.define("recover-password-page", RecoverPasswordPage);
