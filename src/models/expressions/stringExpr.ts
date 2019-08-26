import BaseExpr from "../baseExpr";

export default class StringExpr extends BaseExpr {
    private data: string;

    public constructor(data: string) {
        super();
        this.data = data;
    }

    public toLatex(cursor?: boolean): string {
        return this.data;
    }

    public extract(): string {
        return this.data;
    }
}