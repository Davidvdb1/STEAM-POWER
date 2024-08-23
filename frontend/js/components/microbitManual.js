import SPAComponent from "./model/SPAComponent.js";

class MicrobitManual extends SPAComponent {
  constructor() {
    super();
  }

  connectedCallback() {
    this.innerHTML = `
      <div class="manual-content">
            <h3 class="manual-title">Connecteer met Android (Connecteer via HTTP)</h3>
            <button class="collapsible-step">Stap 1</button>
            <section style="display: none">
                <h4>Download deze applicaties van GooglePlay</h4>
                <ul>
                    <li><a href="https://play.google.com/store/apps/details?id=de.kai_morich.serial_bluetooth_terminal&pcampaignid=web_share">Serial Bluetooth Terminal</a></li>
                    <li><a href="https://play.google.com/store/apps/details?id=com.phlox.simpleserver&pcampaignid=web_share">Simple HTTP Server</a></li>
                </ul>
            </section>

            <button class="collapsible-step">Stap 2</button>
            <section style="display: none">
                <h4>Serial Bluetooth Terminal instellen</h4>
                <p>Maak eerst een bluetooth connectie met de Micro:bit en jouw android apparaat.</p>

                <div class="manual-stap-container">
                    <img src="img/microbitManual/settings-page.jpeg" alt="Settings pagina" class="manual-img" />
                    <div>
                      <p>Settings > Misc. </p>
                      <p>Kies de locatie van de logbestanden. (Het is belangrijk dat je deze locatie onthoud voor latere stappen).</p>
                    </div>
                </div>

                <div class="manual-stap-container">
                    <img src="img/microbitManual/devices-page.jpg" alt="Devices pagina" class="manual-img" />
                    <div>
                        <p> Devices > Bluetooth LE </p>
                        <p> Selecteer de Micro:Bit </p>
                    </div>
                </div>


                <div class="manual-stap-container">
                    <img src="img/microbitManual/terminal-connect-page.jpg" alt="Terminal pagina" class="manual-img" />
                    <div>
                        <p> Navigeer naar de "Terminal" pagina </p>
                        <p> Connecteer de "Terminal" aan de Micro:Bit </p>
                    </div>
                </div>

                <div class="manual-stap-container">
                    <img src="img/microbitManual/terminal-page-settings.jpg" alt="Terminal pagina" class="manual-img" />
                    <div>
                        <p> Rechts vanboven click op de 3 stipjes. </p>
                    </div>
                </div>

                <div class="manual-stap-container">
                    <img src="img/microbitManual/logs-page.jpg" alt="Terminal Log pagina" class="manual-img" />
                    <div>
                        <p> Data > Log </p>
                        <p> Zet "Log" aan </p>
                    </div>
                </div>
            </section>


            <button class="collapsible-step">Stap 3</button>
            <section style="display: none">
                <h4> Simple HTTP Server instellen </h4>

                <div class="manual-stap-container">
                    <img src="img/microbitManual/http-page.jpg" alt="HTTP pagina" class="manual-img" />
                    <div>
                      <p> Selecteer Root folder (dit is dezelfde als waar je de logs in hebt opgeslagen) </p>
                      <p> & </p>
                      <p> Click op de “START” knop. </p>
                    </div>
                </div>

                <div class="manual-stap-container">
                    <img src="img/microbitManual/click-header-http-page.jpg" alt="HTTP pagina" class="manual-img" />
                    <div>
                        <p> Activeer "Custom response headers" </p>
                    </div>
                </div>

                <div class="manual-stap-container">
                    <img src="img/microbitManual/custom-response-header-page.jpg" alt="Custom Header pagina" class="manual-img" />
                    <div>
                        <p> Vul dit in: “Access-Control-Allow-Origin: *” </p>
                    </div>
                </div>
                <b> Als je dit allemaal gedaan hebt kan je connecteren door op <a href="#connect-http">deze</a> knop the clicken</b>
            </section>

      </div>
    `;

    // get all the collapsible-step buttons and put them in an array
    const cols = [].slice.call(document.getElementsByClassName("collapsible-step"));
    cols.forEach((col) => {
      this.registerEventListener(col, 'click', () => {
        var step = col.nextElementSibling;
        if (step.style.display === 'none') {
          step.style.display = 'block';
        } else {
          step.style.display = 'none';
        }

      });
    });

  }
}

customElements.define('microbit-manual', MicrobitManual);
