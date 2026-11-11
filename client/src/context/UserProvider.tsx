import { useEffect, useState } from "react";
import { UserContext } from "./UserContext";
import type { User, NewUser, LoginForm, UserUpdateForm } from "../types/user";
import { 
    getUsers, 
    requestLogin, 
    createUser, 
    getMe,
    modifyUser,
    requestLogout
 } from "../api/users";

const UserProvider = ({children}: {children: React.ReactNode}) => {
    const [users, setUsers] = useState<User[]>([]); //빈 배열
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [ isAuthLoading, setIsAuthLoading ] = useState<boolean>(true);

    // 회원 목록 조회
    useEffect(() => {
        getUsers()   //함수 호출
            .then(setUsers)
            .catch(err => console.log("회원목록 조회 오류!", err));
    }, []);

    // 회원가입 함수
    const signup = async ( newUser: NewUser) => {
        await createUser(newUser); // DB 저장
        setUsers(await getUsers()); // 회원 배열에 저장
    }

    // 로그인 함수 - loginForm(username, password)
    const login = async (loginForm: LoginForm) => {
       try{
          const user = await requestLogin(loginForm);
          setCurrentUser(user);  //로그인한 유저를 저장
          return true;
       }catch{
          return false;
       }
    }

    useEffect(() => {
        getMe()
            .then(setCurrentUser)
            .catch(() => setCurrentUser(null))
            .finally(() => setIsAuthLoading(false))
    }, []);

    // 로그아웃 함수
    const logout = async () => {
        await requestLogout();
        setCurrentUser(null);
    }

    // 회원 정보 수정 함수
    const updateUser = async (form: UserUpdateForm) => {
        if(!currentUser) return;
        const updateUser = await modifyUser(currentUser.id, form);
        setCurrentUser(updateUser); //헤더의 이름이 바로 바뀜
        setUsers(await getUsers());
    }

    return(
        <UserContext.Provider value={{ 
            users, 
            currentUser,
            isAuthLoading,
            signup,
            login,
            logout,
            updateUser
         }}>
            {children}
        </UserContext.Provider>
    )
}

export default UserProvider;