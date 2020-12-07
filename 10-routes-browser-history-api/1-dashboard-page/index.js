import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class DashboardPage {

    element;
    subElements = {};
    components = {};

    async render () {
      const element = document.createElement('div');
      element.innerHTML = this.template;
      this.element = element.firstElementChild;
      this.subElements = this.getSubElements(this.element);
  
      this.initComponents();  
      this.renderComponents();
      this.initEventListeners();
      return this.element;
    }

    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');
        const subElements = {};
        [...elements].forEach(subElement => {
            subElements[subElement.dataset.element] = subElement;
        });
        return subElements;
    }

    get template () {
        return `
            <div class="dashboard">
                <div class="content__top-panel">
                    <h2 class="page-title">Панель управления</h2>
                    <div data-element="rangePicker"></div>
                </div>
                <div data-element="chartsRoot" class="dashboard__charts">
                    <div data-element="ordersChart" class="dashboard__chart_orders"></div>
                    <div data-element="salesChart" class="dashboard__chart_sales"></div>
                    <div data-element="customersChart" class="dashboard__chart_customers"></div>
                </div>
                <h3 class="block-title">Лидеры продаж</h3>
                <div data-element="sortableTable"></div>
            </div>`;
    }

    initComponents () {
        const from = new Date(); 
        from.setMonth(from.getMonth() - 1);
        const to = new Date();

        const rangePicker = new RangePicker({range: {
            from,
            to
        }});
        this.components.rangePicker = rangePicker;
    
        const sortableTable = new SortableTable(header, {
            url: `api/dashboard/bestsellers?_start=1&_end=20&from=${from.toISOString()}&to=${to.toISOString()}`,
            isSortLocally: true
        }); 
        this.components.sortableTable = sortableTable;
    
        const ordersChart = new ColumnChart({
            url: 'api/dashboard/orders',
            label: 'orders',
            range: {
                from,
                to
            }
        });
        this.components.ordersChart = ordersChart;
    
        const salesChart = new ColumnChart({
            url: 'api/dashboard/sales',
            label: 'sales',
            range: {
                from,
                to
            }
        });
        this.components.salesChart = salesChart;
    
        const customersChart = new ColumnChart({
            url: 'api/dashboard/customers',
            label: 'customers',
            range: {
                from,
                to
            }
        });
        this.components.customersChart = customersChart;
    }

    renderComponents () {
        Object.keys(this.components).forEach(component => {
            const parentElement = this.subElements[component];
            const childElement = this.components[component].element;
            parentElement.append(childElement);
        });
    }

    async updateComponents (from, to) {
        const data = await fetchJson(
            `${BACKEND_URL}api/dashboard/bestsellers?_start=1&_end=20&from=${from.toISOString()}&to=${to.toISOString()}`
        );
    
        this.components.sortableTable.addRows(data);
        this.components.ordersChart.update(from, to);
        this.components.salesChart.update(from, to);
        this.components.customersChart.update(from, to);
    }

    updateComponentsHandler = (event) => {
        this.updateComponents(event.detail.from, event.detail.to);
    }

    initEventListeners () {
        this.components.rangePicker.element.addEventListener('date-select', this.updateComponentsHandler);
    }
  
    remove () {
        if (this.element) {
            this.element.remove();
        }
    }
  
    destroy () {
        if (this.element) {
            this.remove();
            this.components.rangePicker.element.removeEventListener('date-select', this.updateComponentsHandler);
            for (const component of Object.values(this.components)) {
                component.destroy();
            };
            this.element = null;
            this.subElements = {};
            this.components = {};
        }
    }
}
