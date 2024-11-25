import {Button, DateInput, Input, Select, SelectItem} from "@nextui-org/react";
import { useContext, useEffect, useReducer } from 'react';
import { produce } from "immer";
import { blank, integer, decimal, underage, invalidgpa, none } from "@/util/validators";
import { parseDate } from "@internationalized/date";
import { UserContext } from '@/app/_components/auth/context';
import { getProfile, postProfile } from '@/util/request';
import {useAppCheck} from "@/app/_components/app-check";

const SET_FIRST_NAME = 0
const SET_LAST_NAME = 1;
const SET_AGE = 2;
const CHANGE_GRADE = 3;
const SET_GRADUATES = 4;
const SET_SCHOOL = 5;
const SET_GPA = 6;
const UPDATE_INVALID = 7;
const LOAD_DATA = 8;

const reducer = (state, action) => {
    switch (action.type) {
        case SET_FIRST_NAME:
            state.name.first = action.value;
            state.invalid.name.first = blank(action.value);
            break;
        case SET_LAST_NAME:
            state.name.last = action.value;
            state.invalid.name.last = blank(action.value);
            break;
        case SET_AGE:
            state.age = action.value;
            state.invalid.age = blank(action.value) || integer(action.value) || underage(action.value);
            break;
        case CHANGE_GRADE:
            state.grade = action.value;
            state.invalid.grade = blank(action.value);
            break;
        case SET_GRADUATES:
            state.graduates = action.value;
            state.invalid.graduates = none(action.value);
            break;
        case SET_SCHOOL:
            state.school = action.value;
            break;
        case SET_GPA:
            state.gpa = action.value;
            state.invalid.gpa = decimal(action.value) || invalidgpa(action.value);
            break;
        case UPDATE_INVALID:
            state.invalid = action.value;
            break;
        case LOAD_DATA:
            state.name = action.value.name;
            state.age = action.value.age;
            state.grade = action.value.grade;
            state.graduates = parseDate(action.value.graduates);
            state.school = action.value.school || '';
            state.gpa = action.value.gpa || '';
            state.invalid = {
                name: {
                    first: false,
                    last: false
                },
                age: false,
                grade: false,
                graduates: false,
                gpa: false
            }
            break;
    }
};

export default function InfoForm({ onComplete }) {
    const [ state, dispatch ] = useReducer(produce(reducer), {
        name: {
            first: '',
            last: ''
        },
        age: '',
        grade: '',
        graduates: null,
        school: '',
        gpa: '',
        invalid: {
            name: {
                first: false,
                last: false
            },
            age: false,
            grade: false,
            graduates: false,
            gpa: false
        }
    });

    const user = useContext(UserContext);
    const getToken = useAppCheck();

    useEffect(() => {
        getProfile(user, 'info', getToken).then((value) => {
            console.log(value);
            if (value) {
                dispatch({type: LOAD_DATA, value});
                onComplete(false);
            }
        })
    }, [user, onComplete, getToken]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const invalid = {
            name: {
                first: blank(state.name.first),
                last: blank(state.name.last)
            },
            age: blank(state.age) || integer(state.age) || underage(state.age),
            grade: blank(state.grade),
            graduates: none(state.graduates),
            gpa: decimal(state.gpa) || invalidgpa(state.gpa)
        }
        dispatch({ type: UPDATE_INVALID, value: invalid });
        if (!invalid.name.first && !invalid.name.last && !invalid.age && !invalid.grade && !invalid.graduates && !invalid.gpa) {
            onComplete(event.nativeEvent.submitter.name === 'continue');
            const sendData = {
                name: state.name,
                age: state.age,
                grade: state.grade,
                graduates: state.graduates.toString(),
                ...(!blank(state.school) && {school: state.school}),
                ...(!blank(state.gpa) && {gpa: state.gpa}),
            }
            postProfile(user, 'info', sendData, getToken).then((response) => console.log(response));
        }
    }

    const inputClasses = {
        inputWrapper: [
            'bg-default-800', 'data-[hover=true]:bg-default-600',
            'group-data-[focus=true]:bg-default-700'
        ],
        description: ['absolute', 'inset-x-1', 'top-1'],
        errorMessage: ['absolute', 'inset-x-1', 'top-1'],
        helperWrapper: ['p-0 h-0']
    };

    return (
        <form className={'w-full max-w-2xl flex flex-col self-center justify-center items-center gap-6 grow'}
              onSubmit={handleSubmit}>
            <div className={'grow justify-center flex flex-col gap-6 w-full'}>
                <div className={'flex flex-col lg:flex-row gap-6'}>
                    <Input
                        isRequired
                        type="text"
                        label="First Name"
                        classNames={inputClasses}
                        value={state.name.first}
                        isInvalid={state.invalid.name.first}
                        errorMessage="Please enter a first name."
                        onValueChange={(value) => dispatch({type: SET_FIRST_NAME, value})}
                    />
                    <Input
                        isRequired
                        type="text"
                        label="Last Name"
                        classNames={inputClasses}
                        value={state.name.last}
                        isInvalid={state.invalid.name.last}
                        errorMessage="Please enter a last name."
                        onValueChange={(value) => dispatch({type: SET_LAST_NAME, value})}
                    />
                </div>
                <Input
                    isRequired
                    type="text"
                    label="Age"
                    classNames={inputClasses}
                    value={state.age}
                    isInvalid={state.invalid.age}
                    errorMessage="Please enter a valid age. You must be 13 or older to use our services."
                    onValueChange={(value) => dispatch({type: SET_AGE, value})}
                />
                <Select
                    isRequired
                    label="Grade"
                    selectedKeys={[state.grade]}
                    isInvalid={state.invalid.grade}
                    errorMessage="Please select a grade."
                    onChange={(event) => dispatch({
                        type: CHANGE_GRADE,
                        value: event.target.value
                    })}
                    listboxProps={{
                        itemClasses: {
                            base: 'data-[hover=true]:!bg-default-600 data-[focus=true]:!bg-default-700 hover:bg-default-600'
                        }
                    }}
                    classNames={{
                        trigger: [
                            'bg-default-800', 'data-[hover=true]:bg-default-600',
                            'group-data-[focus=true]:bg-default-700'
                        ],
                        popoverContent: 'bg-default-800',
                        description: ['absolute', 'inset-x-1', 'top-1'],
                        errorMessage: ['absolute', 'inset-x-1', 'top-1'],
                        helperWrapper: ['p-0 h-0']
                    }}
                >
                    <SelectItem key={'8-'}>8th or below</SelectItem>
                    <SelectItem key={'9'}>9th</SelectItem>
                    <SelectItem key={'10'}>10th</SelectItem>
                    <SelectItem key={'11'}>11th</SelectItem>
                    <SelectItem key={'12'}>12th</SelectItem>
                    <SelectItem key={'>12'}>Graduated high school</SelectItem>
                </Select>
                <DateInput
                    isRequired
                    label="Expected Graduation"
                    errorMessage="Please enter your expected grduation month"
                    value={state.graduates}
                    isInvalid={state.invalid.graduates}
                    onChange={(value) => dispatch({ type: SET_GRADUATES, value })}
                    classNames={{
                        inputWrapper: [
                            'bg-default-800', 'hover:bg-default-600',
                            'focus-within:bg-default-700',
                            'focus-within:hover:bg-default-700'
                        ],
                        description: ['absolute', 'inset-x-1', 'top-1'],
                        errorMessage: ['absolute', 'inset-x-1', 'top-1'],
                        helperWrapper: ['p-0 h-0']
                    }}
                    granularity={'month'}
                />
                <Input
                    type="text"
                    label="Current School"
                    classNames={inputClasses}
                    value={state.school}
                    onValueChange={(value) => dispatch({type: SET_SCHOOL, value})}
                />
                <Input
                    type="text"
                    label="GPA"
                    description="Out of 4.0 unweighted"
                    classNames={inputClasses}
                    value={state.gpa}
                    isInvalid={state.invalid.gpa}
                    errorMessage="Please enter a valid GPA or leave the field blank."
                    onValueChange={(value) => dispatch({type: SET_GPA, value})}
                />
            </div>
            <div
                className={'flex w-full max-w-md flex-col lg:flex-row justify-stretch items-stretch gap-4 lg:gap-6 pt-2 justify-self-end'}>
                <Button type={'submit'} color={'primary'} variant={'solid'} className={'grow w-full lg:w-32'}
                        name={'continue'}>Save & Continue</Button>
                <Button type={'submit'} color={'primary'} variant={'bordered'} className={'grow w-full lg:w-32'}
                        name={'save'}>Save</Button>
            </div>
        </form>
    )
}