const SUCCESS_TYPE = 'success';
const ERROR_TYPE = 'error';

export default class NotificationMessage {

    static activeElement;
    element;
    
    constructor(msg = '', {
        duration = 1000,
        type = SUCCESS_TYPE
    } = {}) {
        this._message = msg;
        this._type = type;
        this._duration = duration;

        this.render();
    }

    get duration () {
        return this._duration;
    }

    get durationInSec () {
        return this._duration / 1000;
    }

    get type () {
        return this._type;
    }

    get message () {
        return this._message;
    }

    get template() {
        return `
        <div class="${this.getNotificationClasses()}" style="--value:${this.durationInSec}s">
            <div class="timer"></div>
            <div class="inner-wrapper">
            <div class="notification-header">${this.type}</div>
            <div class="notification-body">${this.message}</div>
            </div>
        </div>`;
    }

    render() {
        const element = document.createElement("div");
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
    }

    show(parent = document.body) {
        parent.append(this.element);
        if (NotificationMessage.activeElement) {
            NotificationMessage.activeElement.remove();
        }
        NotificationMessage.activeElement = this.element;
        setTimeout(this.remove.bind(this), this._duration);
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
        NotificationMessage.activeElement = null;
    }

    getNotificationClasses () {
        switch (this._type) {
            case SUCCESS_TYPE:
                return 'notification success';
            case ERROR_TYPE:
                return 'notification error';
            default:
                return '';
        }
    }

}
