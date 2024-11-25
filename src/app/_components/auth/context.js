import { createContext } from 'react';

export const UserContext = createContext(undefined);

export function UserProvider({ value, children }) {
    return <UserContext.Provider value={value}>
        {children}
    </UserContext.Provider>
}

export function UserConsumer({children}) {
    return <UserContext.Consumer>
        {children}
    </UserContext.Consumer>;
}