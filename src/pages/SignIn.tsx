import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import Header from "@/components/Header";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Sign in attempt:', formData);
    // Handle sign-in logic here
  };

  return (
    <div className="min-h-screen">
      <Header />
      <div className="min-h-screen flex earthster-hero-bg pt-20">
      {/* Left Side - Content */}
      <div className="flex-1 flex flex-col justify-center px-8 lg:px-16">
        <div className="max-w-lg">
          <div className="mb-8">
            <p className="text-primary text-sm font-semibold tracking-wider uppercase mb-4">
              LIFE CYCLE ASSESSMENT AT SCALE
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-8 leading-tight">
              Understand and share footprints in minutes
            </h1>
          </div>

          {/* Feature Columns */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-primary font-semibold text-lg mb-4">CONNECTED</h3>
              <p className="text-foreground text-sm leading-relaxed">
                Real <strong>compatible data</strong> from your suppliers, and{" "}
                <strong>share your own</strong> like you've always wished.
              </p>
            </div>
            
            <div>
              <h3 className="text-primary font-semibold text-lg mb-4">ITERATIVE</h3>
              <p className="text-foreground text-sm leading-relaxed">
                See <strong>results</strong> of your calculation{" "}
                <strong>as you input the data</strong>, so you focus on the most important.
              </p>
            </div>
            
            <div>
              <h3 className="text-primary font-semibold text-lg mb-4">INTUITIVE</h3>
              <p className="text-foreground text-sm leading-relaxed">
                Build your model 10x faster, find data 10x faster, get{" "}
                <strong>results 100x faster.</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="w-full max-w-md flex flex-col justify-center px-8 bg-card/30 backdrop-blur-sm border-l border-border">
        <div className="w-full max-w-sm mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                className="earthster-input"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  className="earthster-input pr-12"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label htmlFor="remember" className="text-sm text-foreground cursor-pointer">
                Remember me
              </label>
            </div>

            <Button 
              type="submit" 
              className="earthster-btn-glow w-full py-3 text-lg font-semibold"
            >
              SIGN IN
            </Button>

            <div className="space-y-3 text-center text-sm">
              <p className="text-foreground">
                Don't have an account?{" "}
                <a href="/register" className="text-primary hover:underline">
                  Register instead
                </a>
              </p>
              
              <p>
                <a href="/forgot-password" className="text-foreground hover:text-primary">
                  Forgot your password?
                </a>
              </p>
              
              <p>
                <a href="/confirmation-instructions" className="text-foreground hover:text-primary">
                  Didn't receive confirmation instructions?
                </a>
              </p>
              
              <p>
                <a href="/unlock-instructions" className="text-foreground hover:text-primary">
                  Didn't receive unlock instructions?
                </a>
              </p>
              
              <p>
                <a href="/" className="text-foreground hover:text-primary">
                  ← Back to start
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignIn;