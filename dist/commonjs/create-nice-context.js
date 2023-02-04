"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.creacteNiceContext = void 0;
var React = require("react");
var creacteNiceContext = function (initialState) {
    var defaultValue = {
        get: function () { return undefined; },
        set: function () { return undefined; },
        subscribe: function () { return function () { return undefined; }; },
    };
    var useStoreData = function () {
        var store = React.useRef(initialState);
        var subscribers = React.useRef(new Set());
        var get = React.useCallback(function () { return store.current; }, []);
        var set = React.useCallback(function (value) {
            Object.assign(store.current, value);
            subscribers.current.forEach(function (callback) { return callback(); });
        }, []);
        var subscribe = React.useCallback(function (callback) {
            subscribers.current.add(callback);
            return function () { return subscribers.current.delete(callback); };
        }, []);
        return {
            get: get,
            set: set,
            subscribe: subscribe,
        };
    };
    var StoreContext = React.createContext(defaultValue);
    var StoreProvider = function (_a) {
        var children = _a.children;
        return (React.createElement(StoreContext.Provider, { value: useStoreData() }, children));
    };
    var useStore = function (selector) {
        var store = React.useContext(StoreContext);
        var _a = React.useState(selector(store.get())), state = _a[0], setState = _a[1];
        React.useEffect(function () {
            return store.subscribe(function () { return setState(selector(store.get())); });
        }, []);
        return [state, store.set];
    };
    return {
        StoreProvider: StoreProvider,
        useStore: useStore,
    };
};
exports.creacteNiceContext = creacteNiceContext;
//# sourceMappingURL=create-nice-context.js.map