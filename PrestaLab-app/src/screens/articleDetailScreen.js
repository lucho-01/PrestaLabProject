import React from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Gloss from "../components/Gloss";

export default function ArticleDetailScreen({ navigation, route }) {
  const { article } = route.params || {};

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{article?.nombre || "Detalle"}</Text>

      <View style={styles.card}>
        <Gloss tone="light" />
        <View style={styles.cardHandle} />

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Serial</Text>
          <Text style={styles.fieldValue}>{article?.serial || "—"}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Nombre</Text>
          <Text style={styles.fieldValue}>{article?.nombre || "—"}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Stock</Text>
          <Text style={styles.fieldValue}>{article?.stock ?? "—"}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Descripción</Text>
          <Text style={styles.fieldValue}>{article?.descripcion || "—"}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.fieldLabel}>Imagen</Text>
          <View style={styles.imagePlaceholder}>
            <MaterialCommunityIcons name="image" size={48} color="#256B42" />
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="#FEFFFE" />
      </TouchableOpacity>

      <View style={styles.bottomSpacing} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FBF6",
  },
  title: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    fontWeight: "700",
    color: "#181C1A",
    paddingHorizontal: 16,
    marginTop: 60,
    marginBottom: 16,
  },
  card: {
    marginHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(37,107,66,0.4)",
    overflow: "hidden",
  },
  cardHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#256B42",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 24,
  },
  field: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#BDCAC0",
  },
  fieldLabel: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    fontWeight: "700",
    color: "#256B42",
    marginBottom: 4,
  },
  fieldValue: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "#181C1A",
    lineHeight: 20,
  },
  imagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: "#DEE4E0",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    borderWidth: 2,
    borderColor: "#256B42",
  },
  backButton: {
    position: "absolute",
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#256B42",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  bottomSpacing: {
    height: 120,
  },
});
