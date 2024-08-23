import MicrobitLogService from "../../service/microbitLog.service.js";

const UART_SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const UART_TX_CHARACTERISTIC_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";

class MicroBitHandler {
  subscribtions = new Map();
  hasEventListener = false;
  async startBluetooth() {
    await this.connect();
    await this.addEventListenerBluetooth();
  }

  async startHTTPFileReading(fileName) {
    this.fileName = fileName;
    this.addEventListenerHTTP();
  }


  async connect() {
    this.hasEventListener = false;
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: "BBC micro:bit" }],
      optionalServices: [UART_SERVICE_UUID]
    });
    this.server = await device.gatt.connect();
    // delay
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  async addEventListenerBluetooth() {
    const service = await this.server.getPrimaryService(UART_SERVICE_UUID);
    const characteristic = await service.getCharacteristic(UART_TX_CHARACTERISTIC_UUID);

    const changeValueFunc = () => {
      const value = new TextDecoder().decode(event.target.value);
      this.notify(value);
    };

    if (!this.hasEventListener) {
      characteristic.addEventListener('characteristicvaluechanged', changeValueFunc);
      this.hasEventListener = true;
      await characteristic.startNotifications();
    }
  }

  async addEventListenerHTTP() {
    if (this.httpInterval) {
      clearInterval(this.httpInterval);
    }

    this.httpInterval = setInterval(async () => {
      const content = await MicrobitLogService.getFileContent(this.fileName);

      if (content !== this.prevContent) {
        const dataList = content.split('\n');
        const lastValue = dataList[dataList.length-2].split(' ')[1];
        this.notify(lastValue);
      }

      this.prevContent = content;
    }, 1000);
  }

  subscribe(sub) {
      this.subscribtions.set(sub.name, sub.cb);
  }

  notify(value) {
    if (value !== '\n') {
      const b64Value = btoa(value);
      this.subscribtions.forEach((cb) => {
        cb(b64Value);
      });
    }
  }
}

let microBitHandler = new MicroBitHandler();
window.microBitHandler = microBitHandler;
