import { GoogleAuthProvider, sendPasswordResetEmail, signInWithPopup } from 'firebase/auth';
import { useContext, useRef, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../src/assets/Lingo Bingo1.jpg';
import google from '../../src/assets/google.png';
import { AuthContext } from '../provider/AuthProvider';

const Login = () => {
    const { userLogin, setUser, auth } = useContext(AuthContext);
    const googleProvider = new GoogleAuthProvider();
    const [error, setError] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const emailRef = useRef()

    const location = useLocation();
    // console.log(location)
    const navigate = useNavigate();

    const handleSubmit = e => {
        e.preventDefault();
        const form = new FormData(e.target);
        // get form Data
        const email = form.get('email');
        const password = form.get('password');
        // console.log(email, password)

        userLogin(email, password)
            .then(result => {
                const user = result.user;
                setUser(user);
                navigate(location?.state ? location.state : '/');
                alert('Congratulation. you are sign in');
            })
            .catch(err => {
                setError({ ...error, login: err.code });
            });
    };

    const handleGoogleLogin = () => {
        signInWithPopup(auth, googleProvider)
            .then(() => {
                navigate(location?.state ? location.state : '/');
            })
            .catch(err => {
                console.log(err);
            });
        
        alert('Congratulation. you are sign in');
    };

    const handleForgetPassword = () => {
        console.log('Give me email password', emailRef.current.value);
        const email = emailRef.current.value;

        if (!email) {
            console.log('Please provide a valid email address')
        } else {
            sendPasswordResetEmail(auth, email)
                .then(() => {
                alert('Password reset email sent, Please check your email')
            })
        }
    }
    

    return (
        <div className="md:min-h-[calc(100vh-200px)] flex justify-center items-center ">
            <div className="card bg-base-100 w-full max-w-2xl shrink-0 shadow-2xl md:p-8">
                <div className=" flex justify-center">
                    <img className="w-32 rounded-xl shadow-xl border p-1" src={logo} alt="" />
                </div>
                <h2 className="text-3xl font-semibold text-center pt-6">Login your account</h2>
                <form onSubmit={handleSubmit} className="card-body">
                    <div className="form-control">
                        <label className="label">
                            <span className="label-text">Email</span>
                        </label>
                        <input type="email" name="email" ref={emailRef} placeholder="Enter your email" className="input input-bordered bg-[#F3F3F3]" required />
                    </div>

                    <div className="form-control relative">
                        <label className="label">
                            <span className="label-text">Password</span>
                        </label>

                        <input type={showPassword ? 'text' : 'password'} name="password" placeholder="Enter your password" className="input input-bordered bg-[#F3F3F3]" required />
                        <button onClick={() => setShowPassword(!showPassword)} className="btn btn-xs absolute right-3 text-lg top-12">
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </button>

                        {error.login && <label className="label text-red-600 text-sm">{error.login}</label>}

                        <label onClick={handleForgetPassword} className="label">
                            <Link to="#" className="label-text-alt link link-hover">
                                Forgot password?
                            </Link>
                        </label>
                    </div>
                    <div className="form-control mt-6">
                        <button className="btn text-white text-base btn-neutral">Login</button>
                    </div>

                    <div className=" form-control mt-6 flex justify-center gap-3">
                        <button onClick={handleGoogleLogin} className="btn text-base btn-neutral ">
                            <img className="w-6 mr-1" src={google} alt="" /> Google Login
                        </button>
                    </div>
                </form>

                <p className="text-center text-gray-500 font-semibold">
                    <span>Don’t Have An Account ? </span>
                    <Link className="text-red-400 link-hover" to="/auth/register">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
