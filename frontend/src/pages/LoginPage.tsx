import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, Shield } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import backgr from '../assets/backgr.png';
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
    (async () => {
      const endpoints = ['/api/auth/login', 'http://localhost:5000/api/auth/login'];
      let lastError: any = null;
      for (const url of endpoints) {
        try {
          const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          if (!res.ok) {
            const err = await res.json().catch(() => ({ message: 'Invalid credentials' }));
            lastError = err;
            continue; // try next endpoint
          }
          const data = await res.json();
          const token = data.token;
          if (token) {
            sessionStorage.setItem('authToken', token);
            sessionStorage.setItem('mock-auth-token', token);
            sessionStorage.setItem('user', JSON.stringify(data.user || {}));
            // Clear legacy localStorage to avoid confusion
            localStorage.removeItem('authToken');
            localStorage.removeItem('mock-auth-token');
            localStorage.removeItem('user');
            navigate('/dashboard');
            return;
          }
          lastError = { message: 'Login failed' };
        } catch (err) {
          lastError = err;
          // try next endpoint
        }
      }
      console.error('Login error', lastError);
      setError(lastError?.message || 'Login failed');
      setIsLoading(false);
    })();
  };
  return <div style={{backgroundImage: `url(${backgr})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}} className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="bg-amber-700 p-8 text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Tender Management System</h1>
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
              <p>Super Admin credentials:</p>
              <p>Email: isurusenarath6699@gmail.com | Pass: 123.</p>
            </div>
          </form>
        </div>
      </div>
    </div>;
}