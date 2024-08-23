import userService from "../../service/user.service.js";
import SPAComponent from "./model/SPAComponent.js";
import { ErrorEnum } from "../../types/errorEnum.js";

class SignUp extends SPAComponent {
  constructor() {
    super();
  }


  clearError() {
    const statusField = document.getElementById("status-field-register");
    if (statusField) {
      statusField.innerHTML = '';
    }
  }

  addSignupError(message = 'Er is iets verkeerd gelopen. Probeer later opnieuw.') {
    let messageHTML = '';
    if (typeof message === 'object') {
      // Loop over the properties of the object and create a span for each one
      for (let key in message) {
        if (message.hasOwnProperty(key)) {
          if (message[key] == 'Password must be at least 6 characters long') {
            messageHTML += `<span class="message" style="text-align: start;">Het wachtwoord moet minstens 6 tekens zijn.</span>`;
          } else if ('Email address is already in use.') {
            messageHTML += `<span class="message" style="text-align: start;">Het email adres is al in gebruik.</span>`;
          } else {
            messageHTML += `<span class="message" style="text-align: start;">${message[key]}</span>`;
          }
        }
      }
    } else {
      messageHTML = `<span class="message">${message}</span>`;
    }

    document.getElementById("status-field-register").innerHTML = `
      <div id="status" class='status_error' style="justify-content: center; flex-direction: column;">
        ${messageHTML}
      </div>
    `;

    // Add CSS to add margin to the bottom of each span, but remove it for the last one
    let style = document.createElement('style');
    style.innerHTML = `
      .message:not(:last-child) {
        margin-bottom: 10px;
      }
    `;
    document.head.appendChild(style);
  }

  connectedCallback() {
    this.innerHTML = `
      <h2>Regristreer nieuwe leerkracht</h2>
      <p style="color: red;">Waarschuwing wachtwoord herstel is alleen mogelijk met een bestaand email account!</p>
      <form id="signUpForm">
        <label for="register-username">Gebruikersnaam:</label>
        <input type="text" id="register-username" name="username" required>
        <label for="register-email">Email:</label>
        <input type="email" id="register-email" name="email" required>
        <label for="register-password">Wachtwoord:</label>
        <input type="password" id="register-password" name="password" required>
        <input type="submit" value="Regristreer account">
      </form>
      <div id="status-field-register"></div>
    `;

    this.registerEventListener(document.getElementById('signUpForm'), 'submit', async (event) => {
      event.preventDefault();
      this.clearError();

      const username = document.getElementById('register-username').value;
      const email = document.getElementById('register-email').value;
      const password = document.getElementById('register-password').value;

      try {
        const response = await userService.register({
          user: {
            username: username,
            email: email,
            password: password
          }
        }
        );

        if (response.ok) {
          alert('Account is succesvol aangemaakt.');
          navs.switchView(navs.SIGN_UP);
        } else if (response.status == 400) {
          const JsonRes = await response.json();
          if (JsonRes.message == ErrorEnum.InvalidCredentials) {
            this.addSignupError(JsonRes.explanation);
          } else {
            this.addSignupError();
          }

        }
      } catch (e) {
        this.addSignupError();
      }
    });
  }
}

customElements.define('signup-form', SignUp);
