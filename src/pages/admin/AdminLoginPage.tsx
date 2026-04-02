import React, { useState } from 'react';
import { Lock, ArrowRight } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Input, Button } from '../../components/ui';

const AdminLoginPage: React.FC = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { loginAdmin } = useAdminAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        const success = await loginAdmin(password);
        if (!success) {
            setError('Invalid admin password');
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
                    <h1 className="text-3xl font-black text-text-primary tracking-tighter uppercase mb-2">Admin Portal</h1>
                    <p className="text-text-muted font-bold tracking-widest text-[10px] uppercase">Secure Access Required</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-surface-primary border border-(--border-color) rounded-[32px] p-8 shadow-xl">
                    <div className="space-y-6">
                        <div>
                            <Input
                                type="password"
                                label="Master Password"
                                placeholder="Enter admin password..."
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-surface-secondary!"
                                autoFocus
                            />
                        </div>

                        {error && (
                            <p className="text-red-500 font-bold text-[10px] uppercase tracking-widest text-center animate-in shake">
                                {error}
                            </p>
                        )}

                        <Button
                            type="submit"
                            disabled={isLoading || !password}
                            className="w-full h-14 uppercase tracking-widest text-xs font-black shadow-lg hover:shadow-xl transition-all"
                        >
                            {isLoading ? 'Verifying...' : (
                                <span className="flex items-center justify-center gap-2">
                                    Unlock Dashboard <ArrowRight size={16} />
                                </span>
                            )}
                        </Button>
                    </div>
                </form>

                <p className="text-center mt-8 text-text-muted text-[10px] uppercase font-bold tracking-widest opacity-50">
                    Internal System • DigieLearning
                </p>
            </div>
        </div>
    );
};

export default AdminLoginPage;
