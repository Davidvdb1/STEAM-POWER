import userService from '../../../service/user.service.js';
import SPAComponent from "../model/SPAComponent.js";
import { ErrorEnum } from "../../../types/errorEnum.js";

class ResetPasswordPage extends SPAComponent {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
            <div id="content-container">
                <form id="reset-password-form">
                    <h2>Reset Wachtwoord</h2>
                    <div id="error-message" class="text-danger"></div>
                    <label for="new-password">nieuw wachtwoord:</label>
                    <input type="password" id="new-password-1" name="new-password" required>

                    <label for="new-password">hertype het nieuwe wachtwoord:</label>
                    <input type="password" id="new-password-2" name="new-password" required>

                    <input type="submit" value="Dien In">
                </form>
            </div>
        `;

    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    this.registerEventListener(document.getElementById('reset-password-form'), 'submit', async function (e) {
      e.preventDefault();
      const errorMessageDiv = document.getElementById('error-message');
      errorMessageDiv.textContent = '';

      const value1 = document.getElementById('new-password-1').value;
      const value2 = document.getElementById('new-password-2').value;

      if (value1 !== value2) {
        errorMessageDiv.textContent = 'Wachtwoorden komen niet overeen.';
      } else {
        try {
          const response = await userService.updatePassword(token, value1);
          if (response.ok) {
            alert('Wachtwoord is succesvol aangepast.');
            window.location.href = '/frontend/index.html';
            navs.switchView(navs.LOGIN);
          } else {
            const responseData = await response.json();

            if (responseData.message == ErrorEnum.InvalidToken) {
              errorMessageDiv.textContent = 'De tijd is voorlopen of het wijzigingstoken is ongeldig.';
            } else if (responseData.message == ErrorEnum.InvalidCredentials) {
              errorMessageDiv.textContent = 'Het wachtwoord moet minstens 6 tekens zijn.';
            } else {
              errorMessageDiv.textContent = 'Er is een fout opgetreden. Probeer het later opnieuw.';
            }
          }
        } catch (error) {
          errorMessageDiv.textContent = 'Er is een fout opgetreden. Probeer het later opnieuw.';
        }
      }
    });
  }
}

customElements.define("reset-password-page", ResetPasswordPage);
