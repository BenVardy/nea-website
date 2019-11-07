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
    public parseChar(e: KeyboardEvent): void {
        const { model } = this;
        const { key } = e;

        // model could be undefined
        if (!model) return;
        if (e.ctrlKey) return;

        if (model.inMatrix()) {
            if (key.match(/^[\-\d\.e]$/)) {
                model.addToMatrix(key);
            } else {
                switch (key) {
                    case 'Backspace': // Backspace
                        model.backspace(false);
                        break;
                    case 'Enter': // Return
                        model.nav(Nav.RETURN);
                        break;
                    case 'ArrowLeft': // Left Arrow
                        if (!model.shouldExitMatrix(false)) {
                            model.nav(Nav.LEFT);
                            break;
                        }
                        // Don't break if it should exit matrix to left
                    // I know its not number order
                    case '[': // Left Square Bracket
                        // endMatrix(forwards: boolean) -> false == don't move the cursor forwards
                        model.endMatrix(false);
                        break;
                    case 'ArrowUp': // Up Arrow
                        model.nav(Nav.UP);
                        break;
                    case ' ': // Space bar
                    case 'ArrowRight': // Right Arrow
                        model.nav(Nav.RIGHT);
                        break;
                    case 'ArrowDown': // Down Arrow
                        model.nav(Nav.DOWN);
                        break;
                    case ']': // Right Square Bracket
                        model.endMatrix();
                        break;
                }
            }
        } else {
            if (key.match(/^[\-\d\.]$/)) {
                model.addToCalc(key);
            } else if (key.match(/^[a-z+*/\^()]$/)) {
                model.addToCalc(key);
            } else {
                switch (key) {
                    case 'Backspace': // Backspace
                        model.backspace(false);
                        break;
                    case 'Enter': // Return
                        model.submit();
                        break;
                    case 'End': // End
                        model.nav(Nav.END);
                        break;
                    case 'Home': // Home
                        model.nav(Nav.HOME);
                        break;
                    case 'ArrowLeft': // Left Arrow
                        model.nav(Nav.LEFT);
                        break;
                    case 'ArrowRight': // Right Arrow
                        model.nav(Nav.RIGHT);
                        break;
                    case 'Delete': // Delete
                        model.backspace(true);
                        break;
                    case '[': // Left Square Bracket
                        model.newMatrix();
                        break;
                }
            }
        }
    }
}
