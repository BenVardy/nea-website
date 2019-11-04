import ComponentBase from './ComponentBase';

import './checkbox.scss';

export default class Checkbox extends ComponentBase {

    constructor(options?: {[P in keyof Checkbox]?: Checkbox[P]}) {
        super(options);

        this.root.classList.add('checkbox-container');

        let container = document.createElement('div');
        container.classList.add('checkbox-container');

        let input = document.createElement('input');
        input.type = 'checkbox';

        container.addEventListener('click', e => {
            input.checked = !input.checked;
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
