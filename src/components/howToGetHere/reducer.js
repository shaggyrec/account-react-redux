import {ADD_ITEM} from './constants';

let INIT_VALUES = {newItem: null};

export default function (state = INIT_VALUES, action) {
    let error;
    switch (action.type) {
        case ADD_ITEM:
            return {...state, newItem: action.payload, loading: true}
        default:
            return state
    }
}