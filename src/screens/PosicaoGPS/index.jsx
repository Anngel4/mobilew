import React, { useState, useCallback } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Alert, Button, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";

export default function PosicaoGPSScreen() {
  const [endereco, setEndereco] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);

  // Função para buscar a localização atual
  async function buscarLocalizacao() {
    try {
      setLoading(true);
      setErrorMsg(null);
      setPermissionDenied(false);

      //Pede permissão
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        setErrorMsg("Permissão para acessar a localização foi negada no dispositivo.");
        setPermissionDenied(true);
        setLoading(false);
        return;
      }

      // Obter a localização
      const tempLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = tempLocation.coords;

      // 3. Converte em endereço
      const resultado = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (resultado && resultado.length > 0) {
        setEndereco(resultado[0]);
      } else {
        setErrorMsg("Não foi possível encontrar o endereço.");
      }
    } catch (error) {
      console.log("Erro ao obter localização:", error);
      setErrorMsg("Erro ao obter a localização.");
    } finally {
      setLoading(false);
    }
  }

  // Função para disparar a pergunta ao usuário
  const pedirConfirmacao = useCallback(() => {
    setEndereco(null);
    setErrorMsg(null);

    Alert.alert(
      "Uso de Localização",
      "Deseja permitir que o aplicativo obtenha a sua localização atual agora?",
      [
        {
          text: "Não",
          style: "cancel",
          onPress: () => {
            setErrorMsg("Busca de localização cancelada pelo usuário.");
            setLoading(false);
          },
        },
        {
          text: "Sim",
          onPress: () => buscarLocalizacao(),
        },
      ],
      { cancelable: false }
    );
  }, []);

  // Executará toda vez que entrar nessa tela
  useFocusEffect(
    useCallback(() => {
      pedirConfirmacao();
    }, [pedirConfirmacao])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.titleScreen}>Localização</Text>

          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1E293B" />
              <Text style={styles.paragraph}>Obtendo localização...</Text>
            </View>
          )}

          {errorMsg && !loading && (
            <View style={{ alignItems: "center", gap: 12 }}>
              <Text style={styles.errorText}>{errorMsg}</Text>

              {permissionDenied ? (
                <Button
                  title="Abrir Configurações"
                  onPress={() => Linking.openSettings()}
                />
              ) : (
                <Button
                  title="Tentar Novamente"
                  onPress={() => pedirConfirmacao()}
                />
              )}
            </View>
          )}

          {endereco && !loading && (
            <View style={styles.formulario}>
              <View style={styles.linha}>
                <Text style={styles.label}>Rua:</Text>
                <Text style={styles.valor}>
                  {endereco.street || endereco.name || "Não informado."}
                </Text>
              </View>

              <View style={styles.linha}>
                <Text style={styles.label}>Número:</Text>
                <Text style={styles.valor}>
                  {endereco.streetNumber || "S/N"}
                </Text>
              </View>

              <View style={styles.linha}>
                <Text style={styles.label}>Bairro:</Text>
                <Text style={styles.valor}>
                  {endereco.district || endereco.subregion || "Não informado."}
                </Text>
              </View>

              <View style={styles.linha}>
                <Text style={styles.label}>CEP:</Text>
                <Text style={styles.valor}>
                  {endereco.postalCode || "Não informado."}
                </Text>
              </View>

              <View style={styles.linha}>
                <Text style={styles.label}>Cidade:</Text>
                <Text style={styles.valor}>
                  {endereco.city || "Não informado."}
                </Text>
              </View>

              <View style={styles.linha}>
                <Text style={styles.label}>UF:</Text>
                <Text style={styles.valor}>
                  {endereco.region || "Não informado."}
                </Text>
              </View>

            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F6F7F8"
  },
  container: {
    flex: 1,
    backgroundColor: "#F6F7F8",
    justifyContent: "center",
    alignItems: "center"
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    width: "100%",
    alignItems: "center"
  },
  titleScreen: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 20
  },
  loadingContainer: { 
    alignItems: "center", 
    gap: 10 },
  paragraph: { 
    fontSize: 16, 
    textAlign: "center", 
    color: "#475569" 
  },
  errorText: { 
    fontSize: 16, 
    textAlign: "center", 
    color: "#B12727" 
  },
  formulario: {
    width: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  linha: { 
    flexDirection: "row", 
    marginBottom: 12 
  },
  label: { 
    width: 80, 
    fontSize: 14, 
    fontWeight: "bold", 
    color: "#1E293B" 
  },
  valor: { 
    flex: 1, 
    fontSize: 14, 
    color: "#475569" 
  },
});