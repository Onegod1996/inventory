import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, LogIn } from 'lucide-react';

import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../components/ui/Card';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    
    // Check credentials
    if (username === 'DTH002' && password === '12345') {
      setTimeout(() => {
        setIsLoading(false);
        navigate('/');
      }, 1000);
    } else {
      setIsLoading(false);
      setError('Invalid username or password');
    }
  };
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-neutral-50 p-4">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary-500 shadow-glossy">
          <Package className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-neutral-900">Dronacharya Tech Hub</h1>
        <p className="text-neutral-500">Inventory Management System</p>
      </div>
      
      <Card className="w-full max-w-md shadow-glossy">
        <CardHeader>
          <CardTitle>Sign in to your account</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md bg-error-50 p-3 text-error-600">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                label="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                fullWidth
                placeholder="Enter your username"
                autoComplete="username"
              />
              
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                placeholder="Enter your password"
                autoComplete="current-password"
                rightIcon={
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-500 hover:text-neutral-700"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                }
              />
            </div>
            
            <div className="mt-6">
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                fullWidth
                className="w-full"
                leftIcon={<LogIn size={18} />}
              >
                Sign in
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center border-t border-neutral-200 p-4">
          <p className="text-center text-sm text-neutral-600">
            © 2025 Dronacharya Tech Hub. All rights reserved.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;