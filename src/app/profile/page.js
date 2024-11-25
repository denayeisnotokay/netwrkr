'use client'

import USidebar from "@/app/_components/sidebar";
import { Listbox, ListboxItem } from '@nextui-org/react';
import { useState, useMemo, useReducer } from "react";
import { Element, scroller } from "react-scroll";
import { produce } from "immer";
import InfoForm from "@/app/profile/info";
import TargetsForm from "@/app/profile/targets";
import ActivitiesForm from "@/app/profile/activities";
import Prtctr from '@/app/_components/auth/protector';
import Skeleton from "react-loading-skeleton";

const INFO = 1;
const TARGETS = 2;
const ACTIVITIES = 3;

const reducer = (state, action) => {
    switch (action) {
        case INFO:
            state.info = true;
            break;
        case TARGETS:
            state.targets = true;
            break;
        case ACTIVITIES:
            state.activities = true;
            break;
    }
}

export default function Profile() {
    const [ state, dispatch ] = useReducer(produce(reducer), {
        info: false,
        targets: false,
        activities: false
    });

    const [ selectedKeys, setSelectedKeys ] = useState(new Set([1]));

    const selectedValue = useMemo(
        () => parseInt(Array.from(selectedKeys).join("")),
        [selectedKeys]
    );

    const forms = [
        {
            index: INFO,
            title: 'Student Information',
            completed: state.info,
            name: 'info',
            content: <InfoForm
                onComplete={(scroll) => {
                    dispatch(INFO);
                    if (scroll) {
                        scroller.scrollTo(forms[1].name, {
                            duration: 500,
                            delay: 100,
                            smooth: true,
                            containerId: 'main',
                        });
                        setSelectedKeys(new Set([2]));
                    }
                }}
            />
        },
        {
            index: TARGETS,
            title: 'Target Universities',
            completed: state.targets,
            name: 'targets',
            content: <TargetsForm
                onComplete={(scroll) => {
                    dispatch(TARGETS);
                    if (scroll) {
                        scroller.scrollTo(forms[2].name, {
                            duration: 500,
                            delay: 100,
                            smooth: true,
                            containerId: 'main',
                        });
                        setSelectedKeys(new Set([3]));
                    }
                }}
            />
        },
        {
            index: ACTIVITIES,
            title: 'Activities and Honors',
            completed: state.activities,
            name: 'activities',
            content: <ActivitiesForm
                onComplete={(scroll) => dispatch(ACTIVITIES)}
            />
        }
        //TODO: TESTING
    ];

    return (
        <USidebar content={
            <Prtctr fallback={<></>}>
                <Listbox
                    aria-label="Profile Completion"
                    classNames={{
                        base: 'h-full flex flex-col justify-center items-stretch',
                        list: 'gap-12'
                    }}
                    itemClasses={{
                        base: [
                            'px-3', 'gap-8', 'data-[hover=true]:bg-transparent', 'data-[hover=true]:text-foreground/80',
                            'data-[selected=true]:bg-transparent', 'data-[selectable=true]:focus:bg-transparent'
                        ]
                    }}
                    selectionMode={'single'}
                    disallowMultipleSelection
                    disallowEmptySelection
                    selectedKeys={selectedKeys}
                    onSelectionChange={(newKeys) => {
                        setSelectedKeys(newKeys);
                        scroller.scrollTo(forms[parseInt(Array.from(newKeys).join("")) - 1].name, {
                            duration: 500,
                            delay: 100,
                            smooth: true,
                            containerId: 'main',
                        });
                    }}
                    hideSelectedIcon
                    shouldHighlightOnFocus={false}
                    items={forms}
                    variant="flat"
                >
                    {(item) => (
                        <ListboxItem
                            key={item.index}
                            textValue={item.name}
                            startContent={
                                <h2 className={
                                    'flex items-center rounded-full justify-center w-16 h-16 transition-all relative ' +
                                    (selectedValue > item.index ? 'bg-primary after:bg-primary ' : 'after:bg-default-700 ') +
                                    (selectedValue < item.index ? 'bg-default-700 ' : '') +
                                    (item.index === forms.length ? '' : ('after:absolute after:w-2 after:h-20 ' +
                                        'after:inset-x-7 after:top-14 after:-z-10 after:transition-colors '))
                                    + (selectedValue === item.index ? (item.completed ? 'bg-primary shadow-primary ' :
                                        'bg-default-700 shadow-default-700 ') + 'shadow-glow after:bg-default-700' : '')
                                }>
                                    {item.index}
                                </h2>
                            }
                        >
                            <h4 className={'text-wrap transition-colors' + (selectedValue === item.index ? ' font-bold' : '')}>
                                {item.title}
                            </h4>
                        </ListboxItem>
                    )}
                </Listbox>
            </Prtctr>
        }>
            <Prtctr fallback={
                forms.map((form) => (
                    <Element key={form.index} name={form.name} className={'w-full min-h-full px-16 py-8 flex flex-col gap-4'}>
                        {form.index === 1 && <h1>My Profile</h1>}
                        <h2>{form.title}</h2>
                        <Skeleton count={10} className={'w-full max-w-2xl flex flex-col self-center justify-center items-center mx-auto gap-4 !grow'} />
                    </Element>
                ))
            }>
                {
                    forms.map((form) => (
                        <Element key={form.index} name={form.name} onMouseOver={() => setSelectedKeys([form.index])} className={'w-full min-h-full px-16 py-8 flex flex-col gap-4'}>
                            {form.index === 1 && <h1>My Profile</h1>}
                            <h2>{form.title}</h2>
                            {form.content}
                        </Element>
                    ))
                }
            </Prtctr>
        </USidebar>
    );
}