import katex from 'katex';
import fontLoader from 'webfontloader';

import Controller from '../controllers/controller';
import Calculator from '../models/calculator';
import { IController, IModel, IObservable, IView } from '../types';

import commands from '../models/commands';

import './index.scss';

/**
 * The representation of the DOM in the MVC
 */
export default class Index implements IView {
    // Properties
    private model: IModel;
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
        // Load fonts
        fontLoader.load({
            custom: {
                families: ['KaTeX_Size1', 'KaTeX_Size3', 'KaTeX_Size4', 'KaTeX_Math'],
                urls: ['/main.css']
            }
        });

        this.docRoot = root;

        this.model = new Calculator();
        this.controller = new Controller();

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
            this.model.navEnd();
            this.update(this.model);
        });

        document.onreadystatechange = () => {
            if (document.readyState === 'complete') this.calcRoot.focus();
        };

        this.docRoot.appendChild(this.calcRoot);
        this.staticUsage()
            .then(html => this.docRoot.appendChild(html));

        this.showCursor = true;

        this.update(this.model);
    }

    /**
     * Handles the keydown event in the webpage
     * @param e The event passed from the "keydown" event
     */
    public inputChar(e: KeyboardEvent): void {
        let {key, keyCode} = e;

        this.controller.parseChar(key, keyCode);
    }

    /**
     * Called by the model to update the interface with new data
     * @param source The model
     */
    public update(source: IObservable) {
        let newModel = source as IModel;

        this.setCalculatorHtml(newModel);
    }

    /**
     * Sets Html for the calculator section in CalcRoot
     */
    private setCalculatorHtml(model: IModel): void {
        this.calcRoot.innerHTML = '';

        // The root for the calculator section
        let calculation: HTMLElement = document.createElement('div');
        calculation.className = 'calculation';

        let calcLatex: string = Calculator.toLatex(
            model.calculation,
            model.inMatrix,
            model.cursor,
            this.showCursor
        );
        if (calcLatex === '') calculation.innerHTML = '&nbsp;';
        else katex.render(calcLatex, calculation);

        let resultELem: HTMLElement = document.createElement('div');
        resultELem.className = 'result calculation';

        let resultLatex: string = Calculator.toLatex(model.results, model.inMatrix, model.cursor, false, true);
        if (resultLatex === '') resultELem.innerHTML = '&nbsp;';
        else katex.render(resultLatex, resultELem);

        let errorElem: HTMLElement = document.createElement('div');
        errorElem.innerText = model.error;

        this.calcRoot.appendChild(calculation);
        this.calcRoot.appendChild(resultELem);
        this.calcRoot.appendChild(errorElem);
    }

    private async staticUsage(): Promise<HTMLElement> {
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
            }))

            return tr;
        }));

        table.appendChild(tableBody);
        tableContainer.appendChild(table);
        container.appendChild(tableContainer);

        return container;
    }
}
