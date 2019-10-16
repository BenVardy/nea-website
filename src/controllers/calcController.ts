import { IController, IInputModel, Nav } from '../types';

/**
 * The Controller in the MVC
 * Does input parsing
 */
export default class CalcController implements IController {
    // Properties
    protected model?: IInputModel;

    // Methods
    /**
     * Sets the model property
     * @param model The model to set
     */
    public setModel(model: IInputModel) {
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

        if (model.inMatrix()) {
            if (key.match(/^[\-\d\.]$/)) {
                model.addToMatrix(key);
            } else {
                switch (keyCode) {
                    case 8: // Backspace
                        model.backspace();
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
                model.addToCalc(key);
            } else if (key.match(/^[a-z+*/\^\-()]$/)) {
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
                    case 219: // Left Square Bracket
                        model.newMatrix();
                        break;
                }
            }
        }
    }
}
