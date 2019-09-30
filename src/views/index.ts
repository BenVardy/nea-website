import katex from 'katex';
import fontLoader from 'webfontloader';

import Controller from '../controllers/controller';
import Calculator from '../models/calculator';
import { IController, IModel, IObservable, IView } from '../types';

import 'katex/dist/katex.min.css';
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

    // Methods
    /**
     * Creates a new Document
     */
    public constructor() {
        // Load fonts
        fontLoader.load({
            custom: {
                families: ['KaTeX_Size1', 'KaTeX_Size3', 'KaTeX_Size4', 'KaTeX_Math'],
                urls: ['/main.css']
            }
        });

        let tempRoot = document.getElementById('root');
        if (!tempRoot) throw Error('No Root set in html');

        this.docRoot = tempRoot;

        this.model = new Calculator();
        this.controller = new Controller();

        this.model.addObserver(this);
        this.controller.setModel(this.model);

        this.update(this.model);

        this.inputChar = this.inputChar.bind(this);
        document.addEventListener('keydown', this.inputChar);
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
        this.docRoot.appendChild(this.getCalculatorHtml(newModel));
        this.docRoot.appendChild(this.getQuestionHtml(newModel));
    }

    /**
     * Gets Html for the calculator section
     */
    private getCalculatorHtml(model: IModel): HTMLElement {
        // The root for the calculator section
        let calculator: HTMLElement = document.createElement('div');
        calculator.className = 'calculator-root';

        let calculation: HTMLElement = document.createElement('div');
        calculation.className = 'calculation';

        katex.render(Calculator.toLatex(model.calculation, model.inMatrix, model.cursor, true), calculation);

        let resultELem: HTMLElement = document.createElement('div');
        resultELem.className = 'result calculation';

        let resultLatex: string = Calculator.toLatex(model.results, model.inMatrix, model.cursor, false);
        if (resultLatex === '') resultELem.innerHTML = '&nbsp;';
        else katex.render(resultLatex, resultELem);

        let errorElem: HTMLElement = document.createElement('div');
        errorElem.innerText = model.error;

        calculator.appendChild(calculation);
        calculator.appendChild(resultELem);
        calculator.appendChild(errorElem);

        return calculator;
    }

    /**
     * Gets html for the questions section
     */
    private getQuestionHtml(model: IModel): HTMLElement {
        // The root for the questions section
        let questions: HTMLElement = document.createElement('div');
        questions.className = 'questions-root';

        return questions;
    }

}
