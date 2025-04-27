import { useNavigate } from "react-router";
import educator from '../assets/undraw_educator_6dgp (1) 1 (1).png';
import { FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import { useForm } from "react-hook-form";
import axios from "axios";
import { ClipLoader } from 'react-spinners';
import { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';




const Signup = () => {

    useEffect(() => {
          AOS.init({ duration: 1000 });
    }, []);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,   
        formState: { errors },
    } = useForm();
    

    const onSubmit = async (data) => {
    console.log(JSON.stringify(data));

    setLoading(true);

    try {
        const response = await axios.post('https://examly-project-backend.onrender.com/api/auth/register', data);

        console.log('Registration successful:', response.data);
        navigate('/login');
    } catch (error) {
        if (error.response) {
            if (error.response.status === 500) {
                alert('Email might already be registered. Please login or try another email.');
                navigate('/login');
            } else if (error.response.status === 400) {
                alert('Invalid request. Please check your input.');
            } else {
                console.error('Error Response:', error.response.data);
                alert(`Registration failed: ${error.response.data.message}`);
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
                <p className='Georama text-[#01A839]'>Registering user</p>
            </div>
        );
    }

      
    return ( 
        <div className="signup">
            <div className="signup__header text-center px-5 py-16">
                <h1 className="Geist text-[#01A839] text-3xl font-bold uppercase tracking-wide" data-aos="fade-down">sign up for the examly</h1>
                <h2 className="Geist text-[#01A839] text-sm font-light uppercase pt-3 tracking-wide" data-aos="fade-down" data-aos-delay="300">fill in the information below to access examly</h2>
            </div>

            <div className="signup__content md:grid grid-cols-2">
                <div className="signup__form flex justify-center" data-aos="fade-down" data-aos-delay="500">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="md:grid grid-cols-2 md:gap-16">
                            <div className="py-2">
                                <label htmlFor="" className="block uppercase text-xs Geist tracking-wide">first name</label>
                                <input type="text" {...register("firstName", { required: "First name is required"})} className="bg-[#E6E6E6] border border-[#77AA9988] mt-1 rounded-sm py-0.5 w-xs md:w-auto outline-[#01A839] px-1"/>
                                {errors.firstName && (
                                    <p className="text-red-500 text-xs">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div className="py-2">
                                <label htmlFor="" className="block uppercase text-xs Geist tracking-wide">last name</label>
                                <input type="text" {...register("lastName", { required: "Last name is required" })} className="bg-[#E6E6E6] border border-[#77AA9988] mt-1 rounded-sm py-0.5 w-xs md:w-auto outline-[#01A839] px-1"/>
                                {errors.lastName && (
                                    <p className="text-red-500 text-xs">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>
                        <div className="py-2">
                            <label htmlFor="" className="block uppercase text-xs Geist tracking-wide">email address</label>
                            <div className="flex items-center bg-[#E6E6E6] border border-[#77AA9988] mt-1 rounded-sm py-0.5 w-xs md:w-md pl-2">
                                <FaEnvelope size={15} className="text-[#838282]" />
                                <input type="email" {...register("email", { required: "Email is required",
                                 pattern: {value: /^\S+@\S+$/i, message: "Enter a valid email",},})} className="bg-[#E6E6E6] w-full ml-2 outline-0"/>
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-xs">{errors.email.message}</p>
                            )}
                        </div>
                        {/* <div className="py-2">
                            <label htmlFor="" className="block uppercase text-xs Geist tracking-wide">phone number</label>
                            <div className="flex items-center bg-[#E6E6E6] border border-[#77AA9988] mt-1 rounded-sm py-0.5 w-xs md:w-md pl-2">
                                <FaPhoneAlt size={15} className="text-[#838282]" />
                                <input type="tel" {...register("phone", {required: "Phone number is required"})} className="bg-[#E6E6E6] w-full ml-2 outline-0"/>
                            </div>
                            {errors.phone && (
                                <p className="text-red-500 text-xs">{errors.phone.message}</p>
                            )}
                        </div> */}
                        <div className="py-2">
                            <label htmlFor="" className="block uppercase text-xs Geist tracking-wide">password</label>
                            <input type="password" {...register("password", {required: "Password is required"})} className="bg-[#E6E6E6] border border-[#77AA9988] mt-1 rounded-sm py-0.5 w-xs md:w-md px-1 outline-[#01A839]"/>
                            {errors.password && (
                                <p className="text-red-500 text-xs">{errors.password.message}</p>
                            )}
                            <input type="text" {...register("role")} className="hidden" value={'STUDENT'}/>
                        </div>
                        <button type="submit" className="bg-[#01A839] text-white text-sm py-2 mt-3 Geist hover:cursor-pointer w-xs md:w-md uppercase" onClick={() => {
                        }}>continue</button>
                    </form>
                </div>
                <div className="signup__image flex justify-center my-10 md:my-0" data-aos="fade-down" data-aos-delay="800">
                    <img src={educator} alt="signup__image" className="w-[80%] md:w-[60%]"/>
                </div>
            </div>
        </div>
     );
}
 
export default Signup;