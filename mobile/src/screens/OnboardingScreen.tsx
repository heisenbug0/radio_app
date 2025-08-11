import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const slides = [
  { title: 'Welcome to Afrimeet', subtitle: 'Stay close to your team anywhere', image: require('../../assets/images/logo.png') },
  { title: 'Crystal-clear calls', subtitle: 'Powered by Stream Video SDK', image: require('../../assets/images/logo.png') },
  { title: 'Real-time chat', subtitle: 'Message during your meetings', image: require('../../assets/images/logo.png') },
  { title: 'Your personal room', subtitle: 'Share your personal link securely', image: require('../../assets/images/logo.png') },
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

  const prev = () => setIndex((i) => Math.max(0, i - 1));

  const { width } = Dimensions.get('window');
  const s = slides[index];

  return (
    <View style={{ flex: 1, backgroundColor: '#1C1F2E', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <Image source={s.image} resizeMode="contain" style={{ width: width * 0.6, height: width * 0.6, marginBottom: 24 }} />
      <Text style={{ color: '#FFFFFF', fontSize: 28, fontFamily: 'Nunito_sans_bold', marginBottom: 8, textAlign: 'center' }}>{s.title}</Text>
      <Text style={{ color: '#C9DDFF', fontSize: 16, fontFamily: 'Nunito_sans_regular', marginBottom: 24, textAlign: 'center' }}>{s.subtitle}</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 24 }}>
        {slides.map((_, i) => (
          <View key={i} style={{ width: i === index ? 20 : 8, height: 8, borderRadius: 4, backgroundColor: i === index ? '#0E78F9' : '#252A41' }} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: 12 }}>
        {index > 0 && (
          <TouchableOpacity onPress={prev} style={{ backgroundColor: '#252A41', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_sans_medium' }}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={next} style={{ backgroundColor: '#0E78F9', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 }}>
          <Text style={{ color: '#FFFFFF', fontFamily: 'Nunito_sans_medium' }}>{index < slides.length - 1 ? 'Next' : 'Get Started'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}