import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Lock, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    // Mock authentication
    setTimeout(() => {
      if (email === 'admin@tec.gov' && password === 'admin123') {
        localStorage.setItem('mock-auth-token', 'valid-token');
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
        setIsLoading(false);
      }
    }, 1000);
  };
  return <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">TEC Admin Portal</h1>
          <p className="text-blue-100 mt-2">Sign in to manage tender records</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                {error}
              </div>}

            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input type="email" placeholder="Email Address" className="pl-10" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <Input type="password" placeholder="Password" className="pl-10" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
            </div>

            <Button type="submit" className="w-full" size="lg" isLoading={isLoading}>
              Sign In
            </Button>

            <div className="text-center text-xs text-slate-400">
              <p>Demo Credentials:</p>
              <p>Email: admin@tec.gov | Pass: admin123</p>
            </div>
          </form>
        </div>
      </div>
    </div>;
}