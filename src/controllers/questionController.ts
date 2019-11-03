import { IQuestionController, IQuestionModel } from '../types';
import CalcController from './calcController';

/**
 * The controller for the questions view
 */
export default class QuestionController extends CalcController implements IQuestionController {
    // Properties
    protected model?: IQuestionModel;

    // Methods
    /**
     * Sets the model property
     * @param model The model to set
     */
    public setModel(model: IQuestionModel) {
        this.model = model;
    }

    /**
     * Change the area focused on
     * @param newFocus The new focus area
     */
    public changeFocus(newFocus: number): void {
        if (this.model) this.model.changeFocus(newFocus);
    }

    /**
     * Changes an option for the calculation
     * @param name The name of the option
     * @param value The new value
     */
    public setOption(name: string, value: string): void {
        if (this.model) this.model.setOption(name, value);
    }

    /**
     * Gets a new question
     * @param type The type of question
     */
    public getQuestion(type: string) {
        if (this.model) this.model.getQuestion(type);
    }
}
