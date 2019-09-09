import DigitWrapper from "../models/digitWrapper";
import ExprWrapper from '../models/exprWrapper';
import Symbol from '../models/symbol';
import { IController, IModel } from "../types";

/**
 * The Controller in the MVC
 * Does input parsing
 */
export default class Controller implements IController {
    // Properties
    private model?: IModel;

    // Methods
    /**
     * Sets the model property
     * @param model The model to set
     */
    public setModel(model: IModel) {
        this.model = model;
    }

    /**
     * Handles the pressing of a key
     * @param key The key char
     * @param keyCode The key code
     */
    public parseChar(key: string, keyCode: number): void {
        const { model } = this;

        // model could be undefined
        if (!model) return;

        if (model.inMatrix) {
            if (key.match(/^[\d\.]$/)) {
                model.addToMatrix(key);
            } else {
                switch (keyCode) {
                    case 8: // Backspace
                        model.matrixBackspace();
                        break;
                    case 13: // Return
                        model.matrixNav(4);
                        break;
                    case 37: // Left Arrow
                        if (!model.shouldExitMatrix()) {
                            model.matrixNav(0);
                            break;
                        }
                    // I know its not number order
                    case 219: // Left Square Bracket
                        // endMatrix(forwards: boolean) -> false == don't move the cursor forwards
                        model.endMatrix(false);
                        break;
                    case 38: // Up Arrow
                        model.matrixNav(1);
                        break;
                    case 32: // Space bar
                    case 39: // Right Arrow
                        model.matrixNav(2);
                        break;
                    case 40: // Down Arrow
                        model.matrixNav(3);
                        break;
                    case 221: // Right Square Bracket
                        model.endMatrix();
                        break;
                }
            }
        } else {
            if (key.match(/^[\d\.]$/)) {
                model.addToCalc(new Symbol('no', new DigitWrapper(key)));
            } else if (key.match(/^[a-z+*/x\-(),]$/)) {
                model.addToCalc(new Symbol('expr', new ExprWrapper(key)));
            } else {
                switch (keyCode) {
                    case 8: // Backspace
                        model.backspace();
                        break;
                    case 13: // Return
                        model.calculate();
                        break;
                    case 37: // Left Arrow
                        model.navLeft();
                        break;
                    case 39: // Right Arrow
                        model.navRight();
                        break;
                    case 219: // Left Square Bracket
                        model.newMatrix();
                        break;
                }
            }
        }
    }
}
