import { Button, Input, Switch } from '@nextui-org/react';
import {BsEye, BsEyeSlash, BsX} from "react-icons/bs";
import {useCallback, useReducer, useState} from "react";
import {produce} from "immer";
import {blank} from "@/util/validators";
import {EmailAuthProvider, reauthenticateWithCredential, deleteUser} from "firebase/auth";
import {getMessage} from "@/util/firebase";
import { createPortal } from 'react-dom';
import { removeUser } from '@/util/request';
import { useRouter } from 'next/navigation';
import {useAppCheck} from "@/app/_components/app-check";

const SET_EMAIL = 0;
const SET_PASSWORD = 1;
const SET_CONFIRM = 2;
const UPDATE_INVALID = 3;
const SHOW_ERROR = 4;
const CLOSE_ERROR = 5;

export default function Delete({ user, footer }) {
    const reducer = useCallback(( state, action ) => {
        switch (action.type) {
            case SET_EMAIL:
                state.email = action.value;
                state.invalid.email = action.value !== user.email;
                break;
            case SET_PASSWORD:
                state.password = action.value;
                state.invalid.password = action.value.length === 0;
                break;
            case SET_CONFIRM:
                state.confirm = action.value;
                state.invalid.confirm = !action.value;
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
    }, [user.email])

    const [ state, dispatch ] = useReducer(produce(reducer), {
        email: '',
        password: '',
        confirm: false,
        invalid: {
            email: false,
            password: false,
            confirm: false
        },
        error: {
            show: false,
            message: ''
        }
    });

    const [ show, setShow ] = useState(false);

    const router = useRouter();

    const getToken = useAppCheck();

    const handleSubmit = useCallback(() => {
        const invalid = {
            email: state.email !== user.email,
            password: blank(state.password),
            confirm: !state.confirm
        };
        dispatch({type: UPDATE_INVALID, value: invalid});
        if (!invalid.email && !invalid.password && !invalid.confirm) {
            const credential = EmailAuthProvider.credential(user.email, state.password);
            reauthenticateWithCredential(user, credential).then((userCredential) => {
                const user = userCredential.user;
                removeUser(user).then(() => {
                    deleteUser(user, getToken).then(() => {
                        dispatch({ type: CLEAR });
                        router.push('http://localhost:3000/deleted');
                    }).catch((error) => dispatch({ type: SHOW_ERROR, value: getMessage(error.code) }));
                }).catch((error) => dispatch({ type: SHOW_ERROR, value: getMessage(error.code) }));
            }).catch((error) => dispatch({ type: SHOW_ERROR, value: getMessage(error.code) }));
        }
    }, [user.email, state, getToken]);

    const inputClasses = {
        inputWrapper: [
            'bg-default-700', 'data-[hover=true]:bg-default-500',
            'group-data-[focus=true]:bg-default-600'
        ],
        description: ['absolute', 'inset-x-1', 'top-1'],
        errorMessage: ['absolute', 'inset-x-1', 'top-1'],
        helperWrapper: ['p-0 h-0']
    };

    return <form className="flex flex-col items-center gap-6 pulse-trigger w-full">
        {state.error.show && <div className="flex flex-row bg-danger-50 text-danger-500 w-full p-4 items-center rounded-lg shadow-md mb-4">
            <span className="grow text-left">{state.error.message}</span>
            <Button color="danger" variant="light" className="min-w-0 shrink-0 px-2.5" onClick={() => dispatch({type: CLOSE_ERROR})}>
                <BsX size={18} />
            </Button>
        </div>}
        <Input
            type="text" label="Email:" name="email" classNames={inputClasses}
            value={state.email} isInvalid={state.invalid.email} errorMessage="Please enter the email address associated with your account."
            onValueChange={(value) => dispatch({type: SET_EMAIL, value})}
        />
        <Input
            type={show ? 'text' : 'password'} label="Password:" name="password"
            classNames={inputClasses} endContent={
            <Button className="min-w-0 px-2 max-h-full" variant="light" onClick={() => setShow(!show)}>
                {show ?
                    <BsEyeSlash size={28}/> :
                    <BsEye size={28}/>
                }
            </Button>
        } value={state.password} isInvalid={state.invalid.password} errorMessage="Please enter your password."
            onValueChange={(value) => dispatch({type: SET_PASSWORD, value})}
        />
        <p className={'w-full text-left'}>
            Deleting your account will also permanently delete all of your data, including essays, comments, and profile
            information. This data will not be recoverable. Please confirm this action before continuing.
        </p>
        <div className={'flex flex-col items-center gap-2'}>
            <Switch isSelected={state.confirm} onValueChange={(value) => dispatch({type: SET_CONFIRM, value })}>
                I understand
            </Switch>
            {state.invalid.confirm && <small className={'text-danger'}>You must confirm this action before continuing</small>}
        </div>
        {createPortal(
            <Button color="primary" onClick={handleSubmit}>Delete Account</Button>,
            footer.current
        )}
    </form>;
}