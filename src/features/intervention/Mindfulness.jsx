import React, { useState, useEffect } from 'react';
import { Droplets, X, Play, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Mindfulness({ isOpen, onClose, onComplete }) {
    const [timeLeft, setTimeLeft] = useState(60);
    const [isActive, setIsActive] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(timeLeft => timeLeft - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            setIsCompleted(true);
            onComplete();
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft, onComplete]);

    const startSession = () => {
        setIsActive(true);
    };

    const resetSession = () => {
        setIsActive(false);
        setTimeLeft(60);
        setIsCompleted(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-stone-400 hover:text-stone-600"
                    >
                        <X size={24} />
                    </button>

                    <div className="text-center space-y-6">
                        <div className="mx-auto w-16 h-16 bg-eco-100 rounded-full flex items-center justify-center text-eco-600">
                            <Droplets size={32} />
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-eco-900">Water Your Forest</h3>
                            <p className="text-stone-600 mt-2">
                                Take a moment to breathe. A 1-minute mindfulness break will restore your digital ecosystem.
                            </p>
                        </div>

                        <div className="relative h-40 flex items-center justify-center">
                            {isCompleted ? (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="text-eco-600 flex flex-col items-center gap-2"
                                >
                                    <CheckCircle size={48} />
                                    <span className="font-bold text-lg">Forest Watered!</span>
                                </motion.div>
                            ) : (
                                <div className="relative flex items-center justify-center">
                                    {/* Breathing Circle Animation */}
                                    {isActive && (
                                        <motion.div
                                            animate={{ scale: [1, 1.5, 1] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute w-32 h-32 bg-eco-200 rounded-full opacity-50"
                                        />
                                    )}
                                    <div className="text-4xl font-bold text-eco-800 z-10 font-mono">
                                        00:{timeLeft.toString().padStart(2, '0')}
                                    </div>
                                </div>
                            )}
                        </div>

                        {!isActive && !isCompleted && (
                            <button
                                onClick={startSession}
                                className="btn-primary w-full flex items-center justify-center gap-2 py-3 text-lg"
                            >
                                <Play size={20} /> Start Breathing
                            </button>
                        )}

                        {isCompleted && (
                            <button
                                onClick={onClose}
                                className="btn-primary w-full py-3 text-lg"
                            >
                                Return to Dashboard
                            </button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
