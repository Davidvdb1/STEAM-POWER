import userService from "../../service/user.service.js";
import SPAComponent from "./model/SPAComponent.js";
import { ErrorEnum } from "../../types/errorEnum.js";

class LogIn extends SPAComponent {
  constructor() {
    super();
  }

  clearError() {
    const statusField = document.getElementById("status-field");
    if (statusField) {
      statusField.innerHTML = '';
    }
  }

  addLoginError(message = 'Er is iets verkeerd gelopen. Probeer later opnieuw.') {
    document.getElementById("status-field").innerHTML = `
    <div id="status" class='status_error' style="justify-content: center">
        <span>${message}</span>
    </div>
    `;
  }

  connectedCallback() {
    this.innerHTML = `
      <h2>Login</h2>
      <form id="loginForm">
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
        <label for="password">Wachtwoord:</label>
        <input type="password" id="password" name="password" required>

        <a id="recover-password" class="no-account">wachtwoord vergeten, klik hier om opnieuw in te stellen.</a>

        <input type="submit" value="Log In">
      </form>
      <div id="status-field"></div>
    `;

    this.registerEventListener(document.getElementById('recover-password'), 'click', () => {
      navs.switchView(navs.RECOVER_PASSWORD);
    });

    this.registerEventListener(document.getElementById('loginForm'), 'submit', async (event) => {
      event.preventDefault();
      this.clearError();

      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const response = await userService.login({
          user: {
            email: email,
            password: password
          }
        }
        );

        if (response.ok) {

          const JsonRes = await response.json();
          sessionStorage.setItem('token', JsonRes.token);
          navs.switchView(navs.CAMPS);

        } else if (response.status == 400) {

          const JsonRes = await response.json();
          if (JsonRes.message == ErrorEnum.InvalidCredentials) {
            this.addLoginError('ongeldige aanmeldingsgegevens');
          } else {
            this.addLoginError();
          }

        }
      } catch (e) {
        this.addLoginError();
      }
    });
  }
}

customElements.define('login-form', LogIn);
