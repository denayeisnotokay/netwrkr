'use client'

import { useReducer, useState } from "react";
import { produce } from "immer";
import { Button, Input, Link } from "@nextui-org/react";
import { BsEye, BsEyeSlash, BsX } from 'react-icons/bs';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, getMessage } from "@/util/firebase";
import { useRouter, useSearchParams } from 'next/navigation';
import {postUser} from "@/util/request";
import { blank, email } from '@/util/validators';

const SET_EMAIL = 0;
const SET_PASSWORD = 1;
const UPDATE_INVALID = 2;
const SHOW_ERROR = 3;
const CLOSE_ERROR = 4;

const reducer = ( state, action ) => {
    switch (action.type) {
        case SET_EMAIL:
            state.email = action.value;
            state.invalid.email = email(action.value);
            break;
        case SET_PASSWORD:
            state.password = action.value;
            state.invalid.password = action.value.length === 0;
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

export default function LogIn() {
    const [ state, dispatch ] = useReducer(produce(reducer), {
        email: '',
        password: '',
        invalid: {
            email: false,
            password: false
        },
        error: {
            show: false,
            message: ''
        }
    });

    const [ show, setShow ] = useState(false);

    const router = useRouter();
    const query = useSearchParams();

    const getToken = useAppCheck();

    const handleSubmit = (event) => {
        event.preventDefault();
        const invalid = {
            email: email(state.email),
            password: blank(state.password)
        }
        dispatch({ type: UPDATE_INVALID, value: invalid });
        if (!invalid.email && !invalid.password) {
            signInWithEmailAndPassword(auth, state.email, state.password).then((userCredential) => {
                const user = userCredential.user;
                postUser(user, getToken).then(() => {
                    const params = new URLSearchParams(query);
                    const link = params.get('return');
                    if (link) {
                        router.push(link);
                    } else {
                        router.push('/');
                    }
                });
            }).catch((error) => dispatch({ type: SHOW_ERROR, value: getMessage(error.code) }));
        }
    };

    const inputClasses = {
        inputWrapper: [
            'bg-default-800', 'data-[hover=true]:bg-default-600',
            'group-data-[focus=true]:bg-default-700'
        ],
        description: ['absolute', 'inset-x-1', 'top-1'],
        errorMessage: ['absolute', 'inset-x-1', 'top-1'],
        helperWrapper: ['p-0', 'h-0']
    }

    return <>
        {state.error.show && <div className="flex flex-row bg-danger-50 text-danger-500 w-full p-4 items-center rounded-xl shadow-md mb-4">
            <span className="grow text-left">{state.error.message}</span>
            <Button color="danger" variant="light" className="min-w-0 shrink-0 px-2.5" onClick={() => dispatch({type: CLOSE_ERROR})}>
                <BsX size={18} />
            </Button>
        </div>}
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 pulse-trigger w-full">
            <Input
                type="text" label="Email:" name="email" classNames={inputClasses}
                value={state.email} isInvalid={state.invalid.email} errorMessage="Please enter a valid email address."
                onValueChange={(value) => dispatch({ type: SET_EMAIL, value })}
            />
            <Input
                type={ show ? 'text' : 'password' } label="Password:" name="password"
                classNames={inputClasses} endContent={
                    <Button className="min-w-0 px-2 max-h-full" variant="light" onClick={() => setShow(!show)}>
                        {show ?
                            <BsEyeSlash size={28}/> :
                            <BsEye size={28} />
                        }
                    </Button>
                } value={state.password} isInvalid={state.invalid.password} errorMessage="Please enter your password."
                onValueChange={(value) => dispatch({ type: SET_PASSWORD, value })}
            />
            <div className="flex flex-col gap-2 items-center">
                <div className="flex flex-col items-center">
                    <Link href="http://localhost:3000/login" underline="always">Don&apos;t have an account</Link>
                    <Link href="/recover" underline="always">Forgot password</Link>
                </div>
                <Button type="submit" color="primary" className="w-min data-[hover=true]:opacity-100">Log In</Button>
            </div>
        </form>
    </>;
}