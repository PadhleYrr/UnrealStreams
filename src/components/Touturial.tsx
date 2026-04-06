import {View, Text, StatusBar, TouchableOpacity} from 'react-native';
import React from 'react';
import {useState} from 'react';
import useContentStore from '../lib/zustand/contentStore';
import useThemeStore from '../lib/zustand/themeStore';
import Animated, {FadeIn, FadeInDown, FadeInUp} from 'react-native-reanimated';
import {
  NavigationProp,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import {settingsStorage} from '../lib/storage';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import {RootStackParamList} from '../App';
import {APP_NAME, APP_TAGLINE, BRAND} from '../lib/constants';
import LinearGradient from 'react-native-linear-gradient';

const Tutorial = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const {primary} = useThemeStore(state => state);
  const {provider: currentProvider, installedProviders} = useContentStore(
    state => state,
  );
  const [showTutorial, setShowTutorial] = useState<boolean>(!currentProvider);

  React.useEffect(() => {
    if (
      !currentProvider ||
      !currentProvider.value ||
      !installedProviders ||
      installedProviders.length === 0
    ) {
      setShowTutorial(true);
    } else {
      setShowTutorial(false);
    }
  }, [installedProviders, currentProvider]);

  useFocusEffect(
    React.useCallback(() => {
      StatusBar.setBackgroundColor('transparent');
      StatusBar.setBarStyle('light-content');
      return () => {
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setBarStyle('light-content');
      };
    }, []),
  );

  const handleGoToExtensions = () => {
    if (settingsStorage.isHapticFeedbackEnabled()) {
      ReactNativeHapticFeedback.trigger('effectClick', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
    navigation.navigate('TabStack', {
      screen: 'SettingsStack',
      params: {
        screen: 'Extensions',
      },
    });
  };

  return showTutorial ? (
    <LinearGradient
      colors={['#050811', '#0A0F1E', '#050811']}
      style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      {/* Ambient glow */}
      <View
        style={{
          position: 'absolute',
          top: '20%',
          left: '50%',
          width: 300,
          height: 300,
          borderRadius: 150,
          backgroundColor: primary,
          opacity: 0.06,
          transform: [{translateX: -150}, {translateY: -150}],
        }}
      />

      <Animated.View
        entering={FadeIn.duration(800)}
        style={{
          alignItems: 'center',
          paddingHorizontal: 32,
          maxWidth: 400,
          width: '100%',
        }}>

        {/* Logo mark */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(600)}
          style={{marginBottom: 24}}>
          <View
            style={{
              width: 88,
              height: 88,
              borderRadius: 24,
              backgroundColor: primary + '18',
              borderWidth: 1,
              borderColor: primary + '40',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <MaterialCommunityIcons
              name="play-circle-outline"
              size={48}
              color={primary}
            />
          </View>
        </Animated.View>

        {/* Brand name */}
        <Animated.View entering={FadeInDown.delay(300).duration(600)}>
          <Text
            style={{
              fontSize: 32,
              fontWeight: '800',
              color: '#E8EDF5',
              textAlign: 'center',
              letterSpacing: -0.5,
              marginBottom: 6,
            }}>
            {APP_NAME}
          </Text>
          <Text
            style={{
              fontSize: 13,
              color: primary,
              textAlign: 'center',
              letterSpacing: 3,
              textTransform: 'uppercase',
              marginBottom: 32,
              fontWeight: '600',
            }}>
            {APP_TAGLINE}
          </Text>
        </Animated.View>

        {/* Card */}
        <Animated.View
          entering={FadeInUp.delay(400).duration(600)}
          style={{
            backgroundColor: '#0D1117',
            borderRadius: 20,
            padding: 24,
            width: '100%',
            borderWidth: 1,
            borderColor: '#1E2738',
            marginBottom: 24,
          }}>
          <View style={{alignItems: 'center', marginBottom: 16}}>
            <MaterialCommunityIcons
              name="puzzle-outline"
              size={36}
              color={BRAND.textMuted}
            />
          </View>
          <Text
            style={{
              color: '#E8EDF5',
              fontSize: 18,
              fontWeight: '700',
              textAlign: 'center',
              marginBottom: 10,
            }}>
            No Provider Installed
          </Text>
          <Text
            style={{
              color: '#6B7A99',
              fontSize: 14,
              textAlign: 'center',
              lineHeight: 22,
            }}>
            Install a streaming provider to start watching. Providers unlock
            access to movies, shows, and more.
          </Text>
        </Animated.View>

        {/* CTA Button */}
        <Animated.View
          entering={FadeInUp.delay(500).duration(600)}
          style={{width: '100%'}}>
          <TouchableOpacity
            onPress={handleGoToExtensions}
            activeOpacity={0.85}
            style={{
              borderRadius: 14,
              overflow: 'hidden',
            }}>
            <LinearGradient
              colors={[primary, primary + 'CC']}
              start={{x: 0, y: 0}}
              end={{x: 1, y: 0}}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 16,
                paddingHorizontal: 24,
                gap: 10,
              }}>
              <MaterialCommunityIcons name="download" size={20} color="#000" />
              <Text
                style={{
                  color: '#000',
                  fontWeight: '800',
                  fontSize: 15,
                  letterSpacing: 0.3,
                }}>
                Browse Providers
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </LinearGradient>
  ) : null;
};

export default Tutorial;
