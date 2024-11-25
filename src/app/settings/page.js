'use client'

import USidebar from "@/app/_components/sidebar";
import Prtctr from '@/app/_components/auth/protector';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader, Link,
    Modal, ModalBody,
    ModalContent, ModalFooter,
    ModalHeader,
    Tab,
    Tabs,
    useDisclosure
} from '@nextui-org/react';
import { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import Info from '@/app/settings/info';
import { UserConsumer } from '@/app/_components/auth/context';
import Password from '@/app/settings/password';
import Delete from "@/app/settings/delete";

export default function Settings() {
    const comp = useRef();

    gsap.registerPlugin(useGSAP);

    const { contextSafe } = useGSAP({scope: comp});

    const footerRef = useRef();

    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    const pages = {
        main: {
            title: 'Account Information',
            body: (user) => <Info user={user} />
        },
        password: {
            title: 'Change My Password',
            body: (user) => <Password user={user} footer={footerRef} onOpen={onOpen} />,
            modal: {
                title: 'Password Changed Successfully',
                body: <>Your password has been updated successfully</>,
                footer: (onClose) => <Button color={'primary'} onClick={onClose}>Ok</Button>
            }
        },
        delete: {
            title: 'Delete My Account',
            body: (user) => <Delete user={user} footer={footerRef} />
        }
    }

    const [ page, setPage ] = useState('main');
    const [ content, setContent ] = useState(pages.main);

    const changePage = contextSafe((newPage) => {
        setPage(newPage);
        setTimeout(() => setContent(pages[newPage]), 250);
        gsap.timeline().to(["#fade"], {
            opacity: 0,
            duration: 0.25
        }).to(['#fade'], {
            opacity: 1,
            duration: 0.25
        });
    });

    return (
        <USidebar title={'Navigation'} content={
            <Tabs
                isVertical size={'lg'}
                selectedKey={page} onSelectionChange={changePage}
                classNames={{
                    wrapper: 'h-full',
                    base: ['w-full', 'h-full'],
                    tabList: ['w-full', 'h-full', 'flex', 'flex-col', 'justify-center', 'bg-transparent'],
                    tab: ['transition-all', 'bg-default-700', 'bg-opacity-0', 'data-[hover=true]:bg-opacity-100'],
                    cursor: ['bg-default-400', 'transition-colors', 'group-data-[hover=true]:bg-default-500']
                }}
            >
                <Tab key={'main'} title={'Account Info'} />
                <Tab key={'password'} title={'Change Password'} />
                <Tab key={'delete'} title={'Delete Account'} />
            </Tabs>
        }>

            <Prtctr fallback={<div className={'w-full h-full flex flex-col px-12 py-2'}>
                <h1>Account Settings</h1>
                <div className={'w-full grow flex flex-col items-center justify-center'} ref={comp}>
                    <Card className={'bg-default-800 w-full max-w-lg p-8'} id={'fade'}>
                        <Skeleton count={10} />
                    </Card>
                </div>
            </div>}>
                <div className={'w-full h-full flex flex-col px-12 py-2'}>
                    <h1>Account Settings</h1>
                    <div className={'w-full grow flex flex-col items-center justify-center'} ref={comp}>
                        <Card className={'bg-default-800 w-full max-w-xl py-2'} id={'fade'}>
                            <CardHeader className={'px-6'}>
                                <h2>{content.title}</h2>
                            </CardHeader>
                            <CardBody className={'px-6 gap-4 pb-0'}>
                                <UserConsumer>{content.body}</UserConsumer>
                            </CardBody>
                            <CardFooter className={'px-6 justify-center'} ref={footerRef}></CardFooter>
                        </Card>
                    </div>
                </div>
                {content.modal && <Modal isOpen={isOpen} onOpenChange={onOpenChange} classNames={{
                    base: 'bg-default-800'
                }}>
                    <ModalContent>
                        {(onClose) => (
                            <>
                                <ModalHeader className="flex flex-col gap-1">{content.modal.title}</ModalHeader>
                                <ModalBody>{content.modal.body}</ModalBody>
                                <ModalFooter>{content.modal.footer(onClose)}</ModalFooter>
                            </>
                        )}
                    </ModalContent>
                </Modal>}
            </Prtctr>
        </USidebar>
    );
}