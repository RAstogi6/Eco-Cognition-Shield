import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { Droplets, X, Play, CheckCircle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const COLORS = {
    eco: {
        50: '#f2fcf5',
        100: '#e1f8e8',
        200: '#c3efd2',
        300: '#94e0b3',
        400: '#5cc98d',
        500: '#34ae75',
        600: '#238c5b',
        700: '#1d704b',
        800: '#1a593e',
        900: '#164935',
    },
    stone: {
        50: '#fafabb',
        100: '#f5f5f4',
        200: '#e7e5e4',
        400: '#a8a29e',
        500: '#78716c',
        600: '#57534e',
        900: '#1c1917'
    },
    white: '#FFFFFF',
    black: '#000000',
};

const SHADOWS = {
    small: { shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3.84, elevation: 2 },
    medium: { shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 6, elevation: 5 },
    large: { shadowColor: "#1d704b", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 10 }
};

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
    }, [isActive, timeLeft]);

    useEffect(() => {
        if (isOpen && !isActive && !isCompleted) {
            setTimeLeft(60);
        }
    }, [isOpen]);

    const startSession = () => {
        setIsActive(true);
    };

    const handleClose = () => {
        setIsActive(false);
        setIsCompleted(false);
        setTimeLeft(60);
        onClose();
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isOpen}
            onRequestClose={handleClose}
        >
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <TouchableOpacity
                        onPress={handleClose}
                        style={styles.closeButton}
                    >
                        <X size={24} color={COLORS.stone[400]} />
                    </TouchableOpacity>

                    <View style={styles.content}>
                        <View style={styles.iconContainer}>
                            <Droplets size={32} color={COLORS.eco[600]} />
                        </View>

                        <View style={styles.textContainer}>
                            <Text style={styles.title}>Water Your Forest</Text>
                            <Text style={styles.subtitle}>
                                Take a moment to breathe. A 1-minute break will restore your digital ecosystem.
                            </Text>
                        </View>

                        <View style={styles.timerContainer}>
                            {isCompleted ? (
                                <View style={styles.completedState}>
                                    <CheckCircle size={56} color={COLORS.eco[500]} />
                                    <Text style={styles.completedText}>Forest Watered!</Text>
                                </View>
                            ) : (
                                <View style={styles.timerState}>
                                    {isActive && (
                                        <View style={styles.pulseDisk} />
                                    )}
                                    <Text style={styles.timerText}>
                                        00:{timeLeft.toString().padStart(2, '0')}
                                    </Text>
                                </View>
                            )}
                        </View>

                        {!isActive && !isCompleted && (
                            <TouchableOpacity
                                onPress={startSession}
                                activeOpacity={0.8}
                                style={styles.actionButtonWrapper}
                            >
                                <LinearGradient
                                    colors={[COLORS.eco[500], COLORS.eco[700]]}
                                    style={styles.actionButton}
                                >
                                    <Play size={22} color="white" fill="white" />
                                    <Text style={styles.actionButtonText}>Start Breathing</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}

                        {isCompleted && (
                            <TouchableOpacity
                                onPress={handleClose}
                                activeOpacity={0.8}
                                style={styles.actionButtonWrapper}
                            >
                                <LinearGradient
                                    colors={[COLORS.eco[500], COLORS.eco[700]]}
                                    style={styles.actionButton}
                                >
                                    <Text style={styles.actionButtonText}>Return to Dashboard</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        padding: 20,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 30,
        padding: 24,
        ...SHADOWS.large,
        position: 'relative',
        overflow: 'hidden',
    },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 8,
        zIndex: 10,
    },
    content: {
        alignItems: 'center',
    },
    iconContainer: {
        width: 72,
        height: 72,
        backgroundColor: COLORS.eco[50],
        borderRadius: 36,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    textContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.eco[900],
        marginBottom: 8,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 15,
        color: COLORS.stone[500],
        textAlign: 'center',
        lineHeight: 22,
    },
    timerContainer: {
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    completedState: {
        alignItems: 'center',
        gap: 12,
    },
    completedText: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.eco[600],
    },
    timerState: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    pulseDisk: {
        position: 'absolute',
        width: 140,
        height: 140,
        backgroundColor: COLORS.eco[50],
        borderRadius: 70,
    },
    timerText: {
        fontSize: 48,
        fontWeight: '800',
        color: COLORS.eco[800],
        fontVariant: ['tabular-nums'],
        letterSpacing: 2,
    },
    actionButtonWrapper: {
        width: '100%',
        marginTop: 20,
    },
    actionButton: {
        paddingVertical: 18,
        borderRadius: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        ...SHADOWS.medium,
    },
    actionButtonText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 18,
    }
});
