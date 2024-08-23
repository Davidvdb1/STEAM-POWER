import userService from "../../service/user.service.js";
import { ErrorEnum } from '../../types/errorEnum.js';
import SPAComponent from "./model/SPAComponent.js";

class RecoverPassword extends SPAComponent {
    connectedCallback() {
        this.email = '';
        this.render();
        this.registerEventListener(this.querySelector('#resetPasswordForm'), 'submit', (event) => {
            event.preventDefault();
            this.handleSubmit(event);
        });
    }

    async handleSubmit(event) {
        const emailInput = this.querySelector('#email-recovery');
        this.email = emailInput.value;
        const response = await userService.RecoverPassword(this.email);
        if (!response.ok) {
            const data = await response.json();
            if (data.message == ErrorEnum.DoesntExist) {
                this.error = 'Deze Email heeft nog geen account.';
            } else {
                this.error = 'Er is een fout opgetreden. Probeer het later opnieuw.';
            }
        } else {
            this.email = ''; // clear the email
        }
        this.render();
    }

    render() {
        this.innerHTML = `
            <form id="resetPasswordForm">
                <h2>Reset Wachtwoord</h2>
                ${this.error != null ? `<p class="mb-1 text-danger text-start">${this.error}</p>` : ''}
                <label for="email">Email:</label>
                <input type="email" id="email-recovery" name="email" required value="${this.email}">
                <input type="submit" value="Reset Wachtwoord">
            </form>
        `;
        this.registerEventListener(this.querySelector('#resetPasswordForm'), 'submit', (event) => {
            event.preventDefault();
            this.handleSubmit(event);
        });
    }
}

customElements.define('recover-password-form', RecoverPassword);
