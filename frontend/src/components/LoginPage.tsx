import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Clock, Building2 } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/10 rounded-2xl border border-white/20 shadow-2xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
                <Building2 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-white text-3xl mb-2">Bank Clock</h1>
            <p className="text-white/70">Employee Time Management System</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white/90">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@bank.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm focus:bg-white/20"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white/90">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm focus:bg-white/20"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm"
            >
              <Clock className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-white/60 text-sm text-center mb-3">Demo Accounts:</p>
            <div className="space-y-2 text-xs text-white/70">
              <p>👤 User: user@bank.com</p>
              <p>👔 Manager: manager@bank.com</p>
              <p>🏢 Admin: admin@bank.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
