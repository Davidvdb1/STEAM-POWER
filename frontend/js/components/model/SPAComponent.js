export default class SPAComponent extends HTMLElement {
  constructor() {
    super();
    window.cleanupHandler.register(this.destroy);
    this.eventListeners = [];
    this.intervalsList = [];
  }

  registerEventListener = (element, type, cb) => {
    element.addEventListener(type, cb);
    this.eventListeners.push({element: element, type: type, cb: cb});
  }

  registerInterval = (time, cb) => {
    const interval = setInterval(cb, time);
    this.intervalsList.push(interval);
  }

  destroy = () => {
    this.eventListeners.forEach((eventListener) => {
      eventListener.element.removeEventListener(eventListener.type, eventListener.cb);
    });

    this.intervalsList.forEach((interval) => {
      clearInterval(interval);
    });

    this.eventListeners = [];
    this.intervalsList = [];
  }
}
