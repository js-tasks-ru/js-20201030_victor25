export default class RangePicker {

    static monthNames = ["январь", "февраль", "март", "апрель", "май", "июнь",
        "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"
    ];

    element;
    subElements = {};
    selectedDates = [];

    constructor({   
        from = new Date(),
        to = new Date(),
    } = {}) {
        this.from = from;
        this.to = to;
        this.currentMonth = new Date (this.from.getFullYear(), this.from.getMonth(), 1);
        this.nextMonth = new Date (this.from.getFullYear(), this.from.getMonth() + 1, 1);
        this.render();
        this.initEventListeners();
    }
    
    onInputClick = event => {
        const input = event.target.closest('[data-element="input"]');
        if (input) {
            if (this.element.classList.contains('rangepicker_open')) {
                this.element.classList.remove('rangepicker_open');
                this.selectedDates = [];
            } else {
                this.subElements.selector.innerHTML = this.getSelectorContent(this.from, this.to);
                this.subElements.input.innerHTML = this.getInputContent(this.from, this.to);
                this.element.classList.add('rangepicker_open');
            }

        } else {
            const selectCell = event.target.closest('.rangepicker__cell');
            if (selectCell) {
                this.selectedDates.push(selectCell);
                if (this.selectedDates.length === 1) {

                    let fromelem = this.element.querySelector('.rangepicker__selected-from');
                    if(fromelem) {
                        fromelem.classList.remove('rangepicker__selected-from');
                    }
                    let toelem = this.element.querySelector('.rangepicker__selected-to');
                    if(toelem) {
                        toelem.classList.remove('rangepicker__selected-to'); 
                    }

                    let betweens = this.element.querySelectorAll('.rangepicker__selected-between');
                    betweens.forEach(item => {
                        item.classList.remove('rangepicker__selected-between');
                    });

                    selectCell.classList.add('rangepicker__selected-from');
                    this.from = new Date(this.selectedDates[0].dataset.value);
                    this.to = new Date(this.selectedDates[0].dataset.value);
                }
                else {
                    const first = new Date(this.selectedDates[0].dataset.value);
                    const secend = new Date(this.selectedDates[1].dataset.value);
                    if(first.getTime() < secend.getTime()) {
                        this.from = first;
                        this.to = secend;
                    } else {
                        this.from = secend;
                        this.to = first;        
                    }

                    this.subElements.input.innerHTML = this.getInputContent(this.from, this.to);
                    this.subElements.selector.innerHTML = this.getSelectorContent(this.from, this.to);    

                    this.selectedDates = [];
                    this.element.classList.remove('rangepicker_open');
                }
            } else {
                const selector = event.target.closest('[data-element="selector"]');
                const rightMonth = event.target.closest('.rangepicker__selector-control-right');
                const leftMonth = event.target.closest('.rangepicker__selector-control-left');

                if (rightMonth) {
                    this.currentMonth.setMonth(this.currentMonth.getMonth()+1);
                    this.nextMonth.setMonth(this.nextMonth.getMonth()+1);
                    this.subElements.input.innerHTML = this.getInputContent(this.from, this.to);
                    const [firstCalendar, secondCalendar] = this.subElements.selector.querySelectorAll('.rangepicker__calendar');
                    firstCalendar.innerHTML = this.getCalendare(this.currentMonth, this.from, this.to);
                    secondCalendar.innerHTML = this.getCalendare(this.nextMonth, this.from, this.to);
                }

                if (leftMonth) {
                    this.currentMonth.setMonth(this.currentMonth.getMonth()-1);
                    this.nextMonth.setMonth(this.nextMonth.getMonth()-1);
                    this.subElements.input.innerHTML = this.getInputContent(this.from, this.to);
                    const [firstCalendar, secondCalendar] = this.subElements.selector.querySelectorAll('.rangepicker__calendar');
                    firstCalendar.innerHTML = this.getCalendare(this.currentMonth, this.from, this.to);
                    secondCalendar.innerHTML = this.getCalendare(this.nextMonth, this.from, this.to);
                }
                
                if (!selector) {
                    this.element.classList.remove('rangepicker_open');
                    this.selectedDates = [];
                }
            }
        }
    }

    initEventListeners () {
        document.body.append(this.element);
        document.addEventListener('click', this.onInputClick);

    }
    
    get template() {
        return `
            <div class="rangepicker">
                <div class="rangepicker__input" data-element="input">
                    ${this.getInputContent(this.from, this.to)}
                </div>
                <div class="rangepicker__selector" data-element="selector"></div>
            </div>
            `;
    }

    getInputContent(from, to) {
        return `
                <span data-element="from">${this.mmddyyyyFormatDate(from)}</span> -
                <span data-element="to">${this.mmddyyyyFormatDate(to)}</span>
            `;
    }

    mmddyyyyFormatDate(date) {
        let dd = date.getDate();
        let mm = date.getMonth()+1; 
        const yyyy = date.getFullYear();
        if (dd < 10) {
            dd=`0${dd}`;
        } 
        if (mm < 10) {
            mm=`0${mm}`;
        } 
        return `${dd}.${mm}.${yyyy}`;
    }

    getMonthName(date) {
        return RangePicker.monthNames[date.getMonth()];
    }

    getDaysInMonth(year,month) {
       return new Date(year, month+1, 0).getDate();
    }

    getMonthDates(month, from, to) {
        const days = this.getDaysInMonth(month.getFullYear(), month.getMonth());
        const result = [];
        for(let i = 0; i<days; i++) {
            const day = new Date(month.getFullYear(), month.getMonth(), i+1);
            const parentDayCell = document.createElement("div");
            parentDayCell.innerHTML = `<button type="button" class="rangepicker__cell" data-value="${day.toISOString()}">${day.getDate()}</button>`;
            const dayElement = parentDayCell.firstElementChild;

            if (day.getDate() === 1) {
                dayElement.style = `--start-from: ${(day.getDay())}`;
            }
            if (day.getTime() === from.getTime() ) {
                dayElement.classList.add('rangepicker__selected-from');
            }
            if (day.getTime() === to.getTime() ) {
                dayElement.classList.add('rangepicker__selected-to');
            }
            if (day.getTime() > from.getTime() && day.getTime() < to.getTime()) {
                dayElement.classList.add('rangepicker__selected-between');
            }

            result.push(dayElement.outerHTML);
        }
        return result.join('');
    }

    getCalendare(month, from, to) {
        return `
        <div class="rangepicker__month-indicator">
            <time datetime="${this.getMonthName(month)}">${this.getMonthName(month)}</time>
        </div>
        <div class="rangepicker__day-of-week">
            <div>Пн</div>
            <div>Вт</div>
            <div>Ср</div>
            <div>Чт</div>
            <div>Пт</div>
            <div>Сб</div>
            <div>Вс</div>
        </div>
        <div class="rangepicker__date-grid">
            ${this.getMonthDates(month, from, to)}
        </div>
        `;
    }

    getSelectorContent(from, to) {
        return `
            <div class="rangepicker__selector-arrow"></div>
            <div class="rangepicker__selector-control-left"></div>
            <div class="rangepicker__selector-control-right"></div>
            <div class="rangepicker__calendar">
                ${this.getCalendare(this.currentMonth, from, to)}
            </div>
            <div class="rangepicker__calendar">
                ${this.getCalendare(this.nextMonth, from, to)}
            </div>
            `;
    }

    render() {
        const element = document.createElement("div");
        element.innerHTML = this.template;
        this.element = element.firstElementChild;
        this.subElements = this.getSubElements(this.element);
    }

    
    getSubElements(element) {
        const elements = element.querySelectorAll('[data-element]');
        const subElements = {};
        [...elements].forEach(subElement => {
            subElements[subElement.dataset.element] = subElement;
        });
        return subElements;
    }
 
    remove () {
        if (this.element) {
            this.element.remove();
        }
    }
    
    destroy() {
        this.element.remove();
    }


}
