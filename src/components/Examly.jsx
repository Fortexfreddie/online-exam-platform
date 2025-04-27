import educator from '../assets/undraw_educator_6dgp (1) 1.png';
import { useNavigate } from "react-router";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from 'react';

const Examly = () => {

    useEffect(() => {
      AOS.init({ duration: 1000 });
    }, []);

    const navigate = useNavigate();

    
    return (  
        <div className="examly min-h-screen flex flex-col justify-between">
        <nav className="examly__navbar flex items-center justify-between px-14 py-6 shadow-sm shadow-bottom" data-aos="fade-down">
          <h1 className="examly__logo Georama text-2xl font-medium opacity-60">Examly.</h1>
          <div className="examly__buttons flex gap-5">
            <button className="examly__signup Geist border border-[#01A839] bg-[#01A839] text-white px-3 py-1 text-sm rounded-md hover:bg-white hover:text-[#01A839] hover:cursor-pointer" onClick={() => {
                navigate('/signup')
            }}>Sign Up</button>
            <button className="examly__login Geist border border-[#01A839] bg-white text-[#01A839] px-3 py-1 text-sm rounded-md hover:bg-[#01A839] hover:text-white hover:cursor-pointer" onClick={() => {
                navigate('/login')
            }}>log In</button>
          </div>
        </nav>
  
        <div className="examly__content flex flex-col md:flex-row justify-between px-12 gap-8 py-16">
          <div className="examly__decription pt-5 text-center md:text-start" data-aos="fade-right">
            <h1 className='examly__title Georama text-5xl font-semibold text-[#01A839]'>Examly.</h1>
            <h2 className='Georama text-5xl font-semibold mt-2'>Your Top Examination Platform</h2>
            <h3 className='Geist text-[#4D3A3A] text-lg mt-4'>The official certification Examinaton platform <br /> for Human-Computer interface.</h3>
            <div className="examly__register mt-3">
              <button className="Geist border border-[#01A839] bg-[#01A839] text-white px-3 py-1 text-sm rounded-md mt-3 hover:bg-white hover:text-[#01A839] hover:cursor-pointer" onClick={() => {
                navigate('/signup')
              }}>Register now</button>
            </div>
          </div>
          <div className="examly__image md:flex justify-center" data-aos="fade-down" data-aos-delay="500">
            <img src={educator} alt="examly__image" className="w-full md:w-[80%]" />
          </div>
        </div>
  
        <div className="examly__stats bg-[#E6E6E6] grid grid-cols-1 md:grid-cols-3 px-5 py-5 text-center">
          <div className="examly__institutions border-b-2 pb-3 md:border-b-0 md:pb-0 md:border-r-2 border-[#BAB7C9]">
            <h2 className='Geist text-2xl font-semibold'>50+</h2>
            <h3 className='Geist text-[#4D3A3A] text-sm'>Institution use Examly</h3>
          </div>
          <div className="examly__users border-b-2 pb-3 md:border-b-0 md:pb-0 md:border-r-2 border-[#BAB7C9]">
            <h2 className='Geist text-2xl font-semibold'>2M</h2>
            <h3 className='Geist text-[#4D3A3A] text-sm'>Users around the world</h3>
          </div>
          <div className="examly__continents">
            <h2 className='Geist text-2xl font-semibold'>7</h2>
            <h3 className='Geist text-[#4D3A3A] text-sm'>Different continent use Examly</h3>
          </div>
        </div>
  
      </div>
  
    );
}
 
export default Examly;