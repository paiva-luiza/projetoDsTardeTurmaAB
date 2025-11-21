import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState, memo, useCallback } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = memo(() => {
  const { width, height } = useWindowDimensions();
  const [pressingLogout, setPressingLogout] = useState(false);
  const navigation = useNavigation();


  const rf = useMemo(
    () => (size) =>
      Math.round(Math.max(size * 0.9, Math.min(size * 1.6, size * (width / 390)))),
    [width]
  );

  const isSmallScreen = width < 360;

  const statsData = useMemo(
    () => 
    []
  );

  const handlePressIn = useCallback(() => setPressingLogout(true), []);
  const handlePressOut = useCallback(() => setPressingLogout(false), []);

 
  const artistImages = [
    { name: 'Jackson do Pandeiro', uri: 'file:///mnt/data/af0b8202fb3538ef8eb954eeb5887240ed21766d.png' },
    { name: 'Nirvana', uri: 'file:///mnt/data/af0b8202fb3538ef8eb954eeb5887240ed21766d.png' },
    { name: 'Marilyn Manson', uri: 'file:///mnt/data/e8b42772e2b9f37b5a1ec70c5adea2cd233a35ff.png' },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <LinearGradient
        colors={['#7F00D5', '#F910A2', '#FDDC00']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={styles.gradient}
      >
        <ScrollView
          contentContainerStyle={{ alignItems: 'center', paddingBottom: rf(30) }}
          showsVerticalScrollIndicator={false}
        >
          {/* back button (posição absoluta para ficar no topo esquerdo) */}
          <TouchableOpacity
            style={[styles.backCircle, { top: rf(12), left: rf(10) }]}
            onPress={() => navigation.goBack()}
          >
            <AntDesign name="arrowleft" size={rf(20)} color="#fff" />
          </TouchableOpacity>

          {/* AVATAR */}
          <View style={{ width: '100%', alignItems: 'center', marginTop: height * 0.03 }}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' }}
              style={{
                width: rf(125),
                height: rf(125),
                borderRadius: rf(70),
                marginBottom: rf(12),
                borderWidth: 4,
                borderColor: '#ffffff',
              }}
            />
          </View>

          {/* NOME E INFOS */}
          <View style={{ alignItems: 'center', marginBottom: rf(6) }}>
            <Text style={[styles.username, { fontSize: rf(26) }]}>Fulano D’ Town</Text>
            <Text style={[styles.email, { fontSize: rf(15) }]}>23 seguidores • 4 seguindo</Text>
            <Text style={[styles.memberSince, { fontSize: rf(14) }]}>@yrcap     @naosouiphone</Text>
          </View>

          {/* CAIXA DE DESCRIÇÃO (centrada e com transparência pro gradiente iluminar) */}
          <View style={[styles.descriptionContainer, { marginTop: rf(10) }]}>
            <Text style={styles.descriptionText}>
              eeeer amo ouçar musga{"\n"}amo tumati tamem
            </Text>
          </View>

          {/* ESTATÍSTICAS */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: rf(22),
              gap: rf(24),
              flexWrap: 'wrap',
              width: '100%',
              paddingHorizontal: rf(20),
            }}
          >
            {statsData.map((item, i) => (
              <View key={i} style={{ alignItems: 'center', minWidth: rf(100), marginBottom: rf(8) }}>
                <Text style={[styles.statNumber, { fontSize: rf(28) }]}>{item.number}</Text>
                <Text style={[styles.statLabel, { fontSize: rf(13) }]}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* TAGS DE GÊNERO */}
          <View style={[styles.genreContainer, { marginTop: rf(18) }]}>
            {["Rock", "Forró", "Metal industrial", "Glam Rock"].map((tag, i) => (
              <TouchableOpacity key={i} style={styles.genreTag} activeOpacity={0.8}>
                <Text style={styles.genreText}>{tag}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* ARTISTAS MAIS OUVIDOS */}
          <View style={styles.artistContainer}>
            <Text style={styles.artistTitle}>Artistas mais ouvidos</Text>

            {artistImages.map((artist, i) => (
              <View key={i} style={styles.artistCard}>
                <Image
                  source={{ uri: artist.uri }}
                  style={styles.artistImg}
                  resizeMode="cover"
                />
                <Text style={styles.artistName}>{artist.name}</Text>
              </View>
            ))}
          </View>

          {/* BOTÃO SAIR */}
          <TouchableOpacity
            activeOpacity={0.9}
            style={[
              styles.logoutButton,
              
            ]}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
          >
   
          </TouchableOpacity>

        </ScrollView>

        {/* FOOTER com ícones/texto (fixo embaixo) */}
      
     
      </LinearGradient>
    </SafeAreaView>
  );
});

ProfileScreen.displayName = 'ProfileScreen';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#ffd3e8' },
  gradient: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  backCircle: {
    position: 'absolute',
    width: 42,
    height: 42,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 20,
  },
  username: {
    fontWeight: '700',
    color: '#ffffff',
  },
  email: {
    color: 'rgba(255,255,255,0.90)',
  },
  memberSince: {
    color: 'rgba(255,255,255,0.80)',
  },

  descriptionContainer: {
    width: '84%',
    backgroundColor: 'rgba(29, 20, 54, 0.45)',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    // sombra leve
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    elevation: 3,
  },
  descriptionText: {
    // use rf inside your file where rf is available; simplified fallback:
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: '500',
  },

  statNumber: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },

  logoutButton: { alignItems: 'center' },
  logoutText: { color: '#fff', fontWeight: 'bold' },

  // Gêneros
genreContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  gap: 10, // espaçamento entre tags
},

genreTag: {
  paddingVertical: 8,
  paddingHorizontal: 16,
  backgroundColor: "rgba(255, 255, 255, 0.18)", // igual ao fundo do botão do Figma
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.25)",
},

genreText: {
  color: "#ffffff",
  fontSize: 13,
  fontWeight: "600",
},


  // Artistas
  artistContainer: {
    marginTop: 22,
    width: "100%",
    paddingHorizontal: 22,
    marginBottom: 6,
  },
  artistTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 12,
  },
  artistCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.20)",
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  artistImg: {
    width: 45,
    height: 45,
    borderRadius: 999,
    marginRight: 12,
  },
  artistName: {
    fontSize: 15,
    color: "#fff",
    fontWeight: "600",
  },


 
});

export default ProfileScreen;

