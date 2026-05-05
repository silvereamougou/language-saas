import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Input, Button } from '../../components/ui';

const AdminLoginPage: React.FC = () => {
    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [secret, setSecret] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { loginAdmin, registerAdmin } = useAdminAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        if (mode === 'login') {
            const result = await loginAdmin(username, password);
            if (!result.success) {
                setError(result.error || 'Invalid credentials');
            }
        } else {
            const result = await registerAdmin(username, password, secret);
            if (result.success) {
                setSuccessMsg('Admin account created! You can now login.');
                setMode('login');
            } else {
                setError(result.error || 'Registration failed');
            }
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-(--bg-primary) p-6 transition-colors duration-300">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="w-16 h-16 bg-(--icon-color) text-(--bg-primary) rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-(--icon-color)/20 rotate-3">
                        <Lock size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-text-primary tracking-tighter uppercase mb-2">
                        {mode === 'login' ? 'Admin Portal' : 'Create Admin'}
                    </h1>
                    <p className="text-text-muted font-bold tracking-widest text-[10px] uppercase">
                        {mode === 'login' ? 'Secure Access Required' : 'Register New Administrator'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-surface-primary border border-(--border-color) rounded-[32px] p-8 shadow-xl">
                    <div className="space-y-6">
                        <div>
                            <Input
                                label="Username"
                                placeholder="Enter admin username..."
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="bg-surface-secondary!"
                                autoFocus
                            />
                        </div>

                        <div>
                            <Input
                                type="password"
                                label="Password"
                                placeholder="Enter password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-surface-secondary!"
                            />
                        </div>

                        {mode === 'register' && (
                            <div>
                                <Input
                                    type="password"
                                    label="Registration Secret"
                                    placeholder="Enter secret key..."
                                    value={secret}
                                    onChange={(e) => setSecret(e.target.value)}
                                    className="bg-surface-secondary!"
                                />
                                <p className="text-[9px] text-text-muted mt-2 px-1 font-medium">Use the secret key defined in your environment variables.</p>
                            </div>
                        )}

                        {error && (
                            <p className="text-red-500 font-bold text-[10px] uppercase tracking-widest text-center animate-in shake">
                                {error}
                            </p>
                        )}

                        {successMsg && (
                            <p className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest text-center">
                                {successMsg}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading || !username || !password || (mode === 'register' && !secret)}
                            className="w-full h-14 uppercase tracking-widest text-xs font-black shadow-lg hover:shadow-xl transition-all"
                        >
                            {isLoading ? 'Processing...' : (
                                <span className="flex items-center justify-center gap-2">
                                    {mode === 'login' ? 'Unlock Dashboard' : 'Register Account'} <ArrowRight size={16} />
                                </span>
                            )}
                        </Button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <button
                        onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccessMsg(''); }}
                        className="text-[10px] text-text-muted hover:text-(--icon-color) font-black uppercase tracking-widest transition-colors"
                    >
                        {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Login'}
                    </button>
                </div>

                <p className="text-center mt-8 text-text-muted text-[10px] uppercase font-bold tracking-widest opacity-50">
                    Internal System • DigieLearning
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
