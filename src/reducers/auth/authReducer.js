/**
 * # authReducer.js
 *
 * The reducer for all the actions from the various log states
 */
'use strict';
/**
 * ## Imports
 * The InitialState for auth
 * fieldValidation for validating the fields
 * formValidation for setting the form's valid flag
 */
const InitialState = require('./authInitialState').default;

/**
 * ## Auth actions
 */
const {
    LOGIN_STATE_LOGOUT,
    LOGIN_STATE_REGISTER,
    LOGIN_STATE_LOGIN,
    LOGIN_STATE_FORGOT_PASSWORD,

    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,

    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,

    ON_AUTH_FIELD_CHANGE,
    SIGNUP_REQUEST,
    SIGNUP_SUCCESS,
    SIGNUP_FAILURE,

    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAILURE
} = require('../../lib/constants').default;

const initialState = new InitialState;
/**
 * ## authReducer function
 * @param {Object} state - initialState
 * @param {Object} action - type and payload
 */
export default function authReducer(state = initialState, action) {
    if (!(state instanceof InitialState)) return initialState.mergeDeep(state);
    switch (action.type) {


        /**
         * ### Requests start
         * set the form to fetching and clear any errors
         */
        case SIGNUP_REQUEST:
        case LOGOUT_REQUEST:
        case LOGIN_REQUEST:
        case RESET_PASSWORD_REQUEST:
            let nextState = state.set('isFetching', true);
            return nextState;


        case ON_AUTH_FIELD_CHANGE:
        {
            const {field, value} = action.payload;
            let nextState = state.set(field, value)
                .set('error', null);
            return nextState;
        }

        case LOGIN_SUCCESS:
        {
            let nextState = state
                .set("sessionCookie", action.payload.sessionCookie)
                .set('isFetching', false)
                .set('state', LOGIN_STATE_LOGIN);

            return nextState;
        }

        /**
         * ### Requests end, good or bad
         * Set the fetching flag so the forms will be enabled
         */
        case SIGNUP_SUCCESS:
        case LOGOUT_SUCCESS:
        case RESET_PASSWORD_SUCCESS:
            return state.set('isFetching', false)
              .set("sessionCookie", '');


        /**
         * ### Access to Parse.com denied or failed
         * The fetching is done, but save the error
         * for display to the user
         */
        case SIGNUP_FAILURE:
        case LOGOUT_FAILURE:
        case LOGIN_FAILURE:
        case RESET_PASSWORD_FAILURE:
            return state.set('isFetching', false)
                .set('error', action.payload);


    }
    /**
     * ## Default
     */
    return state;
}
