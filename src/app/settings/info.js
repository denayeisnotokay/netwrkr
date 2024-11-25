import {Avatar, Button, Chip, Input, Link} from '@nextui-org/react';
import {BsCheck, BsEye, BsEyeSlash, BsPencilSquare, BsX} from 'react-icons/bs';
import {useReducer} from "react";
import {produce} from "immer";
import {blank, email, max100} from "@/util/validators";
import UAvatar from "@/app/_components/avatar";

const TOGGLE_DETAILS = 0;
const TOGGLE_EMAIL = 1;
const SET_NAME = 2;
const SET_EMAIL = 3;
const SET_PASSWORD = 4;
const TOGGLE_SHOW = 5;
const UPDATE_INVALID = 6;

const reducer = (state, action) => {
    switch (action.type) {
        case TOGGLE_DETAILS:
            state.details.show = !state.details.show;
            break;
        case TOGGLE_EMAIL:
            state.email.show = !state.email.show;
            break;
        case SET_NAME:
            state.details.name = action.value;
            state.invalid.name = blank(action.value) || max100(action.value);
            break;
        case SET_EMAIL:
            state.email.email = action.value;
            state.invalid.email = email(action.value);
            break;
        case SET_PASSWORD:
            state.email.password.value = action.value;
            state.invalid.password = blank(action.value);
            break;
        case TOGGLE_SHOW:
            state.email.password.show = !state.email.password.show;
            break;
        case UPDATE_INVALID:
            state.invalid = action.value;
    }
}

export default function Info({user}) {
    const [ state, dispatch ] = useReducer(produce(reducer), {
        details: {
            show: false,
            name: user.displayName,
        },
        email: {
            show: false,
            email: '',
            password: {
                show: false,
                value: ''
            }
        },
        invalid: {
            name: false,
            email: false,
            password: false
        }
    });

    const inputClasses = {
        base: ['grow', 'shrink'],
        inputWrapper: [
            'bg-default-700', 'data-[hover=true]:bg-default-500',
            'group-data-[focus=true]:bg-default-600'
        ],
        description: ['absolute', 'inset-x-1', 'top-1'],
        errorMessage: ['absolute', 'inset-x-1', 'top-1'],
        helperWrapper: ['p-0', 'h-0']
    }

    return <>
        <div className="flex gap-5 items-center mb-4">
            <UAvatar show={state.details.show} src={user.photoURL} />
            {state.details.show ? <Input
                type="text" label="New Display Name:" name="name" classNames={inputClasses}
                value={state.details.name} isInvalid={state.invalid.name} errorMessage="Your display name must between 1 and 100 characters"
                onValueChange={(value) => dispatch({ type: SET_NAME, value })}
            /> : <div className="flex flex-col gap-1 items-start justify-center grow">
                <h4 className={'font-semibold leading-none text-default-600'}>{user.displayName}</h4>
                <h5 className={'tracking-tight text-default-400'}>Student Account</h5>
            </div>}
            <div className={'flex flex-row gap-2'}>
                {state.details.show && <Button color={'success'} variant={'flat'} className={'min-w-0 px-2.5 shrink-0'} onClick={() => {}}>
                    <BsCheck size={22} />
                </Button>}
                <Button color={state.details.show ? 'danger' : 'primary'} variant={'flat'} className={'min-w-0 px-2.5 shrink-0'} onClick={() => dispatch({ type: TOGGLE_DETAILS })}>
                    {state.details.show ? <BsX size={22} /> : <BsPencilSquare size={22} />}
                </Button>
            </div>
        </div>
        <p className={'flex items-center gap-2'}>
            {state.email.show ? <>
                <Input
                    type="text" label="New Email:" name="email" classNames={inputClasses}
                    value={state.email.email} isInvalid={state.invalid.email} errorMessage="Please enter a valid email address."
                    onValueChange={(value) => dispatch({ type: SET_EMAIL, value })}
                />
                <Input
                    type={ state.email.password.show ? 'text' : 'password' } label="Password:" name="password"
                    classNames={inputClasses} endContent={
                    <Button isIconOnly variant="light" onClick={() => dispatch({ type: TOGGLE_SHOW })}>
                        {state.email.password.show ?
                            <BsEyeSlash size={28}/> :
                            <BsEye size={28} />
                        }
                    </Button>
                } value={state.email.password.value} isInvalid={state.invalid.password} errorMessage="Please enter your password."
                    onValueChange={(value) => dispatch({ type: SET_PASSWORD, value })}
                />
            </> : <>
                Email:
                <Link color="primary" href={'mailto:' + user.email}>{user.email}</Link>
                {user.emailVerified ?
                    <Chip color="success" startContent={<BsCheck size={18}/>}
                          className={'bg-opacity-30 text-success text-sm'}>Verified</Chip> :
                    <Chip color="danger" startContent={<BsX size={18}/>}
                          className={'bg-opacity-30 text-danger text-sm'}>Unverified</Chip>
                }
            </>
            }

            <div className={'flex flex-row gap-2'}>
                {state.email.show && <Button color={'success'} variant={'light'} isIconOnly onClick={() => {}}>
                    <BsCheck/>
                </Button>}
                <Button color={state.email.show ? 'danger' : 'default'} variant={'light'} isIconOnly onClick={() => dispatch({type: TOGGLE_EMAIL})}>
                    {state.email.show ? <BsX/> : <BsPencilSquare/>}
                </Button>
            </div>
        </p>
    </>
}