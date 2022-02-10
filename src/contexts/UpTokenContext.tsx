import React, {useState, useContext, createContext} from 'react'

interface IUpTokenContext {
    upToken: string;
    toggleUpToken: (token:string) => void;
}

const defaultState = {
    upToken: "",
    toggleUpToken: () => console.log('toggle')
};
const UpTokenContext = createContext<IUpTokenContext>(defaultState);

export function useUpToken(){
    return useContext(UpTokenContext);
}


export const UpTokenProvider = ({ children }: { children: any }) => {
    const [upToken, setUptoken] = useState('');

    const toggleUpToken = (token:string) => {
        setUptoken(token);
    }

    return (
        <UpTokenContext.Provider value={
            {
                upToken: upToken,
                toggleUpToken: toggleUpToken
            }    
        }>
            {children}
        </UpTokenContext.Provider>
    )
}
// export function upTokenProvider({ children }: { children: JSX.Element }) {
//     const [upToken, setUptoken] = useState('');

//     function toogleUpToken(token:string){
//         setUptoken(token);
//     }

//     return (        
//         <UpTokenContext.Provider value={upToken}>
//             {children}
//         </UpTokenContext.Provider>
//     )
// }