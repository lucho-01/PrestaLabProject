import { ActivityIndicator, StyleSheet, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { PaperProvider, ActivityIndicator as PaperActivityIndicator, MD3LightTheme } from "react-native-paper";
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from "@expo-google-fonts/inter";
import { UserProvider, useUser } from "./src/contexts/userContext";
import AuthStack from "./src/navegations/authStack";
import MainStack from "./src/navegations/mainStack";

const theme = {
  ...MD3LightTheme,
  roundness: 24,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#256B42',
    onPrimary: '#FEFFFE',
    primaryContainer: '#ABF2C1',
    onPrimaryContainer: '#02210E',
    secondary: '#4F6355',
    secondaryContainer: '#D1E8D7',
    onSecondaryContainer: '#0E1F14',
    tertiaryContainer: '#B6ECF4',
    onTertiaryContainer: '#031F23',
    surface: '#F5FBF6',
    surfaceContainerLow: '#EFF5F1',
    surfaceContainer: '#EAEFEB',
    surfaceContainerHigh: '#E4EAE5',
    surfaceContainerHighest: '#DEE4E0',
    onSurface: '#181C1A',
    onSurfaceVariant: '#3E4941',
    outline: '#6E7A71',
    outlineVariant: '#BDCAC0',
    error: '#B3261E',
    onError: '#FFFFFF',
    errorContainer: '#F9DEDC',
    onErrorContainer: '#410E0B',
  },
  fonts: {
    ...MD3LightTheme.fonts,
    regular: { fontFamily: 'Inter_400Regular', fontWeight: '400' },
    medium: { fontFamily: 'Inter_500Medium', fontWeight: '500' },
    mediumLarge: { fontFamily: 'Inter_500Medium', fontWeight: '500' },
    bold: { fontFamily: 'Inter_700Bold', fontWeight: '700' },
    titleLarge: { fontFamily: 'Inter_700Bold', fontWeight: '700' },
    titleMedium: { fontFamily: 'Inter_500Medium', fontWeight: '500' },
    titleSmall: { fontFamily: 'Inter_500Medium', fontWeight: '500' },
    labelLarge: { fontFamily: 'Inter_500Medium', fontWeight: '500' },
    labelMedium: { fontFamily: 'Inter_500Medium', fontWeight: '500' },
    labelSmall: { fontFamily: 'Inter_500Medium', fontWeight: '500' },
    bodyLarge: { fontFamily: 'Inter_400Regular', fontWeight: '400' },
    bodyMedium: { fontFamily: 'Inter_400Regular', fontWeight: '400' },
    bodySmall: { fontFamily: 'Inter_400Regular', fontWeight: '400' },
  },
};

function AppContent() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#F5FBF6' }]}>
        <PaperActivityIndicator size="large" color="#256B42" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: '#F5FBF6' }]}>
        <PaperActivityIndicator size="large" color="#256B42" />
      </View>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
