import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Card, ProgressBar } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "../contexts/userContext";
import { subscribeToLoans } from "../services/firestoreService";
import Skeleton from "../components/Skeleton";
import Gloss from "../components/Gloss";

export default function HomeScreen({ navigation }) {
  const { user } = useUser();
  const [activeLoans, setActiveLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToLoans(user?.uid, (loans) => {
      setActiveLoans(loans.filter((loan) => loan.estado === "activo"));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user?.uid]);

  const getDaysRemaining = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();
    const diffTime = end - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgress = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const now = new Date();
    const total = end - start;
    const elapsed = now - start;
    return Math.min(Math.max(elapsed / total, 0), 1);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        {activeLoans.length > 0 && (
        <View style={styles.alertCard}>
          <MaterialCommunityIcons
            name="alert-circle-outline"
            size={20}
            color="#256B42"
          />
          <Text style={styles.alertText}>
            Tu préstamo de {activeLoans[0]?.articuloNombre} vence en{" "}
            {getDaysRemaining(activeLoans[0]?.fechaFin)} días
          </Text>
        </View>
      )}

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={[styles.actionCard, styles.actionCardActive]}
          onPress={() => navigation.navigate("Buscar")}
        >
          <Gloss />
          <MaterialCommunityIcons
            name="plus-circle-outline"
            size={32}
            color="#FEFFFE"
          />
          <Text style={[styles.actionText, { color: "#FEFFFE" }]}>Prestar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.actionCardInactive]}
          onPress={() => navigation.navigate("Mis Prestamos")}
        >
          <Gloss tone="light" />
          <MaterialCommunityIcons
            name="keyboard-return"
            size={32}
            color="#256B42"
          />
          <Text style={[styles.actionText, { color: "#181C1A" }]}>
            Devolver
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Mis préstamos activos</Text>

      {loading ? (
        [0, 1].map((i) => (
          <View key={i} style={[styles.loanCard, styles.skeletonCard]}>
            <View style={styles.loanContent}>
              <Skeleton width="60%" height={18} borderRadius={8} style={{ marginBottom: 10 }} />
              <Skeleton width="40%" height={14} borderRadius={6} style={{ marginBottom: 14 }} />
              <Skeleton width="100%" height={4} borderRadius={2} />
            </View>
          </View>
        ))
      ) : activeLoans.length === 0 ? (
        <Card style={styles.emptyCard}>
          <Card.Content style={styles.emptyContent}>
            <MaterialCommunityIcons
              name="package-variant"
              size={48}
              color="#256B42"
            />
            <Text style={styles.emptyText}>No tienes préstamos activos</Text>
          </Card.Content>
        </Card>
      ) : (
        activeLoans.map((loan) => (
          <Card key={loan.id} style={styles.loanCard}>
            <Card.Content style={styles.loanContent}>
              <Gloss />
              <View style={styles.loanHeader}>
                <Text style={styles.loanName}>{loan.articuloNombre}</Text>
                <View style={styles.daysBadge}>
                  <Text style={styles.daysText}>
                    {getDaysRemaining(loan.fechaFin)} días
                  </Text>
                </View>
              </View>
              <Text style={styles.loanDate}>Vence: {loan.fechaFin}</Text>
              <ProgressBar
                progress={getProgress(loan.fechaInicio, loan.fechaFin)}
                color="#FEFFFE"
                style={styles.progressBar}
              />
            </Card.Content>
          </Card>
        ))
      )}

      <View style={styles.bottomSpacing} />
      </ScrollView>

      <LinearGradient
        colors={["#2E7D51", "#256B42", "#1A5133"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerWrap}
      >
        <Gloss />
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>PrestaLab</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <MaterialCommunityIcons
              name="bell-outline"
              size={24}
              color="#FEFFFE"
            />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F5FBF6",
  },
  container: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    paddingTop: 212,
  },
  headerWrap: {
    position: "absolute",
    top: 52,
    left: 12,
    right: 12,
    height: 144,
    borderRadius: 24,
    overflow: "hidden",
    zIndex: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    shadowColor: "#0E1F14",
    shadowOpacity: 0.28,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  headerContent: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    fontWeight: "700",
    color: "#FEFFFE",
  },
  notificationButton: {
    padding: 8,
  },
  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: "rgba(209,232,215,0.75)",
    borderWidth: 1,
    borderColor: "rgba(37,107,66,0.35)",
  },
  alertText: {
    marginLeft: 12,
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    fontWeight: "500",
    color: "#0E1F14",
    flex: 1,
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    gap: 16,
  },
  actionCard: {
    width: 168,
    height: 160,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    overflow: "hidden",
  },
  actionCardActive: {
    backgroundColor: "#256B42",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  actionCardInactive: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(37,107,66,0.35)",
  },
  actionText: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
    fontWeight: "700",
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    fontWeight: "700",
    color: "#181C1A",
    marginLeft: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  emptyCard: {
    marginHorizontal: 16,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.72)",
    borderWidth: 1,
    borderColor: "rgba(37,107,66,0.3)",
    overflow: "hidden",
  },
  emptyContent: {
    alignItems: "center",
    paddingVertical: 32,
  },
  emptyText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#3E4941",
    marginTop: 12,
  },
  loanCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 24,
    backgroundColor: "#256B42",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.35)",
  },
  skeletonCard: {
    backgroundColor: "#E4EAE5",
    borderWidth: 1,
    borderColor: "#256B42",
  },
  loanContent: {
    paddingVertical: 18,
  },
  loanHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  loanName: {
    fontFamily: "Inter_500Medium",
    fontSize: 18,
    fontWeight: "500",
    color: "#FEFFFE",
    flex: 1,
  },
  daysBadge: {
    backgroundColor: "#ABF2C1",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  daysText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    fontWeight: "500",
    color: "#02210E",
  },
  loanDate: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#FEFFFE",
    marginBottom: 12,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
  },
  bottomSpacing: {
    height: 100,
  },
});
