import { Action } from '@ngrx/store';
import { type } from '../utils';

export const MessageActionTypes = {
    SUCCESS: type('Login Successful'),
    FAIL: type('Login Failed'),
};

export class SuccessAction implements Action {
    type = MessageActionTypes.SUCCESS;
    constructor(public payload: any) { }
}

export class FailAction implements Action {
    type = MessageActionTypes.FAIL;
    constructor(public payload: any) { }
}

export type Actions 
    = SuccessAction | FailAction;
