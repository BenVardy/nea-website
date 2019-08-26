import Controller from '../controllers/controller';
import Calculator from '../models/calculator';
import { IController, IModel, IObservable, IView } from '../types';

import 'katex/dist/katex.min.css';
import './document.scss';

/**
 * The representation of the DOM in the MVC
 */
export default class Document implements IView {
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
        let newModel: IModel = source as IModel;

        this.docRoot.innerHTML = '';
        this.docRoot.appendChild(newModel.getHtml());
    }

}
