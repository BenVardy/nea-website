import questions from '../questions';
import { IQuestionOptions, TQuestion } from '../types';

export default async function getQuestion(type: string, qTemp: any): Promise<any> {
    if (type === '') return;

    let query: IQuestionOptions = qTemp;

    let question: TQuestion | undefined = questions[type];
    if (question) {
        return new question(query);
    }
}
