import triviality, { Feature, OptionalRegistries } from 'triviality';
import {
  AnyAction,
  Dispatch,
  Middleware, MiddlewareAPI,
  ReducersMapObject,
} from 'redux';
import { ReduxFeature } from '../ReduxFeature';

it('Can add reducers and middle from other features', async () => {
  const spyMiddleware = jest.fn();

  const TestMiddleware: Middleware<{}> = (_store: MiddlewareAPI<any>) => (next: Dispatch<AnyAction>) => (action: AnyAction) => {
    spyMiddleware(action.type);
    return next(action);
  };

  function testReducer(
    state: string = 'hi',
    action: AnyAction,
  ): string {

    switch (action.type) {
      case 'leaving':
        return 'bye';
    }

    return state;
  }

  class MyFeature implements Feature {

    public registries(): OptionalRegistries<ReduxFeature> {
      return {
        reducers: (): ReducersMapObject<any, any> => {
          return { test: testReducer };
        },
        middleware: (): Middleware[] => {
          return [TestMiddleware];
        },
      };
    }
  }

  const container = await triviality()
    .add(ReduxFeature)
    .add(MyFeature)
    .build();

  const store = container.store();
  expect(store.getState()).toEqual({ test: 'hi' });
  container.store().dispatch({ type: 'leaving' });
  expect(store.getState()).toEqual({ test: 'bye' });
  expect(spyMiddleware).toBeCalledWith('leaving');
});
