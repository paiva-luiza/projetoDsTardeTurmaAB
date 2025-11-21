import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState, memo, useCallback } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native"; 

const ProfileScreen = memo(() => {
  const { width } = useWindowDimensions();
  const [pressingLogout, setPressingLogout] = useState(false);
   const navigation = useNavigation(); 

  
  const rf = useMemo(
    () => (size) =>
      Math.round(Math.max(size * 0.9, Math.min(size * 1.6, size * (width / 390)))),
    [width]
  );

  const isSmallScreen = width < 360;

 
  const statsData = useMemo(
    () => [
      { number: 0, label: 'Músicas Curtidas' },
      { number: 0, label: 'Artistas Descobertos' },
      { number: 0, label: 'Playlists Criadas' },
    ],
    []
  );

 
  const handlePressIn = useCallback(() => setPressingLogout(true), []);
  const handlePressOut = useCallback(() => setPressingLogout(false), []);

  return (
    <View style={styles.container}>
     
    <LinearGradient
  colors={['#7F00D5', '#F910A2', '#FDDC00']}
  start={{ x: 0.5, y: 0 }}
  end={{ x: 0.5, y: 1 }}
  style={styles.gradient}
>
  <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
    <AntDesign name="arrowleft" size={20} color="#fff" />
  </TouchableOpacity>

  {/* FOTO DO PERFIL */}
<View style={{
  width: "100%",
  alignItems: "center",
  justifyContent: "center",
  marginTop: rf(40)
}}>
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



<View style={{ alignItems: 'center', gap: rf(6), marginBottom: rf(10) }}>
  <Text style={[styles.username, { fontSize: rf(26), letterSpacing: 0.3 }]}>
    Fulano D’ Town
  </Text>

  <Text style={[styles.email, { fontSize: rf(15), opacity: 0.8 }]}>
    23 seguidores • 4 seguindo
  </Text>

  <Text style={[styles.memberSince, { fontSize: rf(14), color: 'rgba(255,255,255,0.80)' }]}>
    @yrcap     @naosouiphone
  </Text>
</View>
<View style={styles.descriptionContainer}>
  <Text style={styles.descriptionText}>
    eeeer amo ouçar musga
amo tumati tamem 
  </Text>
</View>

  <View
    style={{
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: rf(35),
      gap: rf(30),
      flexWrap: 'wrap',
      width: '100%',
    }}
  >
    {statsData.map((item, i) => (
      <View key={i} style={{ alignItems: 'center', minWidth: rf(100) }}>
        <Text style={[styles.statNumber, { fontSize: rf(30) }]}>{item.number}</Text>
        <Text style={[styles.statLabel, { fontSize: rf(14) }]}>{item.label}</Text>
      </View>
    ))}
  </View>
{/* ===== TAGS DE GÊNERO ===== */}
<View style={styles.genreContainer}>
  {["Rock", "Forró", "Metal industrial", "Glam Rock"].map((tag, i) => (
    <TouchableOpacity key={i} style={styles.genreTag}>
      <Text style={styles.genreText}>{tag}</Text>
    </TouchableOpacity>
  ))}
</View>

{/* ===== ARTISTAS MAIS OUVIDOS ===== */}
<View style={styles.artistContainer}>
  <Text style={styles.artistTitle}>Artistas mais ouvidos</Text>

  {[
    /*
    { name: "Jackson do Pandeiro", img: require("../assets/jackson.png") },
    { name: "Nirvana", img: require("../assets/nirvana.png") },
    { name: "Marilyn Manson", img: require("../assets/manson.png") },
     */
  ].map((artist, i) => (
    <View key={i} style={styles.artistCard}>
      <Image source={artist.img} style={styles.artistImg} />
      <Text style={styles.artistName}>{artist.name}</Text>
    </View>
  ))}
</View>

  <TouchableOpacity
    activeOpacity={0.9}
    style={[
      styles.logoutButton,
      {
        backgroundColor: pressingLogout ? '#d99ac1' : '#F1A7D5',
        transform: [{ scale: pressingLogout ? 0.97 : 1 }],
        paddingVertical: rf(14),
        marginTop: rf(50),
        borderRadius: rf(16),
        width: width * 0.7,
      },
    ]}
    onPressIn={handlePressIn}
    onPressOut={handlePressOut}
  >
    <Text style={[styles.logoutText, { fontSize: rf(17) }]}>Sair da Conta</Text>
  </TouchableOpacity>

  <View style={styles.footer}>
    {['Player', 'Curtidas', 'Perfil'].map((label, i) => (
      <TouchableOpacity key={i} style={styles.footerItem} activeOpacity={0.8}>
        <Text style={styles.footerText}>{label}</Text>
      </TouchableOpacity>
    ))}
  </View>
</LinearGradient>

      
    </View>
   
  );
});

ProfileScreen.displayName = 'ProfileScreen';
const styles = StyleSheet.create({
  // ===== CONTAINER PRINCIPAL =====
  container: { 
    flex: 1, 
    backgroundColor: '#ffd3e8', 
    alignItems: 'center' 
  },

  // ===== BOTÃO DE VOLTAR =====
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
    marginLeft: -2,
  },

  // ===== TEXTOS DO PERFIL (AJUSTADOS AO FIGMA) =====
  username: { 
    fontWeight: 'bold',
    color: '#ffffff',
  },

  email: { 
    color: 'rgba(255,255,255,0.85)' 
  },

  memberSince: { 
    color: 'rgba(255,255,255,0.75)' 
  },

  location: { 
    color: 'rgba(255,255,255,0.75)' 
  },
descriptionContainer: {
  width: '70%',
  height: '15%',
backgroundColor: 'rgba(29, 20, 54, 0.65)', // mais clara
  padding: 18,
  borderRadius: 18,
  alignItems: 'center',
  justifyContent: 'center',

  // CENTRALIZA NO MEIO DA TELA
  alignSelf: 'center',
  marginTop: 20,

  // Sombras estilo Figma
  shadowColor: '#000',
  shadowOpacity: 0.12,
  shadowRadius: 6,
  elevation: 3,
},

descriptionText: {
  fontSize: 25,
  color: '#ffffffff',
  textAlign: 'center',
  fontWeight: '500',

},

  // ===== ESTATÍSTICAS =====
  statNumber: { 
    fontWeight: 'bold', 
    color: '#ffffff' 
  },

  statLabel: { 
    color: 'rgba(255,255,255,0.6)', 
    textAlign: 'center' 
  },

  // ===== BOTÃO LOGOUT =====
  logoutButton: { 
    alignItems: 'center' 
  },

  logoutText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  // ===== GÊNEROS =====
genreContainer: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: 20,
  gap: 12,
},

genreTag: {
  backgroundColor: "rgba(255,255,255,0.20)",
  paddingVertical: 10,
  paddingHorizontal: 18,
  borderRadius: 20,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.3)",
},

genreText: {
  color: "#fff",
  fontWeight: "600",
  fontSize: 14,
},

// ===== ARTISTAS =====
artistContainer: {
  marginTop: 25,
  width: "100%",
  paddingHorizontal: 25,
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
  borderRadius: 50,
  marginRight: 12,
},

artistName: {
  fontSize: 15,
  color: "#fff",
  fontWeight: "600",
},


  // ===== FOOTER =====
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    backgroundColor: '#f7e6f0',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#e5c7da',
  },

  footerItem: { 
    padding: 10 
  },

  footerText: { 
    fontSize: 14, 
    fontWeight: 'bold', 
    color: '#441b34' 
  },
});


export default ProfileScreen;
