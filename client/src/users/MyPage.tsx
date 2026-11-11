import { Link } from "react-router-dom";
import { useUser } from "../context/UserContext"
import type { User, UserUpdateForm } from "../types/user";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const MyPageForm = ({user}: {user: User}) => {
  const [form, setForm] = useState<UserUpdateForm>({
    name: user.name,
    email: user.email
  });
  const [error, setError] = useState<string | null>(null);
  const { users, updateUser } = useUser();  //Context API의 사용자 훅 사용
  const navigate = useNavigate();

  // 폼에 입력된 데이터 가져오기
  const { name, email } = form;
  
  // 입력값 변경 핸들러
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const {name, value} = e.target;
      setForm({...form, [name]: value})
  }

  // 폼 제출 핸들러
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();  //기본 동작 막기

      // 유효성 검사
      if(!name.trim()){
          setError("이름을 입력하세요");
          return;
      }
      if(!EMAIL_REGEX.test(email.trim())){
          setError("이메일 형식이 올바르지 않습니다.");
          return;
      }

      // 이메일 중복 확인
      if(users.some(u => u.email === email.trim() && u.id !== user.id)){
        setError("이미 사용 중인 이메일입니다.");
        return;
      }

      // 회원 가입 함수 호출
      try{
          await updateUser({
              name: name.trim(),
              email: email.trim()
          });
          alert("회원 정보가 수정되었습니다.");
          navigate('/'); //로그인 페이지로 이동
      }catch{
          setError("회원 정보가 수정 오류가 발생했습니다.");
      }
  }

  return(
    <div className="sign-up">
      <h2>회원 정보 변경</h2>
      <form onSubmit={handleSubmit}>
        <div>
            <label htmlFor="username">아이디</label>
            {/* 아이디는 바꿀 수 없으므로 readOnly */}
            <input 
                type="text" 
                id="username"
                value={user.username}
                readOnly
            />
        </div>
        <div>
            <label htmlFor="name">이름</label>
            <input 
                type="text" 
                id="name"
                name="name"
                value={name}
                onChange={handleInputChange}
            />
        </div>
        <div>
            <label htmlFor="email">이메일</label>
            <input 
                type="email" 
                id="email"
                name="email"
                value={email}
                onChange={handleInputChange}
            />
        </div>
        {error && <p className="sign-up_error">{error}</p>}
        <button type="submit">저장</button>
      </form>
    </div>
  )
}


const MyPage = () => {
  const { currentUser, isAuthLoading } = useUser();

  if(isAuthLoading){
    return <div>불러오는 중...</div>
  }

  if(!currentUser){
    return (
      <div className="sign-up">
        <p>로그인한 회원만 이용할 수 있습니다.</p>
        <Link to="/signin">로그인</Link>
      </div>
    )
  }

  return<MyPageForm user={currentUser} />
}

export default MyPage;