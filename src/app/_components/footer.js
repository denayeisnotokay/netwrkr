'use client'

import {
    Link,
    Navbar,
    NavbarContent,
    NavbarItem
} from '@nextui-org/react';
import {FiHome, FiMessageCircle, FiUser} from "react-icons/fi";

function Ftr() {
    return (
        <Navbar isBlurred={false} classNames={{
            base: 'text-lg bg-default-100 h-16 relative',
            wrapper: 'py-2 !max-w-full',
            content: 'h-12 gap-2'
        }}>
            <NavbarContent className={'w-full'}>
                <NavbarItem className={'flex items-center p-2 justify-center grow'}>
                    <Link color={"foreground"}><FiUser size={32} /></Link>
                </NavbarItem>
                <NavbarItem className={'flex items-center p-2 justify-center grow'}>
                    <Link color={"foreground"}><FiHome size={32} /></Link>
                </NavbarItem>
                <NavbarItem className={'flex items-center p-2 justify-center grow'}>
                    <Link color={"foreground"}><FiMessageCircle size={32} /></Link>
                </NavbarItem>
            </NavbarContent>
        </Navbar>
    );
}

export default Ftr;
