import React from 'react';
import { Trees, CloudRain, Wind } from 'lucide-react';
import clsx from 'clsx';

const Tree = ({ health, delay }) => {
    const isDead = health < 20;
    const isWilting = health < 50;

    return (
        <div
            className={clsx(
                "transition-all duration-1000 transform origin-bottom",
                isDead ? "text-stone-600 grayscale" : isWilting ? "text-yellow-600 grayscale-[50%]" : "text-eco-600",
                isWilting && "animate-wilt",
                !isWilting && "animate-grow"
            )}
            style={{ animationDelay: `${delay}ms` }}
        >
            <Trees size={isDead ? 40 : 48} strokeWidth={isDead ? 1 : 2} />
        </div>
    );
};

export default function Forest({ health = 100 }) {
    // health is 0-100. 100 is healthy, 0 is dead.
    // We'll calculate health based on CO2 emissions in the parent.

    const getStatusText = () => {
        if (health >= 80) return "Thriving Ecosystem";
        if (health >= 50) return "Warning Signs";
        if (health >= 20) return "Critical Condition";
        return "Ecological Collapse";
    };

    const getStatusColor = () => {
        if (health >= 80) return "text-eco-700";
        if (health >= 50) return "text-yellow-600";
        if (health >= 20) return "text-orange-600";
        return "text-stone-600";
    };

    return (
        <div className="card relative overflow-hidden min-h-[300px] flex flex-col justify-between transition-colors duration-1000"
            style={{
                background: health < 20 ? '#e7e5e4' : health < 50 ? '#fefce8' : '#f0fdf4'
            }}>

            <div className="z-10 flex justify-between items-start">
                <div>
                    <h2 className={clsx("text-2xl font-bold transition-colors", getStatusColor())}>
                        {getStatusText()}
                    </h2>
                    <p className="text-eco-600/80 text-sm font-medium">Forest Health: {health}%</p>
                </div>

                {health < 50 && (
                    <div className="animate-pulse-slow text-orange-500">
                        <Wind size={24} />
                    </div>
                )}
            </div>

            {/* Forest Visualization */}
            <div className="flex items-end justify-around pb-4 z-10 px-4">
                {[...Array(5)].map((_, i) => (
                    <Tree key={i} health={health} delay={i * 100} />
                ))}
            </div>

            {/* Ground */}
            <div className={clsx(
                "absolute bottom-0 left-0 right-0 h-12 transition-colors duration-1000",
                health < 20 ? "bg-stone-300" : health < 50 ? "bg-yellow-100" : "bg-eco-200"
            )} />

            {/* Background Elements */}
            {health >= 50 && (
                <div className="absolute top-10 right-10 text-eco-200 animate-pulse-slow">
                    <CloudRain size={48} />
                </div>
            )}
        </div>
    );
}
