import {
    Button,
    Card,
    CardBody,
    CardHeader, Checkbox,
    CheckboxGroup,
    Input, Radio, RadioGroup,
    Select,
    SelectItem,
    Textarea
} from "@nextui-org/react";
import { useContext, useEffect, useReducer } from 'react';
import { produce } from "immer";
import { FiX, FiPlus, FiArrowUp, FiArrowDown, FiChevronLeft } from "react-icons/fi";
import { blank, empty, max50, max100, max150, integer } from "@/util/validators";
import { UserContext } from '@/app/_components/auth/context';
import { getProfile, postProfile } from '@/util/request';
import {useAppCheck} from "@/app/_components/app-check";

const ADD_ACTIVITY = 0
const REMOVE_ACTIVITY = 1;
const MOVE_ACTIVITY = 2;
const TOGGLE_ACTIVITY_OPEN = 3;
const CHANGE_ACTIVITY_TYPE = 4;
const SET_ACTIVITY_POSITION = 5;
const SET_ACTIVITY_NAME = 6;
const SET_ACTIVITY_DESCRIPTION = 7;
const EDIT_ACTIVITY_GRADES = 8;
const EDIT_ACTIVITY_TIMING = 9;
const SET_ACTIVITY_HOURS = 10;
const SET_ACTIVITY_WEEKS = 11;
const SET_ACTIVITY_INTENT = 12;
const ADD_HONOR = 13;
const REMOVE_HONOR = 14;
const MOVE_HONOR = 15;
const TOGGLE_HONOR_OPEN = 16;
const SET_HONOR_TITLE = 17;
const EDIT_HONOR_GRADES = 18;
const EDIT_HONOR_LEVEL = 19;
const UPDATE_INVALID = 20;
const LOAD_DATA = 21;

const reducer = (state, action) => {
    switch (action.type) {
        case ADD_ACTIVITY:
            state.activities.push({
                type: '',
                position: '',
                name: '',
                description: '',
                grades: [],
                timing: [],
                hours: '',
                weeks: '',
                intent: '',
                open: true
            });
            state.invalid.activities.push({
                type: false,
                position: false,
                name: false,
                description: false,
                grades: false,
                timing: false,
                hours: false,
                weeks: false,
                intent: false
            });
            break;
        case REMOVE_ACTIVITY:
            state.activities.splice(action.index, 1);
            state.invalid.activities.splice(action.index, 1);
            break;
        case MOVE_ACTIVITY:
            const [activity] = state.activities.splice(action.index, 1);
            state.activities.splice(action.value, 0, activity);
            const [activityInvalid] = state.invalid.activities.splice(action.index, 1);
            state.invalid.activities.splice(action.value, 0, activityInvalid);
            break;
        case TOGGLE_ACTIVITY_OPEN:
            state.activities[action.index].open = !state.activities[action.index].open
            break;
        case CHANGE_ACTIVITY_TYPE:
            state.activities[action.index].type = action.value;
            state.invalid.activities[action.index].type = blank(action.value);
            break;
        case SET_ACTIVITY_POSITION:
            state.activities[action.index].position = action.value;
            state.invalid.activities[action.index].position = blank(action.value) || max50(action.value);
            break;
        case SET_ACTIVITY_NAME:
            state.activities[action.index].name = action.value;
            state.invalid.activities[action.index].name = blank(action.value) || max100(action.value);
            break;
        case SET_ACTIVITY_DESCRIPTION:
            state.activities[action.index].description = action.value;
            state.invalid.activities[action.index].description = blank(action.value) || max150(action.value);
            break;
        case EDIT_ACTIVITY_GRADES:
            state.activities[action.index].grades = action.value;
            state.invalid.activities[action.index].grades = empty(action.value);
            break;
        case EDIT_ACTIVITY_TIMING:
            state.activities[action.index].timing = action.value;
            state.invalid.activities[action.index].timing = empty(action.value);
            break;
        case SET_ACTIVITY_HOURS:
            state.activities[action.index].hours = action.value;
            state.invalid.activities[action.index].hours = blank(action.value) || integer(action.value);
            break;
        case SET_ACTIVITY_WEEKS:
            state.activities[action.index].weeks = action.value;
            state.invalid.activities[action.index].weeks = blank(action.value) || integer(action.value);
            break;
        case SET_ACTIVITY_INTENT:
            state.activities[action.index].intent = action.value;
            state.invalid.activities[action.index].intent = blank(action.value);
            break;
        case ADD_HONOR:
            state.honors.push({
                title: '',
                grades: [],
                levels: [],
                open: true
            });
            state.invalid.honors.push({
                title: false,
                grades: false,
                levels: false
            });
            break;
        case REMOVE_HONOR:
            state.honors.splice(action.index, 1);
            state.invalid.honors.splice(action.index, 1);
            break;
        case MOVE_HONOR:
            const [honor] = state.honors.splice(action.index, 1);
            state.honors.splice(action.value, 0, honor);
            const [honorInvalid] = state.invalid.honors.splice(action.index, 1);
            state.invalid.honors.splice(action.value, 0, honorInvalid);
            break;
        case TOGGLE_HONOR_OPEN:
            state.honors[action.index].open = !state.honors[action.index].open
            break;
        case SET_HONOR_TITLE:
            state.honors[action.index].title = action.value;
            state.invalid.honors[action.index].title = blank(action.value) || max100(action.value);
            break;
        case EDIT_HONOR_GRADES:
            state.honors[action.index].grades = action.value;
            state.invalid.honors[action.index].grades = empty(action.value);
            break;
        case EDIT_HONOR_LEVEL:
            state.honors[action.index].levels = action.value;
            state.invalid.honors[action.index].levels = empty(action.value);
            break;
        case UPDATE_INVALID:
            state.invalid = action.value;
            break;
        case LOAD_DATA:
            state.activities = action.value.activities.map((activity) => ({ ...activity, open: true }));
            state.honors = action.value.honors.map((honor) => ({ ...honor, open: true }));
            state.invalid = {
                activities: Array.from(action.value.activities, () => ({
                    type: false,
                    position: false,
                    name: false,
                    description: false,
                    grades: false,
                    timing: false,
                    hours: false,
                    weeks: false,
                    intent: false
                })),
                honors: Array.from(action.value.honors, () => ({
                    title: false,
                    grades: false,
                    levels: false
                }))
            }
            break;
    }
};

export default function ActivitiesForm({ onComplete }) {
    const [ state, dispatch ] = useReducer(produce(reducer), {
        activities: [
            {
                type: '',
                position: '',
                name: '',
                description: '',
                grades: [],
                timing: [],
                hours: '',
                weeks: '',
                intent: '',
                open: true
            }
        ],
        honors: [
            {
                title: '',
                grades: [],
                levels: [],
                open: true
            }
        ],
        invalid: {
            activities: [
                {
                    type: false,
                    position: false,
                    name: false,
                    description: false,
                    grades: false,
                    timing: false,
                    hours: false,
                    weeks: false,
                    intent: false
                }
            ],
            honors: [
                {
                    title: false,
                    grades: false,
                    levels: false
                }
            ]
        }
    });

    const user = useContext(UserContext);
    const getToken = useAppCheck();

    useEffect(() => {
        getProfile(user, 'activities', getToken).then((value) => {
            if (value) {
                dispatch({type: LOAD_DATA, value});
                onComplete(false);
            }
        })
    }, [user, onComplete, getToken]);

    const handleSubmit = (event) => {
        event.preventDefault();
        const invalid = {
            activities: state.activities.map((activity) => ({
                type: blank(activity.type),
                position: blank(activity.position) || max50(activity.position),
                name: max100(activity.name),
                description: blank(activity.description) || max150(activity.description),
                grades: empty(activity.grades),
                timing: empty(activity.timing),
                hours: blank(activity.hours) || integer(activity.hours),
                weeks: blank(activity.weeks) || integer(activity.weeks),
                intent: blank(activity.intent)
            })),
            honors: state.honors.map((honor) => ({
                title: blank(honor.title) || max100(honor.title),
                grades: empty(honor.grades),
                levels: empty(honor.levels)
            }))
        }
        dispatch({ type: UPDATE_INVALID, value: invalid });
        if (state.activities.length > 0 &&
            invalid.activities.every(activity => !Object.values(activity).some(Boolean)) &&
            invalid.honors.every(honor => !Object.values(honor).some(Boolean))) {
            onComplete(event.nativeEvent.submitter.name === 'continue');
            const sendData = {
                activities: state.activities.map((activity) => {
                    const { open, ...rest } = activity;
                    return rest;
                }),
                honors: state.honors.map((honor) => {
                    const { open, ...rest } = honor;
                    return rest;
                })
            }
            postProfile(user, 'activities', sendData, getToken).then((response) => console.log(response));
        }
    }

    const inputClasses = {
        inputWrapper: [
            'bg-default-700', 'data-[hover=true]:bg-default-500',
            'group-data-[focus=true]:bg-default-600'
        ]
    };

    const checkboxClasses = {
        wrapper: [
            'before:border-default-600',
            'group-data-[hover=true]:before:bg-default-700',
            'group-data-[invalid=true]:before:border-danger',
            'group-data-[invalid=true]:group-data-[hover=true]:before:bg-danger-800',
        ]
    };

    const radioClasses = {
        wrapper: [
            'border-default-600',
            'group-data-[hover=true]:bg-default-700',
            'group-data-[invalid=true]:border-danger',
            'group-data-[invalid=true]:group-data-[hover=true]:bg-danger-800',
        ]
    };

    const types = [
        'Academic',
        'Art',
        'Athletics: Club',
        'Athletics: JV/Varsity',
        'Career Oriented',
        'Community Service (Volunteer)',
        'Computer/Technology',
        'Cultural',
        'Dance',
        'Debate/Speech',
        'Environmental',
        'Family Responsibilities',
        'Foreign Exchange',
        'Foreign Language',
        'Internship',
        'Journalism/Publication',
        'Junior R.O.T.C.',
        'LGBT',
        'Music: Instrumental',
        'Music: Vocal',
        'Religious',
        'Robotics',
        'School Spirit',
        'Science/Math',
        'Social Justice',
        'Student Govt./Politics',
        'Theater/Drama',
        'Work (Paid)',
        'Other Club/Activity'
    ];

    return (
        <form className={'w-full max-w-8xl flex flex-col self-center justify-center items-center gap-6 grow'}
              onSubmit={handleSubmit}>
            <div className={'grow justify-center flex flex-col gap-6 w-full'}>
                <div className={'justify-stretch items-stretch flex flex-col lg:flex-row gap-8 w-full'}>
                    <div className={'grow flex flex-col gap-6 lg:w-1/3'}>
                        <h3>Activities</h3>
                        <p>Enter up to 20 activities that you feel represent you best. For activity list reviews, the
                        top 10 activities should be what you are considering putting on your application, with the rest
                        being extras that the reviewer may suggest to replace one of the top 10 entries with.</p>
                        {
                            state.activities.map((activity, i) => (
                                <Card className="w-full bg-default-800" key={i}>
                                    <CardHeader className="justify-between pl-4">
                                        <h4>Activity {'' + (i + 1) + (state.activities[i].open || blank(state.activities[i].type) ? '' : (': ' + state.activities[i].type))}</h4>
                                        <span className="flex flex-row gap-1">
                                            {i === 0 ? <></> :
                                                <Button color={'primary'} variant={'light'} className={'min-w-0 px-1.5'} onClick={
                                                    () => dispatch({ type: MOVE_ACTIVITY, index: i, value: i - 1 })
                                                }>
                                                    <FiArrowUp size={28} />
                                                </Button>
                                            }
                                            {i === state.activities.length - 1 ? <></> :
                                                <Button color={'primary'} variant={'light'} className={'min-w-0 px-1.5'} onClick={
                                                    () => dispatch({ type: MOVE_ACTIVITY, index: i, value: i + 1 })
                                                }>
                                                    <FiArrowDown size={28} />
                                                </Button>
                                            }
                                            <Button color={'danger'} variant={'light'} className={'min-w-0 px-1.5'} onClick={
                                                () => dispatch({ type: REMOVE_ACTIVITY, index: i })
                                            }>
                                                <FiX size={28} />
                                            </Button>
                                            <Button
                                                variant={'light'}
                                                className={'min-w-0 px-1.5 data-[hover=true]:bg-transparent data-[hover=true]:opacity-80'}
                                                onClick={
                                                    () => dispatch({ type: TOGGLE_ACTIVITY_OPEN, index: i })
                                                }
                                            >
                                                <FiChevronLeft size={22} className={
                                                    'transition-transform ' + (state.activities[i].open ? '-rotate-90' : '')
                                                } />
                                            </Button>
                                        </span>
                                    </CardHeader>
                                    {activity.open ?
                                        <CardBody className="px-3 pt-0 pb-3 flex flex-col gap-2">
                                            <Select
                                                isRequired
                                                label="Activity type"
                                                selectedKeys={[activity.type]}
                                                isInvalid={state.invalid.activities[i].type}
                                                errorMessage="You must select an activity type."
                                                onChange={(event) => dispatch({
                                                    type: CHANGE_ACTIVITY_TYPE,
                                                    index: i,
                                                    value: event.target.value
                                                })}
                                                listboxProps={{
                                                    itemClasses: {
                                                        base: 'data-[hover=true]:!bg-default-500 data-[focus=true]:!bg-default-600 hover:bg-default-500'
                                                    }
                                                }}
                                                classNames={{
                                                    trigger: [
                                                        'bg-default-700', 'data-[hover=true]:bg-default-500',
                                                        'group-data-[focus=true]:bg-default-600'
                                                    ],
                                                    popoverContent: 'bg-default-700'
                                                }}
                                            >
                                                {
                                                    types.map((type) => (
                                                        <SelectItem key={type}>{type}</SelectItem>
                                                    ))
                                                }
                                            </Select>
                                            <Input
                                                type="text"
                                                label="Position/Leadership description"
                                                isRequired
                                                classNames={inputClasses}
                                                errorMessage="A description of your position must be entered in 50 character or less."
                                                value={activity.position}
                                                isInvalid={state.invalid.activities[i].position}
                                                onValueChange={(value) => dispatch({
                                                    type: SET_ACTIVITY_POSITION,
                                                    index: i,
                                                    value
                                                })}
                                            />
                                            <Input
                                                type="text"
                                                label="Organization name"
                                                isRequired
                                                classNames={inputClasses}
                                                errorMessage="Organization name must be 100 characters or less, or left blank."
                                                value={activity.name}
                                                isInvalid={state.invalid.activities[i].name}
                                                onValueChange={(value) => dispatch({
                                                    type: SET_ACTIVITY_NAME,
                                                    index: i,
                                                    value
                                                })}
                                            />
                                            <Textarea
                                                isRequired
                                                label="Please describe this activity, including what you accomplished and any recognition you received, etc."
                                                labelPlacement="inside"
                                                classNames={inputClasses}
                                                value={activity.description}
                                                isInvalid={state.invalid.activities[i].description}
                                                errorMessage="Description must be 150 characters or less, and is required."
                                                onValueChange={(value) => dispatch({
                                                    type: SET_ACTIVITY_DESCRIPTION,
                                                    index: i,
                                                    value
                                                })}
                                            />
                                            <CheckboxGroup
                                                isRequired
                                                label="Participation grade levels"
                                                color="primary"
                                                value={activity.grades}
                                                isInvalid={state.invalid.activities[i].grades}
                                                errorMessage="You must select at least one participation grade level."
                                                onValueChange={(value) => dispatch({
                                                    type: EDIT_ACTIVITY_GRADES,
                                                    index: i,
                                                    value
                                                })}
                                                classNames={{
                                                    base: 'px-1 pb-3'
                                                }}
                                            >
                                                <Checkbox value="9" radius="sm" classNames={checkboxClasses}>9th</Checkbox>
                                                <Checkbox value="10" radius="sm" classNames={checkboxClasses}>10th</Checkbox>
                                                <Checkbox value="11" radius="sm" classNames={checkboxClasses}>11th</Checkbox>
                                                <Checkbox value="12" radius="sm" classNames={checkboxClasses}>12th</Checkbox>
                                                <Checkbox value="post" radius="sm" classNames={checkboxClasses}>Post-graduate</Checkbox>
                                            </CheckboxGroup>
                                            <CheckboxGroup
                                                isRequired
                                                label="Timing of participation"
                                                color="primary"
                                                value={activity.timing}
                                                isInvalid={state.invalid.activities[i].timing}
                                                errorMessage="You must select at least one participation timing."
                                                onValueChange={(value) => dispatch({
                                                    type: EDIT_ACTIVITY_TIMING,
                                                    index: i,
                                                    value
                                                })}
                                                classNames={{
                                                    base: 'px-1 pb-3'
                                                }}
                                            >
                                                <Checkbox value="school" radius="sm" classNames={checkboxClasses}>During school year</Checkbox>
                                                <Checkbox value="break" radius="sm" classNames={checkboxClasses}>During school break</Checkbox>
                                                <Checkbox value="all" radius="sm" classNames={checkboxClasses}>All year</Checkbox>
                                            </CheckboxGroup>
                                            <Input
                                                type="text"
                                                label="Hours spent per week"
                                                isRequired
                                                classNames={{
                                                    inputWrapper: [
                                                        'bg-default-700', 'data-[hover=true]:bg-default-500',
                                                        'group-data-[focus=true]:bg-default-600'
                                                    ]
                                                }}
                                                errorMessage="You must enter an integer."
                                                value={activity.hours}
                                                isInvalid={state.invalid.activities[i].hours}
                                                onValueChange={(value) => dispatch({
                                                    type: SET_ACTIVITY_HOURS,
                                                    index: i,
                                                    value
                                                })}
                                            />
                                            <Input
                                                type="text"
                                                label="Weeks spent per year"
                                                isRequired
                                                classNames={{
                                                    inputWrapper: [
                                                        'bg-default-700', 'data-[hover=true]:bg-default-500',
                                                        'group-data-[focus=true]:bg-default-600'
                                                    ]
                                                }}
                                                errorMessage="You must enter an integer."
                                                value={activity.weeks}
                                                isInvalid={state.invalid.activities[i].weeks}
                                                onValueChange={(value) => dispatch({
                                                    type: SET_ACTIVITY_WEEKS,
                                                    index: i,
                                                    value
                                                })}
                                            />
                                            <RadioGroup
                                                isRequired
                                                label="I intend to participate in a similar activity in college"
                                                value={activity.intent}
                                                isInvalid={state.invalid.activities[i].intent}
                                                errorMessage="You must select an option for this field."
                                                onValueChange={(value) => dispatch({
                                                    type: SET_ACTIVITY_INTENT,
                                                    index: i,
                                                    value
                                                })}
                                                classNames={{
                                                    base: 'px-1'
                                                }}
                                            >
                                                <Radio value="1" classNames={radioClasses}>Yes</Radio>
                                                <Radio value="0" classNames={radioClasses}>No</Radio>
                                            </RadioGroup>
                                        </CardBody>
                                        : <></>
                                    }
                                </Card>
                            ))
                        }
                        {
                            state.activities.length >= 20 ? <></> :
                            <Button color={'success'} variant={'flat'} className={'w-min mx-auto'} onClick={
                                () => dispatch({ type: ADD_ACTIVITY })
                            }><FiPlus size={20} /> Add an Activity</Button>
                        }
                        {empty(state.activities) ? <small className={'text-danger'}>Please enter at least one activity.</small> : <></>}
                    </div>
                    <div className={'grow flex flex-col gap-6 lg:w-1/3'}>
                        <h3>Honors</h3>
                        <p>Enter up to 10 honors that you feel represent you best. With the top 5 activities should be
                        what you are considering putting on your application, with the rest being extras that may be
                        worth mentioning.</p>
                        {
                            state.honors.map((honor, i) => (
                                <Card className="w-full bg-default-800" key={i}>
                                    <CardHeader className="justify-between">
                                        <h4>Honor {i + 1}</h4>
                                        <span className="flex flex-row gap-2">
                                            {i === 0 ? <></> :
                                                <Button variant={'light'} className={'min-w-0 px-2'} onClick={
                                                    () => dispatch({ type: MOVE_HONOR, index: i, value: i - 1 })
                                                }>
                                                    <FiArrowUp size={28} />
                                                </Button>
                                            }
                                            {i === state.honors.length - 1 ? <></> :
                                                <Button variant={'light'} className={'min-w-0 px-2'} onClick={
                                                    () => dispatch({ type: MOVE_HONOR, index: i, value: i + 1 })
                                                }>
                                                    <FiArrowDown size={28} />
                                                </Button>
                                            }
                                            <Button color={'danger'} variant={'light'} className={'min-w-0 px-2'} onClick={
                                                () => dispatch({ type: REMOVE_HONOR, index: i })
                                            }>
                                                <FiX size={28} />
                                            </Button>
                                            <Button
                                                variant={'light'}
                                                className={'min-w-0 px-1.5 data-[hover=true]:bg-transparent data-[hover=true]:opacity-80'}
                                                onClick={
                                                    () => dispatch({ type: TOGGLE_HONOR_OPEN, index: i })
                                                }
                                            >
                                                <FiChevronLeft size={22} className={
                                                    'transition-transform ' + (state.honors[i].open ? '-rotate-90' : '')
                                                } />
                                            </Button>
                                        </span>
                                    </CardHeader>
                                    {state.honors[i].open ?
                                        <CardBody className="px-3 py-0 text-small text-default-400">
                                            <Input
                                                type="text"
                                                label="Honor title"
                                                isRequired
                                                classNames={inputClasses}
                                                errorMessage="The title of the honor must be entered in 100 character or less."
                                                value={honor.title}
                                                isInvalid={state.invalid.honors[i].title}
                                                onValueChange={(value) => dispatch({
                                                    type: SET_HONOR_TITLE,
                                                    index: i,
                                                    value
                                                })}
                                            />
                                            <CheckboxGroup
                                                isRequired
                                                label="Grade levels"
                                                color="primary"
                                                value={honor.grades}
                                                isInvalid={state.invalid.honors[i].grades}
                                                errorMessage="You must select at least one participation grade level."
                                                onValueChange={(value) => dispatch({
                                                    type: EDIT_HONOR_GRADES,
                                                    index: i,
                                                    value
                                                })}
                                                className="px-1 pb-2"
                                            >
                                                <Checkbox value="9" radius="sm" classNames={checkboxClasses}>9th</Checkbox>
                                                <Checkbox value="10" radius="sm" classNames={checkboxClasses}>10th</Checkbox>
                                                <Checkbox value="11" radius="sm" classNames={checkboxClasses}>11th</Checkbox>
                                                <Checkbox value="12" radius="sm" classNames={checkboxClasses}>12th</Checkbox>
                                                <Checkbox value="post" radius="sm" classNames={checkboxClasses}>Post-graduate</Checkbox>
                                            </CheckboxGroup>
                                            <CheckboxGroup
                                                isRequired
                                                label="Level(s) of recognition"
                                                color="primary"
                                                value={honor.levels}
                                                isInvalid={state.invalid.honors[i].levels}
                                                errorMessage="You must select at least one level of recognition."
                                                onValueChange={(value) => dispatch({
                                                    type: EDIT_HONOR_LEVEL,
                                                    index: i,
                                                    value
                                                })}
                                                classNames={{
                                                    base: 'px-1 pb-3'
                                                }}
                                            >
                                                <Checkbox value="school" radius="sm" classNames={checkboxClasses}>School</Checkbox>
                                                <Checkbox value="state/region" radius="sm" classNames={checkboxClasses}>State/Regional</Checkbox>
                                                <Checkbox value="national" radius="sm" classNames={checkboxClasses}>National</Checkbox>
                                                <Checkbox value="international" radius="sm" classNames={checkboxClasses}>International</Checkbox>
                                            </CheckboxGroup>
                                        </CardBody>
                                    : <></>}
                                </Card>
                            ))
                        }
                        {
                            state.honors.length >= 10 ? <></> :
                                <Button color={'success'} variant={'flat'} className={'w-min mx-auto'} onClick={
                                    () => dispatch({ type: ADD_HONOR })
                                }><FiPlus size={20} /> Add an Honor</Button>
                        }
                    </div>
                </div>
            </div>
            <Button type={'submit'} color={'primary'} variant={'solid'} className={'w-full max-w-56'}>Save & Complete</Button>
        </form>
    )
}