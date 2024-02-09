/* eslint-disable @typescript-eslint/no-unused-vars */
import React, {createContext, useState, useContext, ReactNode} from 'react';

// UserData modeli
type User = {
  birthDate: string;
  fullName: string;
  gender: string;
  kvkkAccepted: boolean;
  phoneNumber: string;
  uniqueID: string;
  img_url: string;
  work_state: any;
  job: any;
  education_grade: any;
  school_info: any;
  skills: any;
  pdf_url: any;
  projects: any;
};

// Başlangıç değeri
const initialUser: User = {
  birthDate: '',
  fullName: '',
  gender: '',
  kvkkAccepted: false,
  phoneNumber: '',
  uniqueID: '',
  img_url: '',
  work_state: null,
  job: null,
  education_grade: null,
  school_info: null,
  skills: null,
  pdf_url: null,
  projects: null,
};

// UserContext oluşturulması
const UserContext = createContext<{
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}>({
  user: initialUser,
  setUser: () => null,
});

// UserContext'i kullanmak için özel bir hook
export const useUser = () => useContext(UserContext);
export const UserProvider: React.FC<{children: ReactNode}> = ({children}) => {
  const [user, setUser] = useState<User>(initialUser);

  return (
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};
