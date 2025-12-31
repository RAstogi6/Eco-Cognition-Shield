import React, { useState, useEffect } from 'react';
import Forest from '../forest/Forest';
import CarbonCalculator from '../calculator/CarbonCalculator';
import Mindfulness from '../intervention/Mindfulness';
import { Leaf, RefreshCw, Info } from 'lucide-react';

export default function Dashboard() {
    const [health, setHealth] = useState(100);
    const [co2, setCo2] = useState(0);
    const [showMindfulness, setShowMindfulness] = useState(false);

    const handleCo2Update = (newCo2) => {
        setCo2(newCo2);
        // Simulation: 5g CO2 = 1% health loss
        // Base health is 100.
        const healthLoss = Math.min(100, newCo2 / 2); // More sensitive: 200g = 0% health
        setHealth(Math.max(0, 100 - healthLoss));
    };

    const handleMindfulnessComplete = () => {
        setHealth(prev => Math.min(100, prev + 30));
        setShowMindfulness(false);
    };

    return (
        <div className="min-h-screen bg-eco-50 p-4 md:p-8 font-sans">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-eco-600 rounded-xl text-white shadow-lg shadow-eco-200">
                            <Leaf size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-eco-900 tracking-tight">Eco-Cognition Shield</h1>
                            <p className="text-eco-600 font-medium">Digital Wellness & Sustainability</p>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="p-2 text-eco-400 hover:text-eco-600 transition-colors"
                        title="Reset Simulation"
                    >
                        <RefreshCw size={20} />
                    </button>
                </header>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Controls */}
                    <div className="lg:col-span-1 space-y-6">
                        <CarbonCalculator onUpdate={handleCo2Update} />

                        <div className="card bg-gradient-to-br from-eco-600 to-eco-800 text-white border-none">
                            <h3 className="text-lg font-bold mb-2">Did you know?</h3>
                            <p className="text-eco-100 text-sm leading-relaxed">
                                Streaming video in 4K for 1 hour emits ~440g of CO2. That's equivalent to driving a car for 2km.
                            </p>
                            <div className="mt-4 flex items-center gap-2 text-xs text-eco-200 bg-white/10 p-2 rounded-lg">
                                <Info size={14} />
                                <span>Source: Carbon Trust Research</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Visualization */}
                    <div className="lg:col-span-2 space-y-6">
                        <Forest health={health} />

                        {/* Action Area */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="card flex flex-col justify-between">
                                <div>
                                    <h3 className="font-bold text-eco-900 mb-1">Data-Carbon Ratio</h3>
                                    <p className="text-sm text-stone-500 mb-4">Real-time impact analysis</p>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-stone-600">Current Emissions</span>
                                        <span className="font-bold text-eco-700">{co2.toFixed(1)}g</span>
                                    </div>
                                    <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                                        <div
                                            className="bg-eco-500 h-full transition-all duration-500"
                                            style={{ width: `${Math.min(100, (co2 / 200) * 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-xs text-stone-400 text-right">Target: &lt;50g/day</p>
                                </div>
                            </div>

                            <div className="card bg-stone-50 border-dashed border-2 border-eco-200 flex flex-col items-center justify-center text-center p-6">
                                <h3 className="font-bold text-eco-900 mb-2">Need a Break?</h3>
                                <p className="text-sm text-stone-500 mb-4">
                                    Restore your forest by taking a mindful pause.
                                </p>
                                <button
                                    onClick={() => setShowMindfulness(true)}
                                    className="btn-primary w-full"
                                    disabled={health >= 100}
                                >
                                    {health >= 100 ? "Forest is Healthy" : "Start Intervention"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Mindfulness
                isOpen={showMindfulness}
                onClose={() => setShowMindfulness(false)}
                onComplete={handleMindfulnessComplete}
            />
        </div>
    );
}
