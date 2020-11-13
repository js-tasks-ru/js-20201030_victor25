export default class ColumnChart {

    

    constructor({   
        data = [],
        label = '',
        value = '',
        link = ''
    } = {}) {
        
        this.data = data;
        this.label = label;
        this.value = value;
        this.link = link;
        this.chartHeight = 50;

        this.render();
        this.initEventListeners();
    }
    
    render() {
        const element = document.createElement('div');
        element.classList.add('column-chart');

        if (this.data.length === 0) {
            element.classList.add('column-chart_loading');
            element.style = "--chart-height: 50";
        }

        element.append(this.crateTitle());
        element.append(this.crateContainer());

        this.element = element;
    }
    
    crateTitle() {
        const titleElement = document.createElement('div');
        titleElement.classList.add('column-chart__title');
        titleElement.innerHTML = 'Total ' + this.label;

        if (this.link) {
            titleElement.append(this.crateTitleLink());
        }

        return titleElement;
    }

    crateTitleLink() {
        const linkElement = document.createElement('a');
        linkElement.href = this.link;
        linkElement.classList.add('column-chart__link');
        linkElement.innerHTML = 'View all';
        return linkElement;
    }

    crateContainer() {
        const containerElement = document.createElement('div');
        containerElement.classList.add('column-chart__container');
        containerElement.append(this.createHeader());
        containerElement.append(this.createBody());
        return containerElement;
    }

    createHeader() {
        const headerElement = document.createElement('div');
        headerElement.classList.add('column-chart__header');
        headerElement.setAttribute('data-element','header');
        headerElement.innerHTML = this.value;
        return headerElement;
    }

    createBody() {
        const bodyElement = document.createElement('div');
        bodyElement.classList.add('column-chart__chart');
        bodyElement.setAttribute('data-element','body');

        if (this.data && this.data.length > 0) {
            const normValue = Math.max(...this.data);
            this.data.forEach(value => {
                bodyElement.append(this.createValue(value, normValue));
            });
        }

        return bodyElement;
    }

    createValue(value, normValue) {
        const valueElement = document.createElement('div');
        valueElement.setAttribute('style', "--value: " + this.calcScaleValue(value, normValue));
        valueElement.setAttribute('data-tooltip', this.calcPrecent(value, normValue));
        return valueElement;
    }

    initEventListeners () {

    }
    
    remove () {
        this.element.remove();
    }
    
    destroy() {
        this.remove();
    }

    update (data) {
        this.data = data;
        this.render();
    }

    calcPrecent(value, normValue) {
        return (value / normValue * 100).toFixed(0) + '%';
    }

    calcScaleValue(value, normValue) {
        const scale = this.chartHeight / normValue;
        return String(Math.floor(value * scale));
    }

}
      

