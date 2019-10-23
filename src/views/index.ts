import katex from 'katex';

import CalcController from '../controllers/calcController';
import Calculator from '../models/calculator';
import { ICalcModel, IController, IObservable, IObserver} from '../types';

import {commands} from '../models/statics';

import './index.scss';

/**
 * The representation of the DOM in the MVC
 */
export default class Index implements IObserver {
    // Properties
    private model: ICalcModel;
    private controller: IController;

    // The root element
    private docRoot: HTMLElement;
    private calcRoot: HTMLElement;

    private showCursor: boolean;

    // Methods
    /**
     * Creates a new Document
     */
    public constructor(root: HTMLElement) {
        this.docRoot = root;

        this.model = new Calculator();
        this.controller = new CalcController();

        this.model.addObserver(this);
        this.controller.setModel(this.model);

        this.calcRoot = document.createElement('div');
        this.calcRoot.id = 'calculator-root';

        this.calcRoot.tabIndex = 0;
        this.inputChar = this.inputChar.bind(this);

        this.calcRoot.addEventListener('keydown', this.inputChar);

        this.calcRoot.addEventListener('focusin', () => {
            this.showCursor = true;
            this.update(this.model);
        });

        this.calcRoot.addEventListener('focusout', () => {
            this.showCursor = false;
            this.model.nav(6, false);
            this.update(this.model);
        });

        document.onreadystatechange = () => {
            if (document.readyState === 'complete') this.calcRoot.focus();
        };

        this.docRoot.appendChild(this.calcRoot);
        this.docRoot.appendChild(this.staticUsage());

        this.showCursor = true;

        this.update(this.model);
    }

    /**
     * Called by the model to update the interface with new data
     * @param source The model
     */
    public update(source: IObservable) {
        let newModel = source as ICalcModel;

        this.setCalculatorHtml(newModel);
    }

    /**
     * Handles the keydown event in the webpage
     * @param e The event passed from the "keydown" event
     */
    private inputChar(e: KeyboardEvent): void {
        this.controller.parseChar(e);
    }

    /**
     * Sets Html for the calculator section in CalcRoot
     */
    private setCalculatorHtml(model: ICalcModel): void {
        this.calcRoot.innerHTML = '';

        // The root for the calculator section
        let calculation: HTMLElement = document.createElement('div');
        calculation.className = 'calculation';

        let calcLatex: string = Calculator.toLatex(
            model.calculation,
            model.inMatrix(),
            model.cursor,
            this.showCursor
        );
        if (calcLatex === '') calculation.innerHTML = '&nbsp;';
        else katex.render(calcLatex, calculation);

        let resultELem: HTMLElement = document.createElement('div');
        resultELem.className = 'result calculation';

        let resultLatex: string = Calculator.toLatex(model.results, model.inMatrix(), model.cursor, false, true);
        if (resultLatex === '') resultELem.innerHTML = '&nbsp;';
        else katex.render(resultLatex, resultELem);

        let errorElem: HTMLElement = document.createElement('div');
        errorElem.innerHTML = model.error;
        errorElem.className = 'error-message';

        this.calcRoot.appendChild(calculation);
        this.calcRoot.appendChild(resultELem);
        this.calcRoot.appendChild(errorElem);
    }

    private staticUsage(): HTMLElement {
        let container = document.createElement('div');
        container.className = 'usage';

        let tableContainer = document.createElement('div');
        tableContainer.className = 'usage-table mdc-data-table';

        let table = document.createElement('table');
        table.className = 'mdc-data-table__table';

        let tableHead = document.createElement('thead');

        let tHeadRow = document.createElement('tr');
        tHeadRow.className = 'mdc-data-table__header-row';

        tHeadRow.append(...['Key', 'Command'].map(value => {
            let th = document.createElement('th');
            th.className = 'mdc-data-table__header-cell';
            th.setAttribute('role', 'collumnheader');
            th.setAttribute('scope', 'col');

            th.innerHTML = value;
            return th;
        }));

        tableHead.appendChild(tHeadRow);
        table.appendChild(tableHead);

        let tableBody = document.createElement('tbody');
        tableBody.className = 'mdc-data-table__content';

        tableBody.append(...Object.keys(commands).map(key => {
            let value: string = commands[key];
            let tr = document.createElement('tr');
            tr.className = 'mdc-data-table__row';

            tr.append(...[key, value].map(val => {
                let td = document.createElement('td');
                td.className = 'mdc-data-table__cell';
                td.innerHTML = val;

                return td;
            }));

            return tr;
        }));

        table.appendChild(tableBody);
        tableContainer.appendChild(table);
        container.appendChild(tableContainer);

        return container;
    }
}
