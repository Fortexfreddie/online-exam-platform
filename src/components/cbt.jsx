import ellipse from '../assets/Ellipse 1.png';
import person from '../assets/person.png';
import { FaRegClock, FaArrowCircleRight, FaArrowCircleLeft, FaCheck } from "react-icons/fa";
import { useState, useEffect } from "react";
import check from '../assets/circle-check-big.png';
import { useNavigate } from "react-router";
import axios from 'axios';
import { ClipLoader } from 'react-spinners';
import AOS from 'aos';
import 'aos/dist/aos.css';

  

const Cbt = () => {
    const navigate = useNavigate();

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courseCode, setCourseCode] = useState('');
    const [duration, setDuration] = useState();
    const [selectedOptions, setSelectedOptions] = useState({});
    const [hasCompletedExam, setHasCompletedExam] = useState(false);
    const [submitting, setSubmitting] = useState(false);


    
    useEffect(() => {
                AOS.init({ duration: 1000 });
        }, [])


    useEffect(() => {
        if (duration === undefined) return; 

        if (duration === 0) {
            completeExam();
            return;
        }
    
        const interval = setInterval(() => {
            setDuration(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    
        return () => clearInterval(interval);
    }, [duration]);

    const minutes = Math.floor((duration ?? 0) / 60);
    const seconds = (duration ?? 0) % 60;


    const formatTime = (num) => (num < 10 ? `0${num}` : num);




    useEffect(() => {
        const initExam = async () => {
            const token = localStorage.getItem('token');
            const examId = 2;
            const enrollmentId = localStorage.getItem('enrollmentId');
    
            if (!token) {
                navigate('/login');
                return;
            }
    
            try {
                let remainingTimeInSeconds = null;


                if (enrollmentId) {
                    console.log('Existing enrollment found:', enrollmentId);
    
                    const statusResponse = await axios.get(`https://examly-project-backend.onrender.com/api/exam-taking/status/${enrollmentId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        }
                    });
    
                    console.log('Fetched status:', statusResponse.data);



                    if (statusResponse.data.enrollment.completed) {
                        console.log('Exam already completed.');
                        setHasCompletedExam(true);
                        setLoading(false);
                        return;
                    }



                    const answers = statusResponse.data.enrollment.answers || [];
    
                    const preSelected = {};
                    answers.forEach(answer => {
                        preSelected[answer.questionId] = answer.response;
                    });
                    setSelectedOptions(preSelected);
    
                    remainingTimeInSeconds = statusResponse.data.remainingTime ?? null;
                    console.log('Remaining time:', remainingTimeInSeconds);

    
                } else {
                    console.log('No existing enrollment. Enrolling new user.');
    
                    const enrollResponse = await axios.post(`https://examly-project-backend.onrender.com/api/exams/${examId}/enroll`, {}, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    });
    
                    const enrollData = enrollResponse.data;
                    const newEnrollmentId = enrollData.id;
                    localStorage.setItem('enrollmentId', newEnrollmentId);
    
                    console.log('User enrolled successfully:', enrollData);




    
                    await axios.post('https://examly-project-backend.onrender.com/api/exam-taking/start', 
                        { enrollmentId: newEnrollmentId }, 
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                                'Content-Type': 'application/json',
                            }
                        }
                    );
    
                    console.log('Exam started successfully.');
                }



    
                const questionsResponse = await axios.get(`https://examly-project-backend.onrender.com/api/exams/${examId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
    
                const data = questionsResponse.data;
                setQuestions(data.questions);
                setCourseCode(data.courseCode);


                if (remainingTimeInSeconds !== null && remainingTimeInSeconds !== undefined) {
                    setDuration(remainingTimeInSeconds);  
                } else {
                    setDuration(data.duration * 60);  
                    // setDuration(1 * 60);  
                }
                  
    
            } catch (error) {
                console.error('Error during initialization:', error.response?.data || error.message);
            } finally {
                setLoading(false);
            }
        };
    
        initExam();
    }, []);
    

    

    const handleOptionChange = async (questionId, selectedOption) => {
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));

    try {
        const token = localStorage.getItem('token');
        const enrollmentId = localStorage.getItem('enrollmentId');

        await axios.post(`https://examly-project-backend.onrender.com/api/exam-taking/submit-answer/${enrollmentId}`, 
            {
                questionId: questionId,
                response: selectedOption
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );
        console.log('Answer submitted successfully!');
    } catch (error) {
        console.error('Error submitting answer:', error.response?.data || error.message);
    }
};


    const completeExam = async () => {
        const token = localStorage.getItem('token');
        const enrollmentId = localStorage.getItem('enrollmentId');
        if (!token || !enrollmentId) {
            navigate('/login');
            return;
        }

        setSubmitting(true);

        try {
            const response = await axios.post(
              `https://examly-project-backend.onrender.com/api/exam-taking/complete/${enrollmentId}`,
              {}, 
              {
                headers: {
                  Authorization: `Bearer ${token}`, 
                },
              }
            );
            console.log('Exam completed successfully:', response.data);
            setShowPopup(true); 

            console.log('Your exam score is:', response.data.score);


            } catch (error) { 
            console.error('Error completing exam:', error);
        } finally {
            setSubmitting(false); 
        }
          
    };



    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-2">
                <ClipLoader color="#01A839" size={50} />
                <p className='Georama text-[#01A839]'>Loading exam</p>
            </div>
        );
    }

    if (submitting) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-2">
                <ClipLoader color="#01A839" size={50} />
                <p className='Georama text-[#01A839]'>Submitting exam</p>
            </div>
        );
    }

    return ( 
        <div className="cbt">
            
            {
                showPopup && (
                    <div className="cbt__backdrop fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <div className="cbt__popup flex bg-gradient-to-r from-white to-[#01A839] p-8 rounded-lg shadow-lg text-center items-center justify-center max-w-xl md:w-[80%] w-[90%]" data-aos="zoom-in">
                            <div className="cbt__image">
                                <img src={check} alt="cbt__image" className="mx-auto w-full"/>
                            </div>
                            <div className="cbt__popup ml-5">
                                <p className="uppercase Georama font-semibold md:text-lg text-xs">Submitted successfully</p>
                                <p className="uppercase Georama font-light md:text-sm text-xs mt-2">kindly check your email to save</p>
                                <div className="cbt__close flex justify-end">
                                    <button className='bg-[#05441a] text-white text-sm Georama py-1 px-3 mt-2 rounded-md hover:cursor-pointer tracking-widest'
                                    onClick={() => {
                                        navigate('/login')
                                    }}
                                    >Go Back</button>
                                </div>
                            </div>
                        </div>               
                    </div>
                )
            }



            {
                hasCompletedExam && (
                    <div className="cbt__backdrop fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                        <div className="cbt__popup flex bg-gradient-to-r from-white to-[#01A839] p-8 rounded-lg shadow-lg text-center items-center justify-center max-w-xl md:w-[80%] w-[90%]" data-aos="zoom-in">
                            <div className="cbt__image">
                                <img src={check} alt="cbt__image" className="mx-auto w-full"/>
                            </div>
                            <div className="cbt__popup ml-5">
                                <p className="uppercase Georama font-semibold md:text-lg text-xs">You have already completed this exam.</p>
                                <p className="uppercase Georama font-light md:text-sm text-xs mt-2">kindly check your email to save</p>
                                <div className="cbt__close flex justify-end">
                                    <button className='bg-[#05441a] text-white text-sm Georama py-1 px-3 mt-2 rounded-md hover:cursor-pointer tracking-widest'
                                    onClick={() => {
                                        navigate('/login')
                                    }}
                                    >Go Back</button>
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

            <div className='px-5 md:px-20 py-10'>
                <div className="cbt__stats md:flex justify-between">
                    <div className="cbt__progress md:flex items-center gap-5">
                        <div className="cbt__course flex md:flex-col justify-center mb-5 md:mb-0">
                            <h2 className='Georama whitespace-nowrap'>{courseCode} Exam</h2>
                        </div>
                        <div className="flex flex-wrap gap-2 max-w-full justify-start">
                            {questions.map((question, id) => (
                                <div key={id} className={`w-5 md:w-10 h-1 md:h-2 ${currentQuestionIndex === id ? "bg-[#01A839]" : "bg-[#D9D9D9]"}`}></div>
                            ))}
                        </div>
                    </div>
                    <div className="cbt__timer flex items-center gap-1 tracking-widest whitespace-nowrap justify-center mt-5 md:mt-0">
                        <FaRegClock size={30} className='text-[#01A839]'/>
                        <h2 className='Georama'>{formatTime(minutes)}:{formatTime(seconds)}</h2>
                    </div>

                </div>

                <div className="cbt__content flex gap-2 md:gap-5 md:px-20 justify-center pt-5">
                        <button className="cbt__previous bg-[#D9D9D9] hover:bg-[#8d8b8b] p-2 max-h-12 rounded-sm hover:cursor-pointer"
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}
                        disabled={currentQuestionIndex === 0}
                        >
                            <FaArrowCircleLeft size={30} />
                        </button>
                        <div className="cbt__questions h-full border border-[#D9D9D9] w-[80%] rounded-sm">
                            <div className="cbt__question p-5">
                                {questions.length > 0 && (
                                    <p className='Geist text-[#45444]'><span className='uppercase mr-2 font-bold'>q{currentQuestionIndex + 1}.</span>{questions[currentQuestionIndex].text}</p>
                                )}
                                <div className="cbt__options md:px-8 py-5 pb-10">
                                    {questions.length > 0 && questions[currentQuestionIndex].options.map((option, id) => (
                                        <div key={id} className="cbt__option flex my-2">
                                            <input type="radio" id="" value={option}
                                            name={`question-${questions[currentQuestionIndex].id}`} checked={selectedOptions[questions[currentQuestionIndex].id] === option}
                                            onChange={() => handleOptionChange(questions[currentQuestionIndex].id, option)} className='mr-1 accent-[#01A839]'/>
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
                        <div className="flex flex-wrap gap-1 max-w-full justify-center md:justify-start">
                            {questions.map((question, id) => (
                                <button key={id} className={`cbt__number flex w-10 h-10 items-center justify-center rounded-sm hover:cursor-pointer 
                                    ${selectedOptions[question.id] ? "bg-[#01A839]" : "bg-[#D9D9D9]"}`}
                                    onClick={() => setCurrentQuestionIndex(id)}>
                                    <p className='text-white Geist text-md font-semibold'>{id + 1}</p>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className='flex items-center justify-end'>
                    <button className='flex items-center bg-[#01A839] py-1 px-3 rounded-md text-center hover:cursor-pointer'
                    onClick={completeExam}
                    >
                        <p className='mr-2 Geist text-white text-sm'>Submit</p>
                        <FaCheck size={13} className='text-white'/>
                    </button>
                </div>
            </div>
        </div>
     );
}
 
export default Cbt;