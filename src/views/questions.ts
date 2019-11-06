import katex from 'katex';

import Button from '../components/button';
import Slider from '../components/slider';
import QuestionController from '../controllers/questionController';
import QuestionsModel from '../models/questionModel';
import { IInputModel, ILabelTypePair, IObservable, IObserver, IQuestionController, IQuestionModel } from '../types';

import Calculator from '../models/calculator';
import {buttons as importButtons, sliders} from '../models/statics';

import './questions.scss';
import Checkbox from '../components/checkbox';

/**
 * The questions page
 */
export default class Questions implements IObserver {
    // Properties
    private root: HTMLElement;
    private questionElem: HTMLElement;
    private ansElemContainer: HTMLElement;

    private model: IQuestionModel;
    private controller: IQuestionController;

    private showCursor: boolean;

    // Methods
    /**
     * Crates a new questions page
     *
     * @param root The root of the page
     */
    public constructor(root: HTMLElement) {
        this.root = root;

        this.model = new QuestionsModel();
        this.controller = new QuestionController();

        this.model.addObserver(this);
        this.controller.setModel(this.model);

        let questionsContainer = document.createElement('div');
        questionsContainer.classList.add('questions-container');

        let buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';
        buttonsContainer.append(...this.getQuestionButtons(importButtons));
        questionsContainer.appendChild(buttonsContainer);

        this.questionElem = document.createElement('div');
        this.questionElem.className = 'question';
        questionsContainer.appendChild(this.questionElem);

        this.ansElemContainer = document.createElement('div');
        this.ansElemContainer.className = 'ans-area-container';

        this.inputChar = this.inputChar.bind(this);
        this.ansElemContainer.addEventListener('keydown', this.inputChar);
        this.ansElemContainer.addEventListener('focusin', () => {
            this.showCursor = true;
            // this.update(this.model);
        });
        this.ansElemContainer.addEventListener('focusout', () => {
            this.showCursor = false;
            this.update(this.model);
        });
        this.ansElemContainer.tabIndex = 0;
        this.ansElemContainer.focus();
        questionsContainer.appendChild(this.ansElemContainer);

        this.root.appendChild(questionsContainer);
        this.root.appendChild(this.getOptions());

        this.handleFocusChange = this.handleFocusChange.bind(this);

        this.showCursor = true;

        this.update(this.model);
    }

    /**
     * Updates the DOM with new data. Part of IObservable
     *
     * @param o The model observed
     */
    public update(o: IObservable): void {
        const newModel = o as IQuestionModel;
        this.questionElem.innerHTML = newModel.question;

        this.ansElemContainer.innerHTML = '';

        this.ansElemContainer.append(...newModel.answerAreas.map((ans, i) => {
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
                this.showCursor && newModel.focusedArea === i
            );
            if (ansLatex === '') ansElem.innerHTML = '&nbsp;';
            else katex.render(ansLatex, ansElem);

            ansElem.addEventListener('click', () => this.handleFocusChange(i));

            return ansElem;
        }));
    }

    /**
     * Sets up HTML versions of buttons for questions from templates
     *
     * @param buttons The buttons templates
     */
    private getQuestionButtons(buttons: ILabelTypePair[]): HTMLElement[] {
        return buttons.map(button => {
            let buttonElem = new Button({
                innerHTML: button.label,
                clickHandler: () => {
                    this.handleNewQuestion(button.type);
                }
            });

            return buttonElem.render();
        });
    }

    private getOptions(): HTMLElement {
        let optionsContainer = document.createElement('div');
        optionsContainer.classList.add('options-container');

        let optionsHeader = document.createElement('h3');
        optionsHeader.id = 'options-header';
        optionsHeader.innerHTML = 'Options';

        optionsContainer.appendChild(optionsHeader);

        for (let sliderValue of sliders) {
            optionsContainer.appendChild(new Slider({
                ...sliderValue,
                defaultValue: this.model.getOption(sliderValue.type),
                changeHandler: (value: string) => this.controller.setOption(sliderValue.type, value)
            }).render());
        }

        optionsContainer.appendChild(new Checkbox({
            label: 'Integers',
            defualtValue: this.model.getOption('ints') === 'true',
            onClick: (value: boolean) => this.controller.setOption('ints', `${value}`)
        }).render());

        return optionsContainer;
    }

    /**
     * Handles a keypress
     *
     * @param e The keyboard event
     */
    private inputChar(e: KeyboardEvent): void {
        this.controller.parseChar(e);
    }

    /**
     * Handles a question button click
     *
     * @param type The type of question
     */
    private handleNewQuestion(type: string): void {
        this.controller.getQuestion(type);
        this.ansElemContainer.focus();
    }

    /**
     * Handles a change of focus area
     *
     * @param i The index of the new focus area
     */
    private handleFocusChange(i: number): void {
        this.controller.changeFocus(i);
    }
}
