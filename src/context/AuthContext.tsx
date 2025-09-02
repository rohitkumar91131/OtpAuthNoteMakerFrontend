import { createContext, ReactNode, useContext, useState } from "react";

type AuthContextType ={
    isLoginPageInTheWindow : boolean;
    setIsLoginPageInTheWindow : React.Dispatch<React.SetStateAction<boolean>>,
    user : String,
    setUser : React.Dispatch<React.SetStateAction<String>>
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const AuthProvider = ({children } : {children : ReactNode}) =>{
    const [isLoginPageInTheWindow , setIsLoginPageInTheWindow] = useState<boolean>(true);
    const [user , setUser] = useState<String>("")
    return <AuthContext.Provider value={{isLoginPageInTheWindow , setIsLoginPageInTheWindow , user , setUser}}>
        {children}
    </AuthContext.Provider>
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("Auth context error")
    }
    return context
};