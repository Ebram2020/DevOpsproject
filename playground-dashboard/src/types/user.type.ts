export interface UserType {
    email:string,
    password: string
}
 
 export interface AuthContextType {
    user: UserType | null;
    login: (user: UserType) => void;
    logout: () => void;
 }
  