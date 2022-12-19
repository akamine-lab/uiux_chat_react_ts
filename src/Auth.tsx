import React, {useState, useEffect, createContext, useCallback, useContext} from 'react';
import * as chatapi from './ChatApi';

const ROOM_NUMBER = 1; // you can change the chat room 

interface UserContextType {
    user?: chatapi.User;
    setUser: (user:chatapi.User) => void;
}

const defaultContext: UserContextType = {
    setUser:()=>{}
}

export const UserContext = createContext<UserContextType>(defaultContext);

const useUserContextProvider = (): UserContextType => {
    const [user, setUserState] = useState<chatapi.User>();
    const setUser = useCallback((user:chatapi.User):void => {
        setUserState(user); 
    },[]);
    return {user, setUser};
}

export const useUserContext = ()=> {
    return useContext(UserContext);
}

interface Props {
    children : React.ReactNode;
}

export function Auth() {
    const ctx = useUserContext();
    const [err, setErr] = useState<string>("");

    useEffect(()=>{
        const do_asynchronous = async ()=>{

            const ret = await chatapi.me();
            if(ret.ok && ret.res) {
                ctx.setUser(ret.res);
            }else {
                if(ret.err)
                    setErr(ret.err);
            }
        };
        do_asynchronous();
            // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    const onlogout = (e: any)=>{
        chatapi.logout();
    }
    return (
        <div>
            {
                ctx.user ? 
                    <p> logging on room No. {ctx.user.room_id} as {ctx.user.name} <button onClick={onlogout}>logout</button></p>
                   :<div> <a href={chatapi.getLoginUrl(ROOM_NUMBER)}>
                        Log in with google account with "@ie.u-ryukyu.ac.jp" 
                        </a>
                        <p>{err}</p>
                   </div>
            }
        </div>
    )
}

export const UserProvider: React.FC<Props> = (props) => {
    const ctx = useUserContextProvider();
    return (
        <UserContext.Provider value={ctx}>
            {props.children}
        </UserContext.Provider>
    )
}