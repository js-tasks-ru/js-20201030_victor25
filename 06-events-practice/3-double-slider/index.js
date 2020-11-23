export default class DoubleSlider {

    element;
    subElements;
    min;
    max;
    selected;
    selectedThumb;
    fromValueInPrecent;
    toValueInPrecent;
    leftBoundigPosition;
    rightBoundingPosition;

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

        this.fromValueInPrecent = this.toPrecent(this.selected.from, this.min, this.max);
        this.toValueInPrecent = 100 - this.toPrecent(this.selected.to, this.min, this.max);
        this.render();
        this.initEventListeners();
    }

    get template() {
        return `
            <div class="range-slider">
                <span data-element="from"></span>
                <div data-element="iner" class="range-slider__inner">
                    <span data-element="progress" class="range-slider__progress"></span>
                    <span data-element="thumbleft" class="range-slider__thumb-left"></span>
                    <span data-element="thumbright" class="range-slider__thumb-right"></span>
                </div>
                <span data-element="to"></span>
            </div>
            `;
    }

    toPrecent(value, min, max) {
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
        this.leftBoundigPosition = 0;
        this.rightBoundingPosition = this.subElements.iner.getBoundingClientRect().width;

        this.selectedThumb = event.target;
        event.preventDefault();
    }

    handlePointerMove(event) {
        if(this.selectedThumb === this.subElements.thumbleft) {
            this.subElements.from.innerHTML = this.formatValue(this.min);
            this.fromValueInPrecent = 
                Math.round(((event.clientX -  this.leftBoundigPosition) / ( this.rightBoundingPosition - this.leftBoundigPosition)) * 100);
            this.fromValueInPrecent = (this.fromValueInPrecent > 100) ? 100 : (this.fromValueInPrecent < 0) ? 0 : this.fromValueInPrecent;
            this.selected.from = this.min + Math.round(((this.max - this.min)*this.fromValueInPrecent)/100);
        } else if (this.selectedThumb === this.subElements.thumbright) {
            this.toValueInPrecent = 
                100 - Math.round(((event.clientX -  this.leftBoundigPosition) / ( this.rightBoundingPosition - this.leftBoundigPosition)) * 100);
            this.toValueInPrecent = (this.toValueInPrecent > 100) ? 100 : (this.toValueInPrecent < 0) ? 0 : this.toValueInPrecent;
            this.selected.to =  this.max - Math.round(((this.max - this.min)*this.toValueInPrecent)/100);
        }
        this.update();
    }

    update() {
        this.subElements.from.innerHTML = this.formatValue(this.selected.from);
        this.subElements.progress.style.left = this.fromValueInPrecent+'%';
        this.subElements.thumbleft.style.left = this.fromValueInPrecent+'%';

        this.subElements.to.innerHTML = this.formatValue(this.selected.to);
        this.subElements.progress.style.right = this.toValueInPrecent+'%';
        this.subElements.thumbright.style.right = this.toValueInPrecent+'%';
    }

    render() {
        const element = document.createElement("div");
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(this.element);
        this.update();
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
