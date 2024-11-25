'use client'

import { auth } from '@/util/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useState } from 'react';
import { UserProvider } from '@/app/_components/auth/context';

export default function InrPtrctr({ fallback, children }) {
    const [ loggedIn, setLoggedIn ] = useState(false);
    const [ currentUser, setUser ] = useState(undefined);

    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    });

    return <UserProvider value={currentUser}>{(loggedIn ? children : fallback)}</UserProvider>;
}