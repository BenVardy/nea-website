import execCalc from '../calculator/execCalc';
import shuntingYard from '../calculator/shuntingYard';
import parseInput from '../parseInput';
import { TCalc } from '../types';

export default async function calculate(input: string): Promise<any> {

    try {
        let calc: TCalc[] = parseInput(input);

        let postFix: TCalc[] = shuntingYard(calc);
        let result: any[] = execCalc(postFix).map(result => {
            return {
                type: result.type,
                data: result.data.toString()
            };
        });

        return result;
    } catch (ex) {
        console.log(ex.message);
        throw ex;
    }
}
