import { useNavigate } from "react-router";
import my_password from '../assets/undraw_my-password_iyga 1.png';
import apple from '../assets/Apple Logo.png';
import google from '../assets/flat-color-icons_google.png';
import { set, useForm } from "react-hook-form";
import axios from "axios";
import { ClipLoader } from 'react-spinners';
import { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';


const Login = () => {
    const navigate = useNavigate();

    useEffect(() => {
              AOS.init({ duration: 1000 });
    }, [])

    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        console.log(data);

        setLoading(true); 
        
        try {
            const response = await axios.post(
                'https://examly-project-backend.onrender.com/api/auth/login',
                {
                    email: data.identifier,         
                    password: data.password
                }
            );
    
            const token = response.data.access_token;
            console.log('Login successful, token:', token);
    
            localStorage.setItem('token', token);
            localStorage.removeItem('enrollmentId');
    
            navigate('/cbt');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401) {
                    alert('Incorrect email or password.');
                } else if (error.response.status === 404) {
                    alert('Email not found. Please register first.');
                } else if (error.response.status === 400) {
                    alert('Invalid input. Please check your email and password.');
                } else {
                    console.error('Error Response:', error.response.data);
                    alert(`Login failed: ${error.response.data.message}`);
                }
            } else if (error.request) {
                console.error('No Response:', error.request);
                alert('No response from server. Please try again later.');
            } else {
                console.error('Error:', error.message);
                alert('An unexpected error occurred.');
            }
        } finally {
            setLoading(false); 
        }
    };   


    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-2">
                <ClipLoader color="#01A839" size={50} />
                <p className='Georama text-[#01A839]'>Logging In</p>
            </div>
        );
    }
    
    return ( 
        <div className="login">
            <div className="signup__header text-center px-5 py-16" data-aos="fade-down">
                <h1 className="Geist text-[#01A839] text-3xl font-bold uppercase tracking-wide">LOGIN TO YOUR ACCOUNT</h1>
            </div>

            <div className="login__content md:grid grid-cols-2">
                <div className="login__form" data-aos="fade-down" data-aos-delay="500">
                    <div className='flex justify-center'>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="flex justify-center">
                                <div>
                                    <input type="text" {...register("identifier", { required: "Email or Phonenumber is required"})} className="bg-[#E6E6E6] border border-[#77AA9988] rounded-sm py-3 w-xs md:w-sm my-2 px-5 outline-[#01A839]" placeholder='Email or phone number'/>
                                    {errors.identifier && (
                                        <p className="text-red-500 text-xs">{errors.identifier.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-center">
                                <div>
                                    <input type="password" {...register("password", { required: "Password is required"})} className="bg-[#E6E6E6] border border-[#77AA9988] rounded-sm py-3 w-xs md:w-sm my-2 px-5 outline-[#01A839]" placeholder='Password'/>
                                    {errors.password && (
                                        <p className="text-red-500 text-xs">{errors.password.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex items-center justify-center my-5 px-10">
                                <div className="w-24 h-px bg-[#01A839] opacity-40"></div>
                                <span className="Geist px-4 text-xs md:text-sm text-[#01A839] opacity-40">Or register with</span>
                                <div className="w-24 h-px bg-[#01A839] opacity-40"></div>
                            </div>

                            <div className="login__methods py-2">
                                <div className='flex flex-row justify-center gap-5'>
                                    <button className='bg-[#E6E6E6] p-2 border border-[#E6E6E6] rounded-md hover:cursor-pointer'>
                                        <img src={google} alt="google__logo" className='w-9' />
                                    </button>
                                    <button className='bg-[#E6E6E6] p-2 border border-[#E6E6E6] rounded-md hover:cursor-pointer'>
                                        <img src={apple} alt="apple__logo" className='w-9'/>
                                    </button>
                                </div>

                                <div className='login__button flex justify-center py-5'>
                                    <button type="submit" className="bg-[#01A839] text-white py-4 mt-3 Geist hover:cursor-pointer w-xs md:w-sm uppercase" onClick={() => {
                                    }}>continue</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="login__image flex justify-center py-10 md:py-0" data-aos="fade-down" data-aos-delay="800">
                    <img src={my_password} alt="login__image" className="w-[80%] md:w-[50%]" />
                </div>
            </div>

        </div>

     );
}
 
export default Login;