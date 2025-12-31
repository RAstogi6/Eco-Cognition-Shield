import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import DashboardScreen from './components/DashboardScreen';

export default function App() {
    return (
        <View style={{ flex: 1, backgroundColor: '#f2fcf5' }}>
            <StatusBar style="auto" />
            <DashboardScreen />
        </View>
    );
}
