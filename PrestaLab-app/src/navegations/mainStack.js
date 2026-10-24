import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import HomeScreen from "../screens/homeScreen";
import ProfileScreen from "../screens/profileScreen";
import ArticulosScreen from "../screens/articulosScreen";
import ArticleDetailScreen from "../screens/articleDetailScreen";
import LoanRequestScreen from "../screens/loanRequestScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const screenOptions = {
  headerShown: false,
  animation: "slide_from_right",
};

function TabBarButton({ children, onPress, onLongPress, style, ...rest }) {
  const isActive = !!rest["aria-selected"];

  return (
    <TouchableOpacity
      {...rest}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
      style={[styles.tabTouchable, style]}
    >
      <View style={[styles.tabPill, isActive && styles.tabPillFocused]}>
        {children}
      </View>
    </TouchableOpacity>
  );
}

function TabBarBackground() {
  return (
    <LinearGradient
      colors={["rgba(255,255,255,0.97)", "rgba(238,246,240,0.92)"]}
      style={{ flex: 1 }}
    />
  );
}

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarButton: (props) => <TabBarButton {...props} />,
        tabBarActiveTintColor: "#FEFFFE",
        tabBarInactiveTintColor: "#256B42",
        tabBarBackground: TabBarBackground,
        tabBarStyle: {
          backgroundColor: "transparent",
          borderTopColor: "rgba(37,107,66,0.18)",
          borderTopWidth: 1,
          height: 84,
          paddingBottom: 20,
          paddingTop: 8,
          borderRadius: 24,
          marginHorizontal: 12,
          marginBottom: 12,
          position: "absolute",
          elevation: 8,
          overflow: "hidden",
        },
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 11,
          fontWeight: "500",
        },
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Buscar"
        component={ArticulosScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Mis Prestamos"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="heart" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabTouchable: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  tabPill: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 16,
    minWidth: 72,
    minHeight: 56,
  },
  tabPillFocused: {
    backgroundColor: "#256B42",
    shadowColor: "#256B42",
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="MainTabs" component={HomeTabs} />
      <Stack.Screen name="ArticleDetail" component={ArticleDetailScreen} />
      <Stack.Screen name="LoanRequest" component={LoanRequestScreen} />
    </Stack.Navigator>
  );
}
