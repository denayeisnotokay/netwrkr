'use client'

import { createPortal } from 'react-dom';
import {Button, Input, Link} from '@nextui-org/react';
import {useCallback, useReducer} from "react";
import {produce} from "immer";
import {BsCheck, BsEye, BsEyeSlash, BsX} from "react-icons/bs";
import {blank, password} from "@/util/validators";
import {reauthenticateWithCredential, updatePassword, EmailAuthProvider} from "firebase/auth";
import { getMessage } from "@/util/firebase";

const SET_OLD_PASSWORD = 0;
const SET_PASSWORD = 1;
const SET_CONFIRM = 2;
const TOGGLE_SHOW = 3;
const CLEAR = 4;
const UPDATE_INVALID = 5;
const SHOW_ERROR = 6;
const CLOSE_ERROR = 7;

const reducer = ( state, action ) => {
    switch (action.type) {
        case SET_OLD_PASSWORD:
            state.oldPassword = action.value;
            state.invalid.oldPassword = blank(action.value);
            break;
        case SET_PASSWORD:
            state.password = action.value;
            state.invalid.password = password(action.value);
            break;
        case SET_CONFIRM:
            state.confirm = action.value;
            state.invalid.confirm = action.value !== state.password;
            break;
        case TOGGLE_SHOW:
            state.show[action.index] = !state.show[action.index];
            break;
        case CLEAR:
            state.oldPassword = '';
            state.password = '';
            state.confirm = '';
            break;
        case UPDATE_INVALID:
            state.invalid = action.value;
            break;
        case SHOW_ERROR:
            state.error.message = action.value;
            state.error.show = true;
            break;
        case CLOSE_ERROR:
            state.error.show = false;
            break;
    }
}

export default function Password({user, footer, onOpen}) {
    const [ state, dispatch ] = useReducer(produce(reducer), {
        oldPassword: '',
        password: '',
        confirm: '',
        show: [false, false, false],
        invalid: {
            oldPassword: false,
            password: {
                length: true,
                upper: true,
                lower: true,
                number: true,
                special: true,
                only: true,
                all: false,
            },
            confirm: false
        },
        error: {
            show: false,
            message: ''
        }
    });

    const handleSubmit = useCallback(() => {
        const invalid = {
            oldPassword: blank(state.oldPassword),
            password: password(state.password),
            confirm: state.confirm !== state.password
        };
        dispatch({type: UPDATE_INVALID, value: invalid});
        if (!invalid.oldPassword && !invalid.password.all && !invalid.confirm) {
            const credential = EmailAuthProvider.credential(user.email, state.oldPassword);
            reauthenticateWithCredential(user, credential).then((userCredential) => {
                const user = userCredential.user;
                updatePassword(user, state.password).then(() => {
                    dispatch({ type: CLEAR });
                    onOpen();
                }).catch((error) => dispatch({ type: SHOW_ERROR, value: getMessage(error.code) }));
            }).catch((error) => dispatch({ type: SHOW_ERROR, value: getMessage(error.code) }));
        }
    }, [user, onOpen, state]);

    const inputClasses = {
        inputWrapper: [
            'bg-default-700', 'data-[hover=true]:bg-default-500',
            'group-data-[focus=true]:bg-default-600'
        ],
        description: ['absolute', 'inset-x-1', 'top-1'],
        errorMessage: ['absolute', 'inset-x-1', 'top-1'],
        helperWrapper: ['p-0 h-0']
    };

    return <form className="flex flex-col items-center gap-6 w-full">
        {state.error.show && <div className="flex flex-row bg-danger-50 text-danger-500 w-full p-4 items-center rounded-xl shadow-md">
            <span className="grow text-left">{state.error.message}</span>
            <Button color="danger" variant="light" className="min-w-0 shrink-0 px-2.5"
                    onClick={() => dispatch({type: CLOSE_ERROR})}>
                <BsX size={18}/>
            </Button>
        </div>}
        <Input
            type={ state.show[0] ? 'text' : 'password' } label="Old Password:" name="password" classNames={inputClasses}
            value={state.oldPassword} isInvalid={state.invalid.oldPassword} errorMessage="Please enter your password."
            onValueChange={(value) => dispatch({ type: SET_OLD_PASSWORD, value })} endContent={
            <Button className="min-w-0 px-2 max-h-full" variant="light" onClick={() => dispatch({
                type: TOGGLE_SHOW,
                index: 0
            })}>
                {state.show[0] ?
                    <BsEyeSlash size={28}/> :
                    <BsEye size={28}/>
                }
            </Button>}
        />
        <Input
            type={ state.show[1] ? 'text' : 'password' } autoComplete="off" label="New Password:" name="password"
            value={state.password} isInvalid={state.invalid.password.all}
            onValueChange={(value) => dispatch({type: SET_PASSWORD, value})}
            errorMessage="Password must meet all criteria below."
            classNames={inputClasses} endContent={
            <Button className="min-w-0 px-2 max-h-full" variant="light" onClick={() => dispatch({
                type: TOGGLE_SHOW,
                index: 1
            })}>
                {state.show[1] ?
                    <BsEyeSlash size={28}/> :
                    <BsEye size={28}/>
                }
            </Button>
        }
        />
        <Input
            type={ state.show[2] ? 'text' : 'password' } autoComplete="off" label="Confirm New Password:" name="confirmPassword"
            errorMessage="Passwords must match." value={state.confirm} isInvalid={state.invalid.confirm}
            onValueChange={(value) => dispatch({type: SET_CONFIRM, value})}
            classNames={inputClasses} endContent={
            <Button className="min-w-0 px-2 max-h-full" variant="light" onClick={() => dispatch({
                type: TOGGLE_SHOW,
                index: 2
            })}>
                {state.show[2] ?
                    <BsEyeSlash size={28}/> :
                    <BsEye size={28}/>
                }
            </Button>
        }
        />
        <small className="w-full text-white">
            Your password must
            <ul>
                <li className={'flex flex-row gap-2 items-center' + (state.invalid.password.length ? ' text-danger' : ' text-success')}>
                    <i>{state.invalid.password.length ? <BsX size={18}/> : <BsCheck size={18}/>}</i>
                    Be at least 12 characters long
                </li>
                <li className={'flex flex-row gap-2 items-center' + (state.invalid.password.upper || state.invalid.password.lower ? ' text-danger' : ' text-success')}>
                    <i>{state.invalid.password.upper || state.invalid.password.lower ? <BsX size={18}/> :
                        <BsCheck size={18}/>}</i>
                    Contain least one uppercase and one lowercase letter
                </li>
                <li className={'flex flex-row gap-2 items-center' + (state.invalid.password.number ? ' text-danger' : ' text-success')}>
                    <i>{state.invalid.password.number ? <BsX size={18}/> : <BsCheck size={18}/>}</i>
                    Contain at least one digit
                </li>
                <li className={'flex flex-row gap-2 items-center' + (state.invalid.password.special ? ' text-danger' : ' text-success')}>
                    <i>{state.invalid.password.special ? <BsX size={18}/> : <BsCheck size={18}/>}</i>
                    Contain at least one special character
                </li>
                <li className={'flex flex-row gap-2 items-center' + (state.invalid.password.only ? ' text-danger' : ' text-success')}>
                    <i>{state.invalid.password.only ? <BsX size={18}/> : <BsCheck size={18}/>}</i>
                    Be made up of only such characters listed above
                </li>
            </ul>
        </small>
        <Link className={'underline'} href={'/recover'}>I don&apos;t remember my old password</Link>
        {createPortal(
            <Button color="primary" variant="ghost" className="w-min data-[hover=true]:opacity-100" onClick={handleSubmit}>Change Password</Button>,
            footer.current
        )}
    </form>
}