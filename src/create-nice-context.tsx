import * as React from "react";

export const creacteNiceContext = <Store extends {}>(initialState: Store) => {
  interface StoreData {
    get: () => Store | undefined;
    set: (value: Partial<Store>) => void;
    subscribe: (callback: () => void) => () => void;
  }

  const defaultValue: StoreData = {
    get: () => undefined,
    set: () => undefined,
    subscribe: () => () => undefined,
  };

  const useStoreData = (): StoreData => {
    const store = React.useRef(initialState);
    const subscribers = React.useRef(new Set<() => void>());

    const get = React.useCallback(() => store.current, []);

    const set = React.useCallback((value) => {
      Object.assign(store.current, value);

      subscribers.current.forEach((callback) => callback());
    }, []);

    const subscribe = React.useCallback((callback) => {
      subscribers.current.add(callback);
      return () => subscribers.current.delete(callback);
    }, []);

    return {
      get,
      set,
      subscribe,
    };
  };

  const StoreContext = React.createContext<StoreData>(defaultValue);

  const StoreProvider: React.FC = React.memo(({ children }) => {
    return (
      <StoreContext.Provider value={useStoreData()}>
        {children}
      </StoreContext.Provider>
    );
  });

  const useStore = <SelectorOutput,>(
    selector: (store: Store | undefined) => SelectorOutput
  ): [SelectorOutput, (value: Partial<Store>) => void] => {
    const store = React.useContext(StoreContext);
    const [state, setState] = React.useState(selector(store.get()));

    React.useEffect(() => {
      return store.subscribe(() => setState(selector(store.get())));
    }, []);

    return [state, store.set];
  };

  return {
    StoreProvider,
    useStore,
  };
};
