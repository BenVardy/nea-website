import InputMatrix from '../models/inputMatrix';
import { IQuestionController, IQuestionModel, Nav } from '../types';

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
                        model.backspace(false);
                        break;
                    case 13: // Return
                        model.nav(Nav.RETURN);
                        break;
                    case 37: // Left Arrow
                        if (!model.shouldExitMatrix(false)) {
                            model.nav(Nav.LEFT);
                            break;
                        }
                        // Don't break if it should exit matrix to left
                    // I know its not number order
                    case 219: // Left Square Bracket
                        // endMatrix(forwards: boolean) -> false == don't move the cursor forwards
                        model.endMatrix(false);
                        break;
                    case 38: // Up Arrow
                        model.nav(Nav.UP);
                        break;
                    case 32: // Space bar
                    case 39: // Right Arrow
                        model.nav(Nav.RIGHT);
                        break;
                    case 40: // Down Arrow
                        model.nav(Nav.DOWN);
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
                        model.backspace(false);
                        break;
                    case 13: // Return
                        model.submit();
                        break;
                    case 35: // End
                        model.nav(Nav.END);
                        break;
                    case 36: // Home
                        model.nav(Nav.HOME);
                        break;
                    case 37: // Left Arrow
                        model.nav(Nav.LEFT);
                        break;
                    case 39: // Right Arrow
                        model.nav(Nav.RIGHT);
                        break;
                    case 46: // Delete
                        model.backspace(true);
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
