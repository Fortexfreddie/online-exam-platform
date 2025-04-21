import ellipse from '../assets/Ellipse 1.png';
import person from '../assets/person.png';
import { FaRegClock, FaArrowCircleRight, FaArrowCircleLeft, FaCheck } from "react-icons/fa";
import { useState, useEffect } from "react";
import check from '../assets/circle-check-big.png';
import { useNavigate } from "react-router";
import { questions } from '../data/questions';


  

const Cbt = () => {
    const navigate = useNavigate();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false);

    const [timeLeft, setTimeLeft] = useState(20 * 60);
    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    const formatTime = (num) => (num < 10 ? `0${num}` : num);



    return ( 
        <div className="cbt">
            
            {
                showPopup && (
                    <div className="cbt__backdrop fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="cbt__popup flex bg-gradient-to-r from-white to-[#01A839] p-8 rounded-lg shadow-lg text-center items-center justify-center max-w-xl w-[80%]">
                            <div className="cbt__image">
                                <img src={check} alt="cbt__image" className="mx-auto w-38 h-38"/>
                            </div>
                            <div className="cbt__popup ml-5">
                                <p className="uppercase Georama font-bold md:text-xl text-md">submitted successfully</p>
                                <p className="uppercase Georama font-normal md:text-md text-sm mt-2">kindly check your email to save</p>
                                <div className="cbt__close flex justify-end">
                                    <button className='bg-[#05441a] text-white text-sm Georama py-1 px-3 mt-2 rounded-md hover:cursor-pointer tracking-widest'
                                    onClick={() => {
                                        navigate('/login')
                                    }}
                                    >close</button>
                                </div>
                            </div>
                        </div>               
                    </div>
                )
            }

            <nav className="cbt__navbar flex items-center justify-between px-14 py-4 shadow-sm shadow-bottom">
                <h1 className="cbt__logo Georama text-2xl font-medium opacity-60">Examly.</h1>
                <div className="cbt__image">
                    <img src={person} alt="cbt__image" className="w-10"/>
                </div>
            </nav>

            <div className="cbt__stats flex justify-between px-5 md:px-40 py-10">
                <div className="cbt__progress flex items-center">
                    <div className="cbt__course">
                        <h2 className='Georama mr-5'>CSC 409 Exam</h2>
                    </div>
                    {questions.map((question, id) => (
                        <div key={id} className={`w-5 md:w-10 h-1 md:h-2 ${currentQuestionIndex === id ? "bg-[#01A839]" : "bg-[#D9D9D9]"}  mx-0.5`}></div>
                    ))}
                </div>
                <div className="cbt__timer flex items-center gap-1 tracking-widest">
                    <FaRegClock size={30} className='text-[#01A839]'/>
                    <h2 className='Georama'>{formatTime(minutes)}:{formatTime(seconds)}</h2>
                </div>

            </div>

            <div className="cbt__content flex gap-5 md:px-20 justify-center">
                    <button className="cbt__previous bg-[#D9D9D9] hover:bg-[#8d8b8b] p-2 max-h-12 rounded-sm hover:cursor-pointer"
                    onClick={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}
                    disabled={currentQuestionIndex === 0}
                    >
                        <FaArrowCircleLeft size={30} />
                    </button>
                    <div className="cbt__questions border border-[#D9D9D9] w-[50%] rounded-sm">
                        <div className="cbt__question p-5">
                            {questions.length > 0 && (
                                <p className='Geist text-[#45444]'><span className='uppercase mr-2 font-bold'>q{currentQuestionIndex + 1}.</span>{questions[currentQuestionIndex].question}</p>
                            )}
                            <div className="cbt__options md:px-8 py-5 pb-10">
                                {questions[currentQuestionIndex].options.map((option, id) => (
                                    <div key={id} className="cbt__option flex my-2">
                                        <input type="radio" name="cbt-option" id="" className='mr-1 accent-[#01A839]'/>
                                        <p className='Geist'>{option}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className="cbt__next bg-[#D9D9D9] hover:bg-[#8d8b8b] p-2 max-h-12 rounded-sm hover:cursor-pointer"
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1))}
                    disabled={currentQuestionIndex === questions.length - 1}
                    >
                        <FaArrowCircleRight size={30} />
                    </button>
            </div>

            <div className='flex justify-center py-10'>
                <div className='flex gap-3'>
                    {questions.map((question, id) => (
                        <button key={id} className={`cbt__number flex w-10 h-10 items-center justify-center rounded-sm hover:cursor-pointer 
                            ${id === currentQuestionIndex ? "bg-[#01A839]" : "bg-[#D9D9D9]"}`}
                            onClick={() => setCurrentQuestionIndex(id)}>
                            <p className='text-white Geist text-md font-semibold'>{id + 1}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className='flex items-center justify-end px-10'>
                <button className='flex items-center bg-[#01A839] py-1 px-3 rounded-md text-center hover:cursor-pointer'
                onClick={() => setShowPopup(true)}
                >
                    <p className='mr-2 Geist text-white text-sm'>Submit</p>
                    <FaCheck size={13} className='text-white'/>
                </button>
            </div>
        </div>
     );
}
 
export default Cbt;