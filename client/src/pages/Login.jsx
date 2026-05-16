import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Shield, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { loginUser } from "../features/auth/authSlice";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth()
  const { user, isLoading, isSuccess, isError, message } = useSelector(state => state.auth)

  
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/auth/myprofile";
  const [userType, setUserType] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const dispatch = useDispatch()

  const handleSubmit = (e) => {
    e.preventDefault();
   dispatch(loginUser(formData))
  };


  useEffect(() => {
    if (isSuccess && user) {
      login(user)
      navigate(redirectPath, { replace: true })
    }

    if (isError && message) {
      toast.error(message, { position: "top-center" })
    }
  }, [isError, isSuccess, login, message, navigate, redirectPath, user])




  if (isLoading) {
    return (
      <Loader/>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 ">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold">
            
            <span className="text-primary text-cyan-500">Edu</span>
            <span className="text-secondary">Verse 🌍</span>
          </h1>
          <p className="mt-2 text-muted-foreground text-4xl font-black mb-2">Welcome! Back Stud👋</p>

          <p className="mt-2 text-muted-foreground">Log in to your account</p>
        </div>

        {/* Login Card */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-xl border-gray-300">
          {/* User Type Toggle */}
          {/* <div className="flex gap-2 p-1 bg-muted rounded-xl mb-8">
            <button
              onClick={() => setUserType("student")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-300 ${
                userType === "student"
                  ? "bg-primary text-primary-foreground shadow-neon-purple"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4" />
              Student
            </button>
            <button
              onClick={() => setUserType("admin")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-medium transition-all duration-300 ${
                userType === "admin"
                  ? "bg-secondary text-secondary-foreground shadow-neon-green"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </button>
          </div> */}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@college.edu"
                  className="w-full pl-12 pr-4 py-4 bg-input border border-border border-gray-300 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className=" absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-4 bg-input border border-border border-gray-300  rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:text-primary/80 transition-colors">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`bg-cyan-300 hover:bg-cyan-500 w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:scale-105 ${
                userType === "student"
                  ? "bg-primary text-primary-foreground hover:shadow-neon-purple"
                  : "bg-secondary text-secondary-foreground hover:shadow-neon-green"
              }`}
            >
              Log In as {userType === "student" ? "Student" : "Admin"}
            </button>
          </form>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/register" className="text-accent hover:text-accent/80 font-medium transition-colors underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
