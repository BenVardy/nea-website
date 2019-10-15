import InputMatrix from '../models/inputMatrix';
import { IQuestionController, IQuestionModel } from '../types';

export default class QuestionController implements IQuestionController {
    protected model?: IQuestionModel;

    /**
     * Sets the model property
     * @param model The model to set
     */
    public setModel(model: IQuestionModel) {
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

        let {calculation} = model.getFocusedArea();

        if (model.inMatrix()) {
            if (key.match(/^[\-\d\.]$/)) {
                model.addToMatrix(key);
            } else {
                switch (keyCode) {
                    case 8: // Backspace
                        model.backspace();
                        break;
                    case 13: // Return
                        model.nav(4);
                        break;
                    case 37: // Left Arrow
                        if (!model.shouldExitMatrix(false)) {
                            model.nav(0);
                            break;
                        }
                        // Don't break if it should exit matrix to left
                    // I know its not number order
                    case 219: // Left Square Bracket
                        // endMatrix(forwards: boolean) -> false == don't move the cursor forwards
                        model.endMatrix(false);
                        break;
                    case 38: // Up Arrow
                        model.nav(1);
                        break;
                    case 32: // Space bar
                    case 39: // Right Arrow
                        model.nav(2);
                        break;
                    case 40: // Down Arrow
                        model.nav(3);
                        break;
                    case 221: // Right Square Bracket
                        model.endMatrix();
                        break;
                }
            }
        } else {
            if (key.match(/^[\d\.]$/)) {
                // Check if there is a matrix already inputted
                // Don't allow multiple inputs
                if (calculation.length > 0 && InputMatrix.isInputMatrix(calculation[0])) return;
                model.addToCalc(key);
            } else {
                switch (keyCode) {
                    case 8: // Backspace
                        model.backspace();
                        break;
                    case 13: // Return
                        model.submit();
                        break;
                    case 35: // End
                        model.nav(6);
                        break;
                    case 36: // Home
                        model.nav(5);
                        break;
                    case 37: // Left Arrow
                        model.nav(0);
                        break;
                    case 39: // Right Arrow
                        model.nav(2);
                        break;
                    case 219: // Left Square Bracket
                        // Don't allow a matrix to be inputted unless it is the 1st item
                        if (calculation.length >= 1) return;
                        model.newMatrix();
                        break;
                }
            }
        }
    }

    public changeFocus(newFocus: number): void {
        if (this.model) this.model.changeFocus(newFocus);
    }

    public getQuestion(type: string, options: {[key: string]: string}) {
        if (this.model) this.model.getQuestion(type, options);
    }
}
