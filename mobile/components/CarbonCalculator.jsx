import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { Calculator, Smartphone, Video, AlertTriangle } from 'lucide-react-native';

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

const CO2_RATES = {
    scrolling: 1.5,
    streaming: 3.0,
};

export default function CarbonCalculator({ onUpdate }) {
    const [scrollingTime, setScrollingTime] = useState(0);
    const [streamingTime, setStreamingTime] = useState(0);
    const [totalCO2, setTotalCO2] = useState(0);

    useEffect(() => {
        const co2 = (scrollingTime * CO2_RATES.scrolling) + (streamingTime * CO2_RATES.streaming);
        setTotalCO2(co2);
        if (onUpdate) onUpdate(co2);
    }, [scrollingTime, streamingTime]);

    return (
        <View style={styles.card}>
            <View style={styles.header}>
                <View style={styles.iconContainer}>
                    <Calculator size={22} color={COLORS.eco[600]} />
                </View>
                <Text style={styles.title}>Carbon Footprint</Text>
            </View>

            <View style={styles.content}>
                {/* Scrolling Control */}
                <View style={styles.controlGroup}>
                    <View style={styles.labelRow}>
                        <View style={styles.labelIconWrapper}>
                            <Smartphone size={18} color={COLORS.eco[800]} />
                            <Text style={styles.label}>Doom-scrolling</Text>
                        </View>
                        <Text style={styles.value}>{Math.round(scrollingTime)} min</Text>
                    </View>

                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={180}
                        step={1}
                        value={scrollingTime}
                        onValueChange={setScrollingTime}
                        minimumTrackTintColor={COLORS.eco[500]}
                        maximumTrackTintColor={COLORS.eco[100]}
                        thumbTintColor={COLORS.eco[600]}
                    />

                    <Text style={styles.impactText}>
                        {(scrollingTime * CO2_RATES.scrolling).toFixed(1)}g CO2
                    </Text>
                </View>

                {/* Streaming Control */}
                <View style={[styles.controlGroup, styles.borderTop]}>
                    <View style={styles.labelRow}>
                        <View style={styles.labelIconWrapper}>
                            <Video size={18} color={COLORS.eco[800]} />
                            <Text style={styles.label}>Streaming</Text>
                        </View>
                        <Text style={styles.value}>{Math.round(streamingTime)} min</Text>
                    </View>

                    <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={180}
                        step={1}
                        value={streamingTime}
                        onValueChange={setStreamingTime}
                        minimumTrackTintColor={COLORS.eco[500]}
                        maximumTrackTintColor={COLORS.eco[100]}
                        thumbTintColor={COLORS.eco[600]}
                    />

                    <Text style={styles.impactText}>
                        {(streamingTime * CO2_RATES.streaming).toFixed(1)}g CO2
                    </Text>
                </View>
            </View>

            <View style={styles.footer}>
                <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Total Emissions</Text>
                    <Text style={styles.totalValue}>{totalCO2.toFixed(1)}g</Text>
                </View>

                {totalCO2 > 100 && (
                    <View style={styles.alertBox}>
                        <AlertTriangle size={18} color="#b91c1c" />
                        <Text style={styles.alertText}>High impact! Your forest is suffering.</Text>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 24,
        marginBottom: 24,
        ...SHADOWS.small,
        padding: 6,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.eco[50],
    },
    iconContainer: {
        padding: 10,
        backgroundColor: COLORS.eco[50],
        borderRadius: 12,
        marginRight: 12,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.eco[900],
    },
    content: {
        padding: 16,
    },
    controlGroup: {
        paddingVertical: 4,
    },
    borderTop: {
        borderTopWidth: 1,
        borderTopColor: COLORS.stone[50],
        paddingTop: 20,
        marginTop: 10,
    },
    labelRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        alignItems: 'center',
    },
    labelIconWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    label: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.stone[600],
    },
    value: {
        fontSize: 15,
        fontWeight: '700',
        color: COLORS.eco[600],
    },
    slider: {
        width: '100%',
        height: 40,
    },
    impactText: {
        fontSize: 12,
        color: COLORS.stone[400],
        textAlign: 'right',
        marginTop: -4,
        fontWeight: '500',
    },
    footer: {
        backgroundColor: COLORS.eco[50],
        borderRadius: 20,
        padding: 16,
        margin: 6,
    },
    totalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    totalLabel: {
        fontSize: 14,
        color: COLORS.eco[700],
        fontWeight: '600',
    },
    totalValue: {
        fontSize: 28,
        fontWeight: '800',
        color: COLORS.eco[900],
    },
    alertBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#fef2f2',
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#fee2e2',
        marginTop: 12,
    },
    alertText: {
        color: '#b91c1c',
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
    }
});
