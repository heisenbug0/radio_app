import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const slides = [
  { title: 'Welcome to Afrimeet', subtitle: 'Simple, secure meetings', image: require('../../assets/images/logo.png') },
  { title: 'Video calls', subtitle: 'High-quality calls powered by Stream', image: require('../../assets/images/home_banner.svg') },
  { title: 'Chat in calls', subtitle: 'Share messages during your calls', image: require('../../assets/images/logo.png') },
];

export default function OnboardingScreen({ navigation }: any) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    (async () => {
      const seen = await SecureStore.getItemAsync('onboarding_seen');
      if (seen) navigation.replace('SignIn');
    })();
  }, []);

  const next = async () => {
    if (index < slides.length - 1) setIndex(index + 1);
    else {
      await SecureStore.setItemAsync('onboarding_seen', 'true');
      navigation.replace('SignIn');
    }
  };

  const { width } = Dimensions.get('window');
  const s = slides[index];

  return (
    <View style={{ flex: 1, backgroundColor: '#1C1F2E', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Text style={{ color: '#FFFFFF', fontSize: 28, fontFamily: 'Nunito_sans_bold', marginBottom: 8 }}>{s.title}</Text>
      <Text style={{ color: '#C9DDFF', fontSize: 16, fontFamily: 'Nunito_sans_regular', marginBottom: 24 }}>{s.subtitle}</Text>
      <Image source={s.image} resizeMode="contain" style={{ width: width * 0.7, height: width * 0.7, marginBottom: 32 }} />
      <TouchableOpacity onPress={next} style={{ backgroundColor: '#0E78F9', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 8 }}>
        <Text style={{ color: '#FFFFFF', fontSize: 16, fontFamily: 'Nunito_sans_medium' }}>{index < slides.length - 1 ? 'Next' : 'Get Started'}</Text>
      </TouchableOpacity>
    </View>
  );
}