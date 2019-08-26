import BaseExpr from "../baseExpr";

export default class MultExpr extends BaseExpr {

    public toLatex(cursor?: boolean): string {
        return '\\cdot';
    }

    public extract(): string {
        return '*';
    }
}