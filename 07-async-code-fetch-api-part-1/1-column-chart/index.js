import fetchCustom from "./utils/fetch-json.js";

const BACKEND_URL = 'https://course-js.javascript.ru/';
export default class ColumnChart {
    element;
    subElements = {};
    chartHeight = 50;

    constructor({   
        label = '',
        link = '',
        formatHeading = data => data,
        url = '',
        range = {
            from: new Date(),
            to: new Date(),
        }
    } = {}) {
        
        this.label = label;
        this.link = link;
        this.range = range;
        this.url = new URL(url, BACKEND_URL);
        this.formatHeading = formatHeading;

        this.render();
        this.loadData(this.range.from, this.range.to);
    }
    
    get template() {
        return `
            <div class="column-chart column-chart_loading" style="--chart-height: ${this.chartHeight}">
                <div class="column-chart__title">
                    Total ${this.label}
                    ${this.getLink()}
                </div>
                <div class="column-chart__container">
                    <div data-element="header" class="column-chart__header"></div>
                    <div data-element="body" class="column-chart__chart">
                    </div>
                </div>
            </div>
            `;
    }
    
    getHeaderContent (data) {
        return this.formatHeading([...data].reduce((total, value)=>{ return total += value; }, 0));
    }

    getBodyContent (data) {
        let result = '';
        if (data && data.length > 0) {
            const normValue = Math.max(...data);
            result = data.map(value => {
                return `<div style="--value: ${this.calcScaleValue(value, normValue)}" data-tooltip="${this.calcPrecent(value, normValue)}"></div>`;
            }).join('');
        }
        return result;
    }

    getLink() {
        return this.link ? `<a class="column-chart__link" href="${this.link}">View all</a>` : '';
    }

    getValue() {

    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');
        const subElements = {};
        [...elements].forEach(subElement => {
            subElements[subElement.dataset.element] = subElement;
        });
        return subElements;
    }

    render() {
        const element = document.createElement("div");
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(this.element);
    }

    async update(from, to) {
        return await this.loadData(from, to);
    }
 
    remove () {
        if (this.element) {
            this.element.remove();
        }
    }
    
    destroy() {
        this.element.remove();
    }

    calcPrecent(value, normValue) {
        return (value / normValue * 100).toFixed(0) + '%';
    }

    calcScaleValue(value, normValue) {
        const scale = this.chartHeight / normValue;
        return String(Math.floor(value * scale));
    }

    async loadData(from, to) {
        this.element.classList.add('column-chart_loading');
        this.subElements.header.innerHTML = '';
        this.subElements.body.innerHTML = '';

        this.url.searchParams.set('from', from.toISOString());
        this.url.searchParams.set('to', to.toISOString());

        this.range.from = from;
        this.range.to = to;
        const responseJson = await fetchCustom(this.url);
        if (responseJson) {
            const data = Object.values(responseJson);
            
            if (data && data.length > 0) {
                this.subElements.header.innerHTML = this.getHeaderContent(data);
                this.subElements.body.innerHTML = this.getBodyContent(data);
                this.element.classList.remove('column-chart_loading');
            }
        }
    }

}
