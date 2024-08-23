class Header extends HTMLElement {
  constructor() {
    super();
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem("currentGroup")
    navs.switchView(navs.LOGIN);
    this.connectedCallback();
  }

  addNavToElement(elementId, nav) {
    document.getElementById(elementId).addEventListener('click', () => {
      navs.switchView(nav);
    });
  }

  connectedCallback() {
    const currentGroup = sessionStorage.getItem('currentGroup');
    const currentToken = sessionStorage.getItem('token');

    this.innerHTML = `
      <nav class="navbar navbar-expand-custom header">
        <div class="container-nav">
          <button id="logo" class="btn p-0">
            <img src="img/TWA-logo-def1024_1-230w.jpg" alt="Logo" class="nav-logo">
          </button>
          <div class="collapse navbar-collapse justify-content-end" id="navbarNavDropdown">
            <ul class="navbar-nav">

              <li class="nav-item">
                <button id="home" class="nav-link ${nav == navs.CAMPS ? 'active' : ''}" aria-current="page">Home</button>
              <li class="nav-item">

              ${currentGroup || currentToken ?
        `
                  </li>
                  <li class="nav-item">
                    <button id="overzicht" class="nav-link ${nav == navs.OVERZICHT ? 'active' : ''}" aria-current="page">Overzicht</button>
                  </li>
                  <li class="nav-item">
                    <button id="spel" class="nav-link ${nav == navs.SPEL ? 'active' : ''}">Spel</button>
                  </li>
                  <li class="nav-item">
                    <button id="microbit" class="nav-link ${nav == navs.MICROBIT ? 'active' : ''}">Micro:bit</button>
                  </li>
                ` : `
                  <li class="nav-item">
                    <button id="login" class="nav-link ${nav == navs.LOGIN ? 'active' : ''}" style="background-color: rgb(231, 51, 82); border: none; color: white; padding: 8px 16px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; cursor: pointer; border-radius: 5px; margin-bottom: 0.5rem;">Leerkracht login</button>
                  </li>
                  <li class="nav-item">
                    <button id="leerling-login" class="nav-link ${nav == navs.LEERLING_LOGIN ? 'active' : ''}" style="background-color: rgb(86, 205, 233); border: none; black: white; padding: 8px 16px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; cursor: pointer; border-radius: 5px;">Leerling login</button>
                  </li>`
      }

             ${currentGroup ? `<li class="nav-item">
                  <button class="nav-link" id="leave-group" style="background-color: rgb(231, 51, 82); border: none; color: white; padding: 8px 16px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; cursor: pointer; border-radius: 5px;">Groep verlaten</button>
                </li>` : ''}

            ${currentToken ? `
                <li class="nav-item">
                  <button id="groepen" class="nav-link ${nav == navs.GROEPEN ? 'active' : ''}"  >Groepen</button>
                </li>
                ${getEmailFromToken(currentToken) === 'twaleuvennoreply@gmail.com' ? `
                  <li class="nav-item">
                    <button id="users" class="nav-link ${nav == navs.USERS ? 'active' : ''}">Gebruikers</button>
                  </li>
                  <li class="nav-item">
                    <button id="sign-up" class="nav-link ${nav == navs.SIGN_UP ? 'active' : ''}" style="background-color: rgb(86, 205, 233); border: none; black: white; padding: 8px 16px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; cursor: pointer; border-radius: 5px; margin-bottom: 0.5rem;">Nieuw account</button>
                  </li>
                ` : ''}
                <li class="nav-item">
                  <button class="nav-link" id="logout" style="background-color: rgb(231, 51, 82); border: none; color: white; padding: 8px 16px; text-align: center; text-decoration: none; display: inline-block; font-size: 16px; cursor: pointer; border-radius: 5px;">Logout</button>
                </li>` : ''}

            </ul >
          </div >

          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div >
      </nav >
    `;

    this.addNavToElement("home", navs.CAMPS);

    // Add event listener to the "Leave Group" button if it exists
    if (currentGroup || currentToken) {
      this.addNavToElement("overzicht", navs.OVERZICHT);
      this.addNavToElement("spel", navs.SPEL);
      this.addNavToElement("microbit", navs.MICROBIT);
    } else {
      this.addNavToElement("login", navs.LOGIN);
      this.addNavToElement("leerling-login", navs.LEERLING_LOGIN);
    }

    if (currentGroup) {
      this.querySelector('#leave-group').addEventListener('click', (e) => {
        e.preventDefault();
        sessionStorage.removeItem('currentGroup');
        navs.switchView(navs.LEERLING_LOGIN); // Redirect to loginLeerling.html
      });
    } else if (currentToken) {
      this.addNavToElement("groepen", navs.GROEPEN);
      if (getEmailFromToken(currentToken) === 'twaleuvennoreply@gmail.com') {
        this.addNavToElement("users", navs.USERS);
        this.addNavToElement("sign-up", navs.SIGN_UP);
      }

      document.getElementById("logout").addEventListener('click', () => {
        this.logout();
      });
    }

    document.getElementById("logo").addEventListener('click', () => {
      navs.switchView(navs.CAMPS);
    });
  }
}

customElements.define('custom-header', Header);
