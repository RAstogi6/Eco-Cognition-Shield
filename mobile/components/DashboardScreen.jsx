import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView, StyleSheet, Platform, StatusBar as RNStatusBar } from 'react-native';
import { Leaf, RefreshCw, Info } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Forest from './Forest';
import CarbonCalculator from './CarbonCalculator';
import Mindfulness from './Mindfulness';

// Inline Theme Constants
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
    small: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 2,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    large: {
        shadowColor: "#1d704b",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 10,
    }
};

export default function Dashboard() {
    const [health, setHealth] = useState(100);
    const [co2, setCo2] = useState(0);
    const [showMindfulness, setShowMindfulness] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const handleCo2Update = (newCo2) => {
        setCo2(newCo2);
        const healthLoss = Math.min(100, newCo2 / 2);
        setHealth(Math.max(0, 100 - healthLoss));
    };

    const handleMindfulnessComplete = () => {
        setHealth(prev => Math.min(100, prev + 30));
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setHealth(100);
            setCo2(0);
            setRefreshing(false);
        }, 1000);
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[COLORS.eco[50], COLORS.white]}
                style={styles.background}
            />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={COLORS.eco[600]} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTitleContainer}>
                        <LinearGradient
                            colors={[COLORS.eco[500], COLORS.eco[700]]}
                            style={styles.logoContainer}
                        >
                            <Leaf size={28} color="white" />
                        </LinearGradient>
                        <View>
                            <Text style={styles.appTitle}>Eco-Shield</Text>
                            <Text style={styles.appSubtitle}>Digital Wellness</Text>
                        </View>
                    </View>
                    <TouchableOpacity
                        onPress={handleRefresh}
                        style={styles.refreshButton}
                    >
                        <RefreshCw size={20} color={COLORS.eco[400]} />
                    </TouchableOpacity>
                </View>

                {/* Main Content */}
                <Forest health={health} />

                {/* Controls */}
                <CarbonCalculator onUpdate={handleCo2Update} />

                {/* Actions Grid */}
                <View style={styles.grid}>
                    <View style={[styles.card, styles.ratioCard]}>
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardTitle}>Data-Carbon Ratio</Text>
                            <Text style={styles.ratioValue}>{co2.toFixed(1)}g</Text>
                        </View>
                        <View style={styles.progressBarBg}>
                            <LinearGradient
                                colors={[COLORS.eco[400], COLORS.eco[600]]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={[styles.progressBarFill, { width: `${Math.min(100, (co2 / 200) * 100)}%` }]}
                            />
                        </View>
                        <Text style={styles.targetText}>Target: &lt;50g/day</Text>
                    </View>

                    <View style={[styles.card, styles.interventionCard]}>
                        <Text style={styles.cardTitle}>Need a Break?</Text>
                        <Text style={styles.interventionText}>
                            Restore your forest by taking a mindful pause.
                        </Text>
                        <TouchableOpacity
                            onPress={() => setShowMindfulness(true)}
                            disabled={health >= 100}
                        >
                            <LinearGradient
                                colors={health >= 100 ? [COLORS.stone[200], COLORS.stone[400]] : [COLORS.eco[500], COLORS.eco[700]]}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>
                                    {health >= 100 ? "Forest is Healthy" : "Start Intervention"}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <LinearGradient
                        colors={[COLORS.eco[700], COLORS.eco[900]]}
                        style={styles.infoCard}
                    >
                        <Text style={styles.infoTitle}>Did you know?</Text>
                        <Text style={styles.infoText}>
                            Streaming video in 4K for 1 hour emits ~440g of CO2. That's equivalent to driving a car for 2km.
                        </Text>
                        <View style={styles.sourceTag}>
                            <Info size={14} color={COLORS.eco[200]} />
                            <Text style={styles.sourceText}>Source: Carbon Trust Research</Text>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.footer} />
            </ScrollView>

            <Mindfulness
                isOpen={showMindfulness}
                onClose={() => setShowMindfulness(false)}
                onComplete={handleMindfulnessComplete}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
        paddingTop: Platform.OS === 'android' ? RNStatusBar.currentHeight : 0,
    },
    background: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height: '100%',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    headerTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoContainer: {
        padding: 10,
        borderRadius: 16,
        ...SHADOWS.medium,
    },
    appTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: COLORS.eco[900],
        letterSpacing: -0.5,
    },
    appSubtitle: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.eco[600],
        marginTop: 2,
    },
    refreshButton: {
        padding: 8,
        backgroundColor: COLORS.white,
        borderRadius: 12,
        ...SHADOWS.small,
    },
    grid: {
        gap: 16,
        marginBottom: 20,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        ...SHADOWS.small,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.eco[900],
    },
    interventionCard: {
        borderWidth: 2,
        borderColor: COLORS.eco[100],
        borderStyle: 'dashed',
        alignItems: 'center',
    },
    interventionText: {
        fontSize: 14,
        color: COLORS.stone[500],
        marginBottom: 20,
        textAlign: 'center',
        lineHeight: 20,
        paddingHorizontal: 10,
    },
    button: {
        paddingVertical: 14,
        paddingHorizontal: 30,
        borderRadius: 14,
        width: '100%',
        alignItems: 'center',
        ...SHADOWS.medium,
    },
    buttonText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 15,
    },
    ratioValue: {
        fontSize: 16,
        fontWeight: '800',
        color: COLORS.eco[700],
    },
    progressBarBg: {
        height: 10,
        backgroundColor: COLORS.stone[100],
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 8,
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 10,
    },
    targetText: {
        fontSize: 12,
        color: COLORS.stone[400],
        textAlign: 'right',
        fontWeight: '500',
    },
    infoCard: {
        padding: 24,
        borderRadius: 20,
        ...SHADOWS.medium,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.white,
        marginBottom: 8,
    },
    infoText: {
        fontSize: 14,
        color: COLORS.eco[100],
        lineHeight: 22,
        marginBottom: 16,
    },
    sourceTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.15)',
        alignSelf: 'flex-start',
        paddingVertical: 6,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    sourceText: {
        fontSize: 11,
        color: COLORS.eco[100],
        fontWeight: '500',
    },
    footer: {
        height: 20,
    }
});
