class UsersPage extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `<user-overview><user-overview>`;
    }
}

customElements.define("users-page", UsersPage);
