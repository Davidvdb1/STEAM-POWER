const navs = Object.freeze({
  OVERZICHT: "<overzicht-page></overzicht-page>",
  GROEPEN: "<groepen-page></groepen-page>",
  SPEL: "<spel-page></spel-page>",
  MICROBIT: "<microbit-page></microbit-page>",
  LOGIN: "<login-page></login-page>",
  LEERLING_LOGIN: "<login-leerling-page></login-leerling-page>",
  SIGN_UP: "<sign-up-page></sign-up-page>",
  SAVE_CAMP: "<save-camp-page></save-camp-page>",
  CAMPS: "<camps-page><camps-page>",
  WORKSHOPS: "<workshops-page><workshops-page>",
  SAVE_WORKSHOP: "<save-workshop-page></save-workshop-page>",
  RECOVER_PASSWORD: "<recover-password-page></recover-password-page>",
  RESET_PASSWORD: "<reset-password-page></reset-password-page>",
  USERS: "<users-page></users-page>",
  WORKSHOP_DETAILS: "<workshop-details-page></workshop-details-page>",

  historyStack: [],
  forwardStack: [],
  MAX_STACK_LENGTH: 50,

  switchView: function (pageNav, addToHistory = true) {
    const permission = securityReqs.hasPermission(pageNav);
    if (permission) {
      if (window.cleanupHandler) {
        window.cleanupHandler.clear();
      }
      nav = pageNav;
      sessionStorage.setItem('state', pageNav);

      if (addToHistory) {
        this.historyStack.push(pageNav);
        if (this.historyStack.length > this.MAX_STACK_LENGTH) {
          this.historyStack.shift(); // Remove the oldest entry
        }
        sessionStorage.setItem('historyStack', JSON.stringify(this.historyStack));
        sessionStorage.setItem('forwardStack', JSON.stringify([])); // Clear forward stack
        this.forwardStack = [];
        window.history.pushState({ pageNav }, "", "");
      }

      rerenderNavSim();
    } else {
      console.error("You do not have permission to view that page.");
    }
    return permission;
  },

  goBack: function () {
    if (this.historyStack.length > 1) {
      this.forwardStack.push(this.historyStack.pop());
      if (this.forwardStack.length > this.MAX_STACK_LENGTH) {
        this.forwardStack.shift(); // Remove the oldest entry
      }
      sessionStorage.setItem('forwardStack', JSON.stringify(this.forwardStack));

      let previousNav = this.historyStack[this.historyStack.length - 1];
      while ((previousNav === navs.LOGIN && sessionStorage.getItem("token")) || (previousNav === navs.LEERLING_LOGIN && sessionStorage.getItem("currentGroup"))) {
        this.forwardStack.push(this.historyStack.pop());
        sessionStorage.setItem('forwardStack', JSON.stringify(this.forwardStack));
        previousNav = this.historyStack[this.historyStack.length - 1];
      }

      sessionStorage.setItem('historyStack', JSON.stringify(this.historyStack));
      this.switchView(previousNav, false);
      window.history.pushState({ pageNav: previousNav }, "", "");
    }
  },

  goForward: function () {
    if (this.forwardStack.length > 0) {
      let nextNav = this.forwardStack.pop();
      while ((previousNav === navs.LOGIN && sessionStorage.getItem("token")) || (previousNav === navs.LEERLING_LOGIN && sessionStorage.getItem("currentGroup"))) {
        nextNav = this.forwardStack.pop();
      }

      this.historyStack.push(nextNav);
      if (this.historyStack.length > this.MAX_STACK_LENGTH) {
        this.historyStack.shift(); // Remove the oldest entry
      }
      sessionStorage.setItem('historyStack', JSON.stringify(this.historyStack));
      sessionStorage.setItem('forwardStack', JSON.stringify(this.forwardStack));

      this.switchView(nextNav, false);
      window.history.pushState({ pageNav: nextNav }, "", "");
    }
  },

  loadHistoryStack: function () {
    const storedHistoryStack = sessionStorage.getItem('historyStack');
    if (storedHistoryStack) {
      this.historyStack = JSON.parse(storedHistoryStack);
    }
    const storedForwardStack = sessionStorage.getItem('forwardStack');
    if (storedForwardStack) {
      this.forwardStack = JSON.parse(storedForwardStack);
    }
  }
});

window.addEventListener('popstate', (event) => {
  const state = event.state;
  if (state && state.pageNav) {
    if ((state.pageNav === navs.LOGIN && sessionStorage.getItem("token")) || (state.pageNav === navs.LEERLING_LOGIN && sessionStorage.getItem("currentGroup"))) return;
    navs.switchView(state.pageNav, false);
  }
});

const securityReqs = Object.freeze({
  ANY: [navs.LOGIN, navs.LEERLING_LOGIN, navs.CAMPS, navs.WORKSHOPS, navs.RECOVER_PASSWORD, navs.RESET_PASSWORD, navs.WORKSHOP_DETAILS],
  LOGIN: [navs.OVERZICHT, navs.SPEL, navs.MICROBIT],
  LEERKRACHT: [navs.GROEPEN, navs.SAVE_CAMP, navs.SAVE_WORKSHOP, navs.SIGN_UP, navs.USERS],

  hasPermission(n) {
    if (Object.values(navs).includes(n)) {
      if (this.ANY.includes(n)) {
        return true;
      } else if (this.LOGIN.includes(n)) {
        return sessionStorage.getItem("token") !== null || sessionStorage.getItem("currentGroup") !== null;
      } else if (this.LEERKRACHT.includes(n)) {
        const token = sessionStorage.getItem("token");

        if (n == navs.USERS) {
          if (token !== null && getEmailFromToken(token) === 'twaleuvennoreply@gmail.com') {
            return true;
          }
        } else if (n == navs.SIGN_UP) {
          if (token !== null && getEmailFromToken(token) === 'twaleuvennoreply@gmail.com') {
            return true;
          }
        } else {
          return token !== null && emailInToken(token);
        }
      } else {
        throw new Error(`The given page to navigate to couldn't be found in the permission lists. (${n})`)
      }
    }
  }
});

// This parses jwt paylaod without verifying (it could be tempered with)
function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function emailInToken(token) {
  return parseJwt(token).hasOwnProperty("email");
}

function getEmailFromToken(token) {
  const payload = parseJwt(token);
  return payload.hasOwnProperty("email") ? payload.email : null;
}

// Initialize the current page to be navigated to
let nav = navs.LOGIN;

// Load the history stack from sessionStorage
navs.loadHistoryStack();

const state = sessionStorage.getItem('state');
if (state) {
  const permittedNav = navs.switchView(state, false);
  if (!permittedNav) {
    if (sessionStorage.getItem("token") || sessionStorage.getItem("currentGroup")) {
      navs.switchView(navs.CAMPS, false);
    } else {
      navs.switchView(navs.LOGIN, false);
    }
  }
} else {
  navs.switchView(navs.LOGIN, false);
}

function rerenderNavSim() {
  // Re-render the NavSim component
  const navSim = document.querySelector('nav-sim');
  if (navSim) {
    navSim.connectedCallback();
  }
}

class NavSim extends HTMLElement {
  constructor() {
    super();
  }

  // Basically a switch that decides what component to render in the main part of the page
  connectedCallback() {
    const content = nav.valueOf();

    this.innerHTML =
      `<custom-header></custom-header>
      <main>
        <div id="content-container">
          ${content}
        </div>
      </main>
      <custom-footer></custom-footer>`;
  }
}

// Helper function to decode a JWT token
function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
}

// Check if the token is expired
function isTokenExpired(token) {
  const decodedToken = decodeToken(token);
  if (!decodedToken) {
    return true;
  }
  const expiryTime = decodedToken.exp * 1000; // Convert to milliseconds
  return Date.now() > expiryTime;
}

function expiredToLoginIn() {
  const token = sessionStorage.getItem('token');
  const groupToken = sessionStorage.getItem('currentGroup');

  if (token && isTokenExpired(token)) {
    sessionStorage.removeItem('token');
    navs.switchView(navs.LOGIN);
  } else if (groupToken && isTokenExpired(groupToken)) {
    sessionStorage.removeItem('currentGroup');
    navs.switchView(navs.LOGIN);
  }
}

// Check and refresh token every hour
setInterval(async () => {
  expiredToLoginIn();
}, 3600000); // 3600000 ms = 1 hour

// Initial token check on page load
window.addEventListener('load', async () => {
  expiredToLoginIn();
});

customElements.define('nav-sim', NavSim);
