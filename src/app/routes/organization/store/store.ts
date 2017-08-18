/**
 * Created by hasee on 2017/8/13.
 */
import {Action} from '@ngrx/store';

export function routerReducer(state: string = 'admin管理', action: Action) {
  switch (action.type) {
    case 'ROUTE_ADD':
      return action.payload;
    default:
      return state;
  }
}

export function adminReducer(state: Array<Object>, action: Action) {
  switch (action.type) {
    case 'ADMIN_ADD':
      return action.payload;
    default:
      return state;
  }
}
export function configReducer(state: Object, action: Action) {
  switch (action.type) {
    case 'CONFIG':
      return action.payload;
    default:
      return state;
  }
}
export function pathReducer(state: Array<any>, action: Action) {
  switch (action.type) {
    case 'PATH_ADD':
      return action.payload;
    case 'PATH_REMOVE':
      return state.pop();
    default:
      return state;
  }
}export function listReducer(state: Array<any>, action: Action) {
  switch (action.type) {
    case 'LIST_ADD':
      return action.payload;
    default:
      return state;
  }
}export function staffReducer(state: Array<any>, action: Action) {
  switch (action.type) {
    case 'STAFF_ADD':
      return action.payload;
    default:
      return state;
  }
}export function activeReducer(state: string, action: Action) {
  switch (action.type) {
    case 'ACTIVE':
      return action.payload;
    default:
      return state;
  }
}

