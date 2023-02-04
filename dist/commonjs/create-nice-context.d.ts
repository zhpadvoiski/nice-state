import * as React from "react";
export declare const creacteNiceContext: <Store extends {}>(initialState: Store) => {
    StoreProvider: React.FC<{}>;
    useStore: <SelectorOutput>(selector: (store: Store | undefined) => SelectorOutput) => [SelectorOutput, (value: Partial<Store>) => void];
};
