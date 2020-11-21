class Tooltip {

  static instance;
  element;

  constructor() {
      if (Tooltip.instance) {
        return Tooltip.instance;
      }

      Tooltip.instance = this;
  }
  
  initialize() {
      this.initEventListeners();
  }

  render(value) {
    this.element = document.createElement('div');
    this.element.className = 'tooltip';
    this.element.innerHTML = value;

    document.body.append(this.element);
  }

  handlePointerover(event) {
    if (event.target.dataset.tooltip != undefined) {
      const element = event.target.closest('[data-tooltip]');
      const tooltipValue = element.dataset.tooltip;
      if (element) {
        this.render(tooltipValue);
        this.element.style.left = event.clientX + 'px';
        this.element.style.top = event.clientY + 'px';
      }
    }
  }

  handlePointerout(event) {
    if (event.target.dataset.tooltip != undefined) {
      this.remove();
    }
  }

  initEventListeners () {
    document.addEventListener('pointerover', this.handlePointerover.bind(this));
    document.addEventListener('pointerout', this.handlePointerout.bind(this));
  }

  remove() {
    if (this.element) {
      this.element.remove();
      this.element = null;
    }
  }

  destroy() {
    this.remove();
    document.removeEventListener('pointerover', this.handlePointerover.bind(this));
    document.removeEventListener('pointerout', this.handlePointerout.bind(this)); 
  }
}

const tooltip = new Tooltip();

export default tooltip;
