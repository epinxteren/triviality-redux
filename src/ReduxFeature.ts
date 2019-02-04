import { Feature } from 'triviality';
import { AnyAction, applyMiddleware, combineReducers, createStore, Middleware, ReducersMapObject, Store } from 'redux';
import { composeWithDevTools, EnhancerOptions } from 'redux-devtools-extension';
import { combineEpics, createEpicMiddleware, Epic } from 'redux-observable';

export class ReduxFeature implements Feature {

  public registries() {
    return {
      reducers: (): ReducersMapObject<any, any> => {
        return {};
      },
      middleware: (): Middleware[] => {
        return [this.epicMiddleware()];
      },
      epics: (): Epic[] => {
        return [];
      },
    };
  }

  public setup() {
    // Create store first for epicMiddleware.
    this.store();
    this.epicMiddleware().run(this.rootEpic());
  }

  public devToolsOptions(): EnhancerOptions {
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
  public rootEpic() {
    return combineEpics(
      ...this.registries().epics(),
    );
  }

  public epicMiddleware() {
    return createEpicMiddleware<AnyAction, AnyAction, any, any>();
  }

}
