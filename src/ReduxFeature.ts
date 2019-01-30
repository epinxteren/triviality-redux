import { Feature } from 'triviality';
import { applyMiddleware, combineReducers, createStore, Middleware, ReducersMapObject, Store } from 'redux';
import { composeWithDevTools, RemoteReduxDevToolsOptions } from 'remote-redux-devtools';

export class ReduxFeature implements Feature {

  public registries() {
    return {
      reducers: (): ReducersMapObject<any, any> => {
        return {};
      },
      middleware: (): Middleware[] => {
        return [];
      },
    };
  }

  public devToolsOptions(): RemoteReduxDevToolsOptions {
    return {};
  }

  public store(): Store<any> {
    const composeEnhancers = composeWithDevTools(this.devToolsOptions());
    const registries = this.registries();
    const enhancer = applyMiddleware(...registries.middleware());
    const reducer = combineReducers(registries.reducers());
    return createStore(
      reducer,
      composeEnhancers(enhancer),
    );
  }

}
