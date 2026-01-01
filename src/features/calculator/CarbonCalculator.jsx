import React, { useState, useEffect } from 'react';
import { Calculator, Smartphone, Video, AlertTriangle } from 'lucide-react';

const CO2_RATES = {
    scrolling: 1.5, // g per minute
    streaming: 3.0, // g per minute
};

export default function CarbonCalculator({ onUpdate, externalData }) {
    const [scrollingTime, setScrollingTime] = useState(0);
    const [streamingTime, setStreamingTime] = useState(0);
    const [totalCO2, setTotalCO2] = useState(0);

    useEffect(() => {
        if (externalData) {
            setScrollingTime(Math.round(externalData.socialMins || 0));
            setStreamingTime(Math.round(externalData.videoMins || 0));
            setTotalCO2(externalData.totalCO2 || 0);
            if (onUpdate) onUpdate(externalData.totalCO2 || 0);
        } else {
            const co2 = (scrollingTime * CO2_RATES.scrolling) + (streamingTime * CO2_RATES.streaming);
            setTotalCO2(co2);
            if (onUpdate) onUpdate(co2);
        }
    }, [scrollingTime, streamingTime, onUpdate, externalData]);

    return (
        <div className="card space-y-6">
            <div className="flex items-center space-x-3 border-b border-eco-100 pb-4">
                <div className="p-2 bg-eco-100 rounded-lg text-eco-600">
                    <Calculator size={24} />
                </div>
                <h2 className="text-xl font-bold text-eco-900">Carbon Footprint</h2>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="flex items-center justify-between text-sm font-medium text-eco-800">
                        <span className="flex items-center gap-2">
                            <Smartphone size={16} /> Doom-scrolling (mins)
                        </span>
                        <span className="text-eco-600 font-bold">{scrollingTime}m</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="180"
                        value={scrollingTime}
                        onChange={(e) => setScrollingTime(Number(e.target.value))}
                        className="w-full h-2 bg-eco-200 rounded-lg appearance-none cursor-pointer accent-eco-600"
                    />
                    <p className="text-xs text-eco-500 text-right">
                        {(scrollingTime * CO2_RATES.scrolling).toFixed(1)}g CO2
                    </p>
                </div>

                <div className="space-y-2">
                    <label className="flex items-center justify-between text-sm font-medium text-eco-800">
                        <span className="flex items-center gap-2">
                            <Video size={16} /> Video Streaming (mins)
                        </span>
                        <span className="text-eco-600 font-bold">{streamingTime}m</span>
                    </label>
                    <input
                        type="range"
                        min="0"
                        max="180"
                        value={streamingTime}
                        onChange={(e) => setStreamingTime(Number(e.target.value))}
                        className="w-full h-2 bg-eco-200 rounded-lg appearance-none cursor-pointer accent-eco-600"
                    />
                    <p className="text-xs text-eco-500 text-right">
                        {(streamingTime * CO2_RATES.streaming).toFixed(1)}g CO2
                    </p>
                </div>
            </div>

            <div className="pt-4 border-t border-eco-100">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-eco-700">Total Emissions</span>
                    <span className="text-2xl font-bold text-eco-900">{totalCO2.toFixed(1)}g</span>
                </div>

                {totalCO2 > 100 && (
                    <div className="flex items-start gap-2 p-3 bg-red-50 text-red-700 text-xs rounded-lg border border-red-100 mt-2">
                        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                        <p>High impact! Your digital forest is suffering. Consider a break.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
