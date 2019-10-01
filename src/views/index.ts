import katex from 'katex';
import fontLoader from 'webfontloader';

import Controller from '../controllers/controller';
import Calculator from '../models/calculator';
import { IController, IModel, IObservable, IView } from '../types';

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

        document.onreadystatechange = () => {
            if (document.readyState === 'complete') this.calcRoot.focus();
        };

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

        this.docRoot.innerHTML = '';
        this.setCalculatorHtml(newModel);
        this.docRoot.appendChild(this.calcRoot);

        this.calcRoot.focus();
    }

    /**
     * Sets Html for the calculator section in CalcRoot
     */
    private setCalculatorHtml(model: IModel): void {
        this.calcRoot.innerHTML = '';

        // The root for the calculator section
        let calculation: HTMLElement = document.createElement('div');
        calculation.className = 'calculation';

        katex.render(Calculator.toLatex(
            model.calculation,
            model.inMatrix,
            model.cursor,
            true
        ), calculation);

        let resultELem: HTMLElement = document.createElement('div');
        resultELem.className = 'result calculation';

        let resultLatex: string = Calculator.toLatex(model.results, model.inMatrix, model.cursor, false);
        if (resultLatex === '') resultELem.innerHTML = '&nbsp;';
        else katex.render(resultLatex, resultELem);

        let errorElem: HTMLElement = document.createElement('div');
        errorElem.innerText = model.error;

        this.calcRoot.appendChild(calculation);
        this.calcRoot.appendChild(resultELem);
        this.calcRoot.appendChild(errorElem);
    }
}
