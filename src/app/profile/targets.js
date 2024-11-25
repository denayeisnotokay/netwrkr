import {Autocomplete, AutocompleteItem, Button, Input, Select, SelectItem} from "@nextui-org/react";
import { useContext, useEffect, useReducer, useState } from 'react';
import { produce } from "immer";
import { FiX, FiPlus } from "react-icons/fi";
import { blank, empty } from "@/util/validators";
import { UserContext } from '@/app/_components/auth/context';
import {getMajors, getProfile, getUniversities, postProfile} from '@/util/request';
import {useAppCheck} from "@/app/_components/app-check";

const ADD_SAFETY = 0
const REMOVE_SAFETY = 1;
const CHANGE_SAFETY = 2;
const ADD_TARGET = 3;
const REMOVE_TARGET = 4;
const CHANGE_TARGET = 5;
const ADD_REACH = 6;
const REMOVE_REACH = 7;
const CHANGE_REACH = 8;
const CHANGE_EARLY = 9;
const CHANGE_MAJOR = 10;
const UPDATE_INVALID = 11;
const LOAD_DATA = 12;

const reducer = (state, action) => {
    switch (action.type) {
        case ADD_SAFETY:
            state.safeties.push('');
            state.invalid.safeties.push(false);
            break;
        case REMOVE_SAFETY:
            state.safeties.splice(action.index, 1);
            state.invalid.safeties.splice(action.index, 1);
            break;
        case CHANGE_SAFETY:
            state.safeties[action.index] = action.value;
            state.invalid.safeties[action.index] = blank(action.value);
            break;
        case ADD_TARGET:
            state.targets.push('');
            state.invalid.targets.push(false);
            break;
        case REMOVE_TARGET:
            state.targets.splice(action.index, 1);
            state.invalid.targets.splice(action.index, 1);
            break;
        case CHANGE_TARGET:
            state.targets[action.index] = action.value;
            state.invalid.targets[action.index] = blank(action.value);
            break;
        case ADD_REACH:
            state.reaches.push('');
            state.invalid.reaches.push(false);
            break;
        case REMOVE_REACH:
            state.reaches.splice(action.index, 1);
            state.invalid.reaches.splice(action.index, 1);
            break;
        case CHANGE_REACH:
            state.reaches[action.index] = action.value;
            state.invalid.reaches[action.index] = blank(action.value);
            break;
        case CHANGE_EARLY:
            state.early = action.value;
            break;
        case CHANGE_MAJOR:
            state.major = action.value;
            state.invalid.major = blank(action.value);
            break;
        case UPDATE_INVALID:
            state.invalid = action.value;
            break;
        case LOAD_DATA:
            state.major = action.value.major;
            state.early = action.value.early || '';
            state.reaches = action.value.reaches;
            state.safeties = action.value.safeties;
            state.targets = action.value.targets;
            state.invalid = {
                major: false,
                entries: false,
                reaches: Array.from(action.value.reaches, () => false),
                targets: Array.from(action.value.targets, () => false),
                safeties: Array.from(action.value.safeties, () => false),
            }
            break;
    }
};

export default function TargetsForm({ onComplete }) {
    const [universities, setUniversities] = useState([]);
    const [majors, setMajors] = useState([]);

    const [ state, dispatch ] = useReducer(produce(reducer), {
        major: '',
        early: '',
        reaches: [''],
        targets: [''],
        safeties: [''],
        invalid: {
            major: false,
            entries: false,
            reaches: [false],
            targets: [false],
            safeties: [false]
        }
    });

    const user = useContext(UserContext);
    const getToken = useAppCheck();

    useEffect(() => {
        getUniversities(getToken).then(setUniversities);
        getMajors(getToken).then(setMajors);
    }, [getToken])

    useEffect(() => {
        getProfile(user, 'targets', getToken).then((value) => {
            if (value) {
                dispatch({type: LOAD_DATA, value});
                onComplete(false);
            }
        });
    }, [user, onComplete, getToken]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const invalid = {
            major: blank(state.major),
            entries: empty(state.safeties) && empty(state.targets) && empty(state.reaches) && blank(state.early),
            safeties: state.safeties.map(blank),
            targets: state.targets.map(blank),
            reaches: state.reaches.map(blank)
        }
        dispatch({ type: UPDATE_INVALID, value: invalid });
        if (!invalid.major && !invalid.entries && !invalid.safeties.some(b => b) && !invalid.targets.some(b => b) && !invalid.reaches.some(b => b)) {
            onComplete(event.nativeEvent.submitter.name === 'continue');
            const sendData = {
                major: state.major,
                ...(!blank(state.early) && {early: state.early}),
                reaches: state.reaches,
                targets: state.targets,
                safeties: state.safeties
            }
            postProfile(user, 'targets', sendData, getToken).then((response) => console.log(response));
        }
    }

    const listboxProps = {
        itemClasses: {
            base: 'data-[hover=true]:!bg-default-600 data-[focus=true]:!bg-default-700 hover:bg-default-600'
        }
    };

    const selectClasses = {
        base: 'grow',
        trigger: [
            'bg-default-800', 'data-[hover=true]:bg-default-600',
            'group-data-[focus=true]:bg-default-700'
        ],
        popoverContent: 'bg-default-800',
        description: ['absolute', 'inset-x-1', 'top-1'],
        errorMessage: ['absolute', 'inset-x-1', 'top-1'],
        helperWrapper: ['p-0 h-0']
    };

    return (
        <form className={'w-full max-w-6xl flex flex-col self-center justify-center items-center gap-6 grow'}
              onSubmit={handleSubmit}>
            <div className={'grow justify-center flex flex-col gap-6 w-full'}>
                <div className={'justify-stretch items-stretch flex flex-col xl:flex-row gap-8 w-full'}>
                    <div className={'grow flex flex-col gap-6 xl:w-1/3'}>
                        <h3>Intended Major</h3>
                        <Autocomplete
                            placeholder={'Search for a major...'}
                            defaultItems={majors}
                            selectedKey={state.major}
                            isInvalid={state.invalid.major}
                            errorMessage="Please select a major."
                            onSelectionChange={(value) => dispatch({
                                type: CHANGE_MAJOR,
                                value
                            })}
                            listboxProps={listboxProps}
                            classNames={selectClasses}
                            inputProps={{
                                classNames: {
                                    inputWrapper: [
                                        'bg-default-800', 'data-[hover=true]:bg-default-600',
                                        'group-data-[focus=true]:bg-default-700'
                                    ],
                                    description: ['absolute', 'inset-x-1', 'top-1'],
                                    errorMessage: ['absolute', 'inset-x-1', 'top-1'],
                                    helperWrapper: ['p-0 h-0']
                                }
                            }}
                        >
                            {(item) => (<AutocompleteItem key={item._id}>{item.name}</AutocompleteItem>)}
                        </Autocomplete>
                    </div>
                    <div className={'grow flex flex-col gap-6 xl:w-1/3'}>
                        <h3>Early Decision</h3>
                        <Select
                            placeholder={'Select a university...'}
                            selectedKeys={[state.early]}
                            isInvalid={state.invalid.early}
                            onChange={(event) => dispatch({
                                type: CHANGE_EARLY,
                                value: event.target.value
                            })}
                            listboxProps={listboxProps}
                            classNames={selectClasses}
                        >
                            {
                                universities.map((university) => (
                                    <SelectItem key={university._id}>{university.name}</SelectItem>
                                ))
                            }
                        </Select>
                    </div>
                </div>
                <div className={'justify-stretch items-stretch flex flex-col xl:flex-row gap-8 w-full'}>
                    <div className={'grow flex flex-col gap-6 xl:w-1/4'}>
                        <h3>Safeties</h3>
                        {
                            state.safeties.map((safety, i) => (
                                <span key={i} className={'flex flex-row gap-2'}>
                                    <Select
                                        placeholder={'Select a university...'}
                                        selectedKeys={[safety]}
                                        isInvalid={state.invalid.safeties[i]}
                                        errorMessage="Please select a university or remove this slot."
                                        onChange={(event) => dispatch({
                                            type: CHANGE_SAFETY,
                                            index: i,
                                            value: event.target.value
                                        })}
                                        listboxProps={listboxProps}
                                        classNames={selectClasses}
                                    >
                                        {
                                            universities.map((university) => (
                                                <SelectItem key={university._id}>{university.name}</SelectItem>
                                            ))
                                        }
                                    </Select>
                                    <Button color={'danger'} variant={'light'} className={'min-w-0 px-2'} onClick={
                                        () => dispatch({ type: REMOVE_SAFETY, index: i })
                                    }>
                                        <FiX size={28} />
                                    </Button>
                                </span>
                            ))
                        }
                        <Button color={'success'} variant={'flat'} className={'w-min mx-auto'} onClick={
                            () => dispatch({ type: ADD_SAFETY })
                        }><FiPlus size={20} /> Add a University</Button>
                    </div>
                    <div className={'grow flex flex-col gap-6 xl:w-1/4'}>
                        <h3>Targets</h3>
                        {
                            state.targets.map((target, i) => (
                                <span key={i} className={'flex flex-row gap-2'}>
                                    <Select
                                        placeholder={'Select a university...'}
                                        selectedKeys={[target]}
                                        isInvalid={state.invalid.targets[i]}
                                        errorMessage="Please select a university or remove this slot."
                                        onChange={(event) => dispatch({
                                            type: CHANGE_TARGET,
                                            index: i,
                                            value: event.target.value
                                        })}
                                        listboxProps={listboxProps}
                                        classNames={selectClasses}
                                    >
                                        {
                                            universities.map((university) => (
                                                <SelectItem key={university._id}>{university.name}</SelectItem>
                                            ))
                                        }
                                    </Select>
                                    <Button color={'danger'} variant={'light'} className={'min-w-0 px-2'} onClick={
                                        () => dispatch({ type: REMOVE_TARGET, index: i })
                                    }>
                                        <FiX size={28} />
                                    </Button>
                                </span>
                            ))
                        }
                        <Button color={'success'} variant={'flat'} className={'w-min mx-auto'} onClick={
                            () => dispatch({ type: ADD_TARGET })
                        }><FiPlus size={20} /> Add a University</Button>
                    </div>
                    <div className={'grow flex flex-col gap-6 xl:w-1/4'}>
                        <h3>Reaches</h3>
                        {
                            state.reaches.map((reach, i) => (
                                <span key={i} className={'flex flex-row gap-2'}>
                                    <Select
                                        placeholder={'Select a university...'}
                                        selectedKeys={[reach]}
                                        isInvalid={state.invalid.reaches[i]}
                                        errorMessage="Please select a university or remove this slot."
                                        onChange={(event) => dispatch({
                                            type: CHANGE_REACH,
                                            index: i,
                                            value: event.target.value
                                        })}
                                        listboxProps={listboxProps}
                                        classNames={selectClasses}
                                    >
                                        {
                                            universities.map((university) => (
                                                <SelectItem key={university._id}>{university.name}</SelectItem>
                                            ))
                                        }
                                    </Select>
                                    <Button color={'danger'} variant={'light'} className={'min-w-0 px-2'} onClick={
                                        () => dispatch({ type: REMOVE_REACH, index: i })
                                    }>
                                        <FiX size={28} />
                                    </Button>
                                </span>
                            ))
                        }
                        <Button color={'success'} variant={'flat'} className={'w-min mx-auto'} onClick={
                            () => dispatch({ type: ADD_REACH })
                        }><FiPlus size={20} /> Add a University</Button>
                    </div>
                </div>
                {state.invalid.entries ? <small className={'text-danger text-center'}>Please add at least one University in any category</small> : <></>}
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