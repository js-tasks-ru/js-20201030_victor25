export default class DoubleSlider {

    element;
    subElements;
    min;
    max;
    selected;
    selectedThumb;
    _fromProcent;
    _toProcent;

    constructor({
        min = 10,
        max = 100,
        formatValue = value => '$' + value,
        selected = {
            from: min,
            to: max
        }
    } = {}) {
        this.min = min;
        this.max = max;
        this.selected = selected;
        this.formatValue = formatValue;

        this._fromProcent = this.valueToProcent(this.selected.from, this.min, this.max);
        this._toProcent = 100 - this.valueToProcent(this.selected.to, this.min, this.max);
        this.render();
        this.initEventListeners();
    }

    get template() {
        return `
            <div class="range-slider">
                <span data-element="from">${this.formatValue(this.selected.from)}</span>
                <div data-element="iner" class="range-slider__inner">
                    <span data-element="progress" class="range-slider__progress" style="left: ${this.fromProcent}%; right: ${this.toProcent}%"></span>
                    <span data-element="thumbleft" class="range-slider__thumb-left" style="left: ${this.fromProcent}%"></span>
                    <span data-element="thumbright" class="range-slider__thumb-right" style="right: ${this.toProcent}%"></span>
                </div>
                <span data-element="to">${this.formatValue(this.selected.to)}</span>
            </div>
            `;
    }

    get fromProcent() {
        return this._fromProcent;
    }

    get toProcent() {
        return this._toProcent;
    }

    get leftX () {
        return this.subElements.iner.getBoundingClientRect().left;
    }

    get rightX () {
        return this.subElements.iner.getBoundingClientRect().right;
    }

    valueToProcent(value, min, max) {
        return Math.round(((value - min) / (max - min)) * 100);
    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');
        const subElements = {};
        [...elements].forEach(subElement => {
            subElements[subElement.dataset.element] = subElement;
        });
        return subElements;
    }

    initEventListeners () {
        this.subElements.thumbleft.addEventListener('pointerdown', this.handlePointerDown.bind(this));
        this.subElements.thumbright.addEventListener('pointerdown', this.handlePointerDown.bind(this));
        document.addEventListener('pointerup', this.handlePointerUp.bind(this));
        document.addEventListener('pointermove', this.handlePointerMove.bind(this));
    }

    handlePointerUp(event) {
        if(this.element && this.selectedThumb) {
            this.dispatch();
            this.selectedThumb = null;
        }
    }

    handlePointerDown(event) {
        this.selectedThumb = event.target;
        event.preventDefault();
    }

    handlePointerMove(event) {
        if(this.selectedThumb === this.subElements.thumbleft) {
            this.subElements.from.innerHTML = this.formatValue(this.min);
            this._fromProcent = Math.round(((event.clientX -  this.leftX) / ( this.rightX - this.leftX)) * 100);
            this._fromProcent = (this._fromProcent > 100) ? 100 : (this._fromProcent < 0) ? 0 : this._fromProcent;
            this.selected.from = this.min + Math.round(((this.max - this.min)*this._fromProcent)/100);
            
            this.subElements.from.innerHTML = this.formatValue(this.selected.from);
            this.subElements.progress.style.left = this.fromProcent+'%';
            this.subElements.thumbleft.style.left = this.fromProcent+'%';
        } else if (this.selectedThumb === this.subElements.thumbright) {
            this._toProcent = 100 - Math.round(((event.clientX -  this.leftX) / ( this.rightX - this.leftX)) * 100);
            this._toProcent = (this._toProcent > 100) ? 100 : (this._toProcent < 0) ? 0 : this._toProcent;
            this.selected.to =  100 - Math.round(((this.max - this.min)*this._toProcent)/100);
            
            this.subElements.to.innerHTML = this.formatValue(this.selected.to);
            this.subElements.progress.style.right = this.toProcent+'%';
            this.subElements.thumbright.style.right = this.toProcent+'%';
        }
    }

    render() {
        const element = document.createElement("div");
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(this.element);
    }

    remove() {
        if(this.element) {
            this.element.remove();
        }
    }

    destroy() {
        this.remove();
        this.element = null;
    }

    dispatch() {
        this.element.dispatchEvent(new CustomEvent("range-select", {
            detail: { from: this.selected.from, to: this.selected.to }
        }));
    }
}
