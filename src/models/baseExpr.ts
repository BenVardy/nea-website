import { ISymbolData } from "../types";

/**
 * Acts as the base expression for others to inherit from
 * 
 * Expressions can either be a symbol (ie. x or +) or can be a letter
 * in a keyword (ie. **TODO**)
 */
export default abstract class BaseExpr implements ISymbolData {

    /**
     * Gets the latex representation of the expression
     */
    public abstract toLatex(): string;
    /**
     * Gets the string representation of the expression
     */
    public abstract extract(): string;

}