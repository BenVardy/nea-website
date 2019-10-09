import katex from 'katex';

import Button from '../components/button';
import QuestionController from '../controllers/questionController';
import QuestionsModel from '../models/questionModel';
import { IInputModel, IObservable, IObserver, IQuestionButton, IQuestionController, IQuestionModel } from '../types';

import Calculator from '../models/calculator';
import {buttons as importButtons} from '../models/statics';

import './questions.scss';

export default class Questions implements IObserver {
    private root: HTMLElement;
    private questionElem: HTMLElement;
    private ansElemContainer: HTMLElement;

    private model: IQuestionModel;
    private controller: IQuestionController;

    public constructor(root: HTMLElement) {
        this.root = root;

        this.model = new QuestionsModel();
        this.controller = new QuestionController();

        this.model.addObserver(this);
        this.controller.setModel(this.model);

        let buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';
        buttonsContainer.append(...this.getQuestionButtons(importButtons));
        this.root.appendChild(buttonsContainer);

        this.questionElem = document.createElement('div');
        this.questionElem.className = 'question';
        this.root.appendChild(this.questionElem);

        this.ansElemContainer = document.createElement('div');
        this.ansElemContainer.className = 'ans-area-container';

        this.inputChar = this.inputChar.bind(this);
        this.ansElemContainer.addEventListener('keydown', this.inputChar);

        this.ansElemContainer.tabIndex = 0;
        this.ansElemContainer.focus();
        this.root.appendChild(this.ansElemContainer);

        this.handleFocusChange = this.handleFocusChange.bind(this);

        this.update(this.model);
    }

    public update(o: IObservable) {
        const newModel = o as IQuestionModel;
        this.questionElem.innerHTML = newModel.question;

        this.ansElemContainer.innerHTML = '';

        this.ansElemContainer.append(...newModel.answers.map((ans, i) => {
            let ansArea: IInputModel = ans.calcArea;

            let ansElem = document.createElement('div');
            // Set boarder to green if correct else red
            switch (ans.correct) {
                case 0:
                    ansElem.classList.add('incorrect-ans');
                    break;
                case 1:
                    ansElem.classList.add('correct-ans');
                    break;
            }
            ansElem.classList.add('ans-area');

            let ansLatex: string = Calculator.toLatex(
                ansArea.calculation,
                ansArea.inMatrix(),
                ansArea.cursor,
                newModel.focusedArea === i
            );
            if (ansLatex === '') ansElem.innerHTML = '&nbsp;';
            else katex.render(ansLatex, ansElem);

            ansElem.addEventListener('click', () => this.handleFocusChange(i));

            return ansElem;
        }));
    }

    private getQuestionButtons(buttons: IQuestionButton[]): HTMLElement[] {
        return buttons.map(button => {
            let buttonElem = new Button();
            buttonElem.text = button.label;
            buttonElem.clickHandler = () => {
                this.handleNewQuestion(button.type);
            };

            return buttonElem.render();
        });
    }

    private inputChar(e: KeyboardEvent): void {
        this.controller.parseChar(e.key, e.keyCode);
    }

    private handleNewQuestion(type: string): void {
        this.controller.getQuestion(type, {});
    }

    private handleFocusChange(i: number): void {
        this.controller.changeFocus(i);
    }
}
