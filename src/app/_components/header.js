'use client'

import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
    Link,
    Button,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenuToggle, Avatar
} from '@nextui-org/react';
import { FiChevronDown } from 'react-icons/fi';
import Image from "next/image";
import { useState } from 'react';
import { auth } from '@/util/firebase';
import { signOut } from 'firebase/auth';

export default function Hdr() {
    return (
        <Navbar isBlurred={false} classNames={{
            base: 'text-lg bg-default-100 h-16 relative',
            wrapper: 'py-2 !max-w-full',
            item: 'transition-colors hover:bg-default-200 data-[active=true]:bg-default-200 h-full rounded-md',
            content: 'h-12 gap-2'
        }}>
            <NavbarContent>
                <NavbarBrand>
                    <Link href="/"><Image src={"/nav.png"} alt={"Netwrkr"} width={144} height={48}/></Link>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent justify="end">
                <Dropdown className={'bg-default-100'}>
                    <NavbarItem className={'grow flex justify-end hover:bg-transparent'}>
                        <DropdownTrigger>
                            <Button
                                color="sky"
                                disableRipple
                                className="bg-transparent !inline-flex !flex-row underline h-full"
                                endContent={<FiChevronDown />}
                                radius="sm"
                                variant="light"
                            >
                                <Avatar name={'A'} />
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                        aria-label="Account Options"
                        itemClasses={{
                            base: 'data-[hover=true]:bg-default-200'
                        }}
                    >
                        <DropdownItem key="settings" href={'/settings'}>Account Settings</DropdownItem>
                        <DropdownItem key="logout" onClick={() => {signOut(auth);}} className={'text-danger'}>Log Out</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
        </Navbar>
    );
}