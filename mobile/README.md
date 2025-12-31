# Eco-Cognition Shield Mobile App

A digital wellness application designed to visualize and mitigate the carbon impact of digital habits. Run on your phone to track your "Data-Carbon Ratio" and restore your digital forest.

## 🌿 Features

*   **Forest Visualizer**: A dynamic forest that reflects your digital health. Using high usage apps makes the forest wilt; mindfulness restores it.
*   **Carbon Calculator**: Estimate CO2 emissions based on your daily doom-scrolling and video streaming habits.
*   **Mindfulness Intervention**: A built-in 1-minute breathing exercise to "water" your forest and reset your focus.
*   **Real-time Dashboard**: Track your health score (0-100%) and total CO2 output in a beautiful, gradient-rich interface.

## 🛠️ Tech Stack

*   **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/)
*   **Styling**: Custom `StyleSheet` with `expo-linear-gradient` (Premium "Eco" Theme)
*   **Icons**: `lucide-react-native`
*   **Components**: Custom accessible components (Dashdoard, Slider, Modal)

## 🚀 Getting Started

### Prerequisites

*   Node.js (LTS)
*   Expo Go app on your Android/iOS device (or an Emulator)

### Installation

1.  Navigate to the mobile directory:
    ```bash
    cd mobile
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the App

1.  Start the Expo server:
    ```bash
    npx expo start -c
    ```
    *(The `-c` flag ensures a clean cache start, recommended)*

2.  **Android**: Press `a` (if emulator is open) or scan the QR code with the Expo Go app.
3.  **iOS**: Press `i` (simulator) or scan the QR code.

## 📂 Project Structure

*   `App.js`: Main entry point (loads `DashboardScreen`).
*   `components/`:
    *   `DashboardScreen.jsx`: Main UI container.
    *   `Forest.jsx`: Visualization logic (trees, clouds, health states).
    *   `CarbonCalculator.jsx`: Input sliders for scrolling/streaming.
    *   `Mindfulness.jsx`: Modal for breathing exercises.
*   `constants/theme.js`: (Deprecated/Inlined) Original theme definition. *Note: Theme constants are currently inlined in components for maximum stability on Windows environments.*

## ⚠️ Windows Development Note

This project has been optimized for Windows development by removing `nativewind` dependencies which can cause Metro bundler issues. It uses pure React Native styles for robust cross-platform compatibility.
