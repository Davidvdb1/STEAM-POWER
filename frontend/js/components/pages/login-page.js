import SPAComponent from "../model/SPAComponent.js";

class LoginPage extends SPAComponent {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML =
      `${!sessionStorage.getItem("token") ? `
        <login-form>
          <a href="#">Sign Up</a>
        </login-form>` : ``}`
      ;
  }
}

customElements.define('login-page', LoginPage);
