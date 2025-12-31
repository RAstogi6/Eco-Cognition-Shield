import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Trees, CloudRain, Wind } from 'lucide-react-native';
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

const Tree = ({ health, index }) => {
    const isDead = health < 20;
    const isWilting = health < 50;

    const color = isDead ? COLORS.stone[600] : isWilting ? "#ca8a04" : COLORS.eco[600];

    return (
        <View style={styles.treeContainer}>
            <Trees
                size={isDead ? 36 : 48}
                color={color}
                strokeWidth={isDead ? 1.5 : 2}
            />
        </View>
    );
};

export default function Forest({ health = 100 }) {
    const getStatus = () => {
        if (health >= 80) return { text: "Thriving Ecosystem", color: COLORS.eco[700], bg: [COLORS.eco[50], COLORS.eco[100]] };
        if (health >= 50) return { text: "Warning Signs", color: "#ca8a04", bg: ["#fefce8", "#fef9c3"] };
        if (health >= 20) return { text: "Critical Condition", color: "#ea580c", bg: ["#ffedd5", "#fed7aa"] };
        return { text: "Ecological Collapse", color: COLORS.stone[600], bg: [COLORS.stone[100], COLORS.stone[200]] };
    };

    const status = getStatus();

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={status.bg}
                style={styles.gradientBg}
            />

            <View style={styles.header}>
                <View>
                    <Text style={[styles.statusTitle, { color: status.color }]}>
                        {status.text}
                    </Text>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Forest Health: {health.toFixed(0)}%</Text>
                    </View>
                </View>

                {health < 50 && (
                    <View style={styles.warningIcon}>
                        <Wind size={24} color="#ea580c" />
                    </View>
                )}
            </View>

            {/* Trees Container */}
            <View style={styles.forestContainer}>
                {[...Array(5)].map((_, i) => (
                    <Tree key={i} health={health} index={i} />
                ))}
            </View>

            {/* Ground */}
            <View style={[
                styles.ground,
                { backgroundColor: health < 20 ? COLORS.stone[400] : health < 50 ? '#fde047' : COLORS.eco[300] }
            ]} />

            {/* Background Elements */}
            {health >= 50 && (
                <View style={styles.cloud}>
                    <CloudRain size={48} color={COLORS.eco[200]} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 24,
        overflow: 'hidden',
        minHeight: 280,
        justifyContent: 'space-between',
        marginBottom: 24,
        ...SHADOWS.medium,
        backgroundColor: 'white',
    },
    gradientBg: {
        ...StyleSheet.absoluteFillObject,
    },
    header: {
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        zIndex: 10,
    },
    statusTitle: {
        fontSize: 22,
        fontWeight: '800',
        marginBottom: 8,
        letterSpacing: -0.5,
    },
    badge: {
        backgroundColor: 'rgba(255,255,255,0.6)',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.stone[600],
    },
    warningIcon: {
        padding: 8,
        backgroundColor: 'rgba(255,255,255,0.5)',
        borderRadius: 12,
    },
    forestContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
        paddingBottom: 20,
        zIndex: 10,
        flex: 1,
    },
    treeContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        height: 60,
    },
    ground: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 24,
        opacity: 0.6,
    },
    cloud: {
        position: 'absolute',
        top: 24,
        right: 24,
        opacity: 0.6,
    }
});
