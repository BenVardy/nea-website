import InputMatrix from '../models/inputMatrix';
import { IQuestionController, IQuestionModel, Nav } from '../types';
import CalcController from './calcController';

export default class QuestionController extends CalcController implements IQuestionController {
    protected model?: IQuestionModel;

    /**
     * Sets the model property
     * @param model The model to set
     */
    public setModel(model: IQuestionModel) {
        this.model = model;
    }

    public changeFocus(newFocus: number): void {
        if (this.model) this.model.changeFocus(newFocus);
    }

    public getQuestion(type: string, options: {[key: string]: string}) {
        if (this.model) this.model.getQuestion(type, options);
    }
}
