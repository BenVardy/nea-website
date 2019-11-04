import ComponentBase from './ComponentBase';

import './checkbox.scss';

export default class Checkbox extends ComponentBase {

    public onClick?: (value: boolean) => void;
    public defualtValue: boolean;

    constructor(options?: {[P in keyof Checkbox]?: Checkbox[P]}) {
        super(options);

        if (!options) options = {};
        this.onClick = options.onClick;
        this.defualtValue = options.defualtValue || false;

        this.root.classList.add('checkbox-container');

        let container = document.createElement('div');
        container.classList.add('checkbox-container');

        let input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = this.defualtValue;

        container.addEventListener('click', () => {
            input.checked = !input.checked;
            if (this.onClick) this.onClick(input.checked);
        });

        container.appendChild(input);

        let checkmark = document.createElement('span');
        checkmark.classList.add('checkmark');

        container.appendChild(checkmark);

        let label = document.createElement('span');
        label.classList.add('checkbox-label');
        label.innerText = this.label || '';

        container.appendChild(label);

        this.root.appendChild(container);
    }
}
