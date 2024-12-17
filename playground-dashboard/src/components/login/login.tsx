import React, { useState } from "react";
import { UserType } from "../../types/user.type";
import Input from "./input.comp";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAdmin } from "../../context/adminContext";


const Login: React.FC = () => {

    const [adminLoginData, setUserData] = useState({ email: '', password: '' });
    const [errors, setErrors] = useState<UserType>({ email: '', password: '' });
    const navigate = useNavigate();
    const { setAdmin } = useAdmin();

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setUserData(prevState => ({ ...prevState, [name]: value }))
        validateField(name, value);
    }
   
    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    
      // Validate form fields
      if (!adminLoginData.email || !adminLoginData.password || errors.email || errors.password) {
        return; // Stop submission if there are errors
      }
    
      try {
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/Admin/Login`, adminLoginData);
        
        if (response.status === 200) {
          setAdmin({ username: response.data.userName, wallet: response.data.wallet });
          sessionStorage.setItem('adminEmail', response.data.email)
          toast.success('Login Successfully');
          navigate('/dashboard');
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
         
          if (error.response) {
            if (error.response.status === 404) {
              toast.error('Invalid email or password.');
            } else {
              toast.error(`Error: ${error.response.statusText}`);
            }
          } else if (error.request) {
            toast.error('No response received from server.');
          } else {
            toast.error(`Error: ${error.message}`);
          }
        } else {
          toast.error('An unexpected error occurred.');
        }
      }
    };
    
    const validateField = (name: string, value: string): void => {
        let errMsg = '';
        if (!value) {
            errMsg = `${name.replace(/([A-Z])/g, ' $1').trim()} is required.`;
        } else if (name === 'password' && value.length < 8) {
            errMsg = 'Password must be at least 8 characters long.';
        }
        else if (name === "username") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errMsg = 'Invalid email format.';
            }
        }

        setErrors(prevErrors => ({ ...prevErrors, [name]: errMsg }));
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="rounded px-8 py-6 mt-4 text-left bg-white shadow-lg md:w-1/3 lg:w-1/4">
                
                        <h3 className="text-2xl font-bold text-center">Login</h3>
                        <form onSubmit={handleLogin}>
                            <div className="mt-4">

                                <Input type="text" name="email" label="usernameOrEmail" value={adminLoginData.email} handleOnChange={handleOnChange} error={errors.email} />
                                <Input type="password" name="password" label="password" value={adminLoginData.password} handleOnChange={handleOnChange} error={errors.password} />
                                <div className="flex items-baseline justify-between">
                                    <button type="submit" className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-900">Login</button>
                                </div>
                            </div>
                        </form>

            </div>
        </div>
    )
}


export default Login;