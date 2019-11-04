import ComponentBase from './ComponentBase';

import './slider.scss';

export default class Slider extends ComponentBase {
    public minValue: string;
    public maxValue: string;
    public defaultValue: string;

    public clickHandler: never;
    public innerHTML: never;

    public constructor(options?: {[P in keyof Slider]?: Slider[P]}) {
        super(options);
        if (!options) options = {};

        this.minValue = options.minValue || '1';
        this.maxValue = options.maxValue || '4';
        this.defaultValue = options.defaultValue || '3';

        if (this.className) this.root.classList.add(this.className);

        let slider = document.createElement('input');
        slider.classList.add('slider');
        slider.setAttribute('type', 'range');
        slider.setAttribute('min', this.minValue);
        slider.setAttribute('max', this.maxValue);
        slider.setAttribute('value', this.defaultValue);

        this.root.appendChild(slider);

        let value = document.createElement('div');
        value.innerHTML = `${this.label}: `;

        let valueNumber = document.createElement('span');
        valueNumber.classList.add('valueNumber');
        valueNumber.innerHTML = this.defaultValue;

        value.insertAdjacentElement('beforeend', valueNumber);
        this.root.appendChild(value);

        slider.addEventListener('input', () => {
            valueNumber.innerHTML = slider.value;
            if (this.changeHandler) this.changeHandler(slider.value);
        });
    }
}
