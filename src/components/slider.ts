import './slider.scss';

export default class Slider {

    public className: string;
    public id: string;
    public onChange?: (value: string) => void;
    public label: string;

    public minValue: string;
    public maxValue: string;
    public defaultNumber: string;

    private sliderContainer: HTMLElement;

    public constructor(options: {[P in keyof Slider]?: Slider[P]}) {
        this.className = options.className || '';
        this.id = options.id || '';
        this.label = options.label || '';

        this.minValue = options.minValue || '1';
        this.maxValue = options.maxValue || '4';
        this.defaultNumber = options.defaultNumber || '3';

        this.onChange = options.onChange;

        this.sliderContainer = document.createElement('div');
        this.sliderContainer.classList.add('slider-container');
        if (this.className !== '') this.sliderContainer.classList.add(this.className);

        let slider = document.createElement('input');
        slider.classList.add('slider');
        if (this.id !== '') slider.id = this.id;
        slider.setAttribute('type', 'range');
        slider.setAttribute('min', this.minValue);
        slider.setAttribute('max', this.maxValue);
        slider.setAttribute('value', this.defaultNumber);

        this.sliderContainer.appendChild(slider);

        let value = document.createElement('div');
        value.innerHTML = `${this.label}: `;

        let valueNumber = document.createElement('span');
        valueNumber.classList.add('valueNumber');
        valueNumber.innerHTML = this.defaultNumber;

        value.insertAdjacentElement('beforeend', valueNumber);
        this.sliderContainer.appendChild(value);

        slider.addEventListener('input', () => {
            valueNumber.innerHTML = slider.value;
            if (this.onChange) this.onChange(slider.value);
        });
    }

    public render(): HTMLElement {
        return this.sliderContainer;
    }
}
