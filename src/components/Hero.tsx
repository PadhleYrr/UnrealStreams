import Animated, {FadeIn, FadeInDown} from 'react-native-reanimated';
import React, {memo, useState, useCallback} from 'react';
import {
  Keyboard,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {HomeStackParamList, SearchStackParamList} from '../App';
import useContentStore from '../lib/zustand/contentStore';
import useHeroStore from '../lib/zustand/herostore';
import {settingsStorage} from '../lib/storage';
import {Feather} from '@expo/vector-icons';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useHeroMetadata} from '../lib/hooks/useHomePageData';
import {BRAND, APP_NAME} from '../lib/constants';

interface HeroProps {
  isDrawerOpen: boolean;
  onOpenDrawer: () => void;
}

const Hero = memo(({isDrawerOpen, onOpenDrawer}: HeroProps) => {
  const [searchActive, setSearchActive] = useState(false);
  const {provider} = useContentStore(state => state);
  const {hero} = useHeroStore(state => state);

  const [showHamburgerMenu] = useState(() =>
    settingsStorage.showHamburgerMenu(),
  );
  const [isDrawerDisabled] = useState(
    () => settingsStorage.getBool('disableDrawer') || false,
  );

  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const searchNavigation =
    useNavigation<NativeStackNavigationProp<SearchStackParamList>>();

  const {
    data: heroData,
    isLoading,
    error,
  } = useHeroMetadata(hero?.link || '', provider.value);

  const handleKeyboardHide = useCallback(() => {
    setSearchActive(false);
  }, []);

  React.useEffect(() => {
    const subscription = Keyboard.addListener(
      'keyboardDidHide',
      handleKeyboardHide,
    );
    return () => subscription?.remove();
  }, [handleKeyboardHide]);

  const handleSearchSubmit = useCallback(
    (text: string) => {
      if (text.startsWith('https://')) {
        navigation.navigate('Info', {link: text});
      } else {
        searchNavigation.navigate('ScrollList', {
          providerValue: provider.value,
          filter: text,
          title: provider.display_name,
          isSearch: true,
        });
      }
    },
    [navigation, searchNavigation, provider.value, provider.display_name],
  );

  const handlePlayPress = useCallback(() => {
    if (hero?.link) {
      navigation.navigate('Info', {
        link: hero.link,
        provider: provider.value,
        poster: heroData?.image || heroData?.poster || heroData?.background,
      });
    }
  }, [navigation, hero?.link, provider.value, heroData]);

  const imageSource = React.useMemo(() => {
    const fallbackImage =
      'https://placehold.jp/24/0D1117/6B7A99/500x500.png?text=UnrealStreams';
    if (!heroData) return {uri: fallbackImage};
    return {
      uri:
        heroData.background ||
        heroData.image ||
        heroData.poster ||
        fallbackImage,
    };
  }, [heroData]);

  const displayGenres = React.useMemo(() => {
    if (!heroData) return [];
    return (heroData.genre || heroData.tags || []).slice(0, 3);
  }, [heroData]);

  return (
    <View style={{height: 520, position: 'relative'}}>
      {/* Top bar */}
      <View
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 30,
          paddingTop: 48,
          paddingHorizontal: 16,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {!searchActive && (
          <>
            <View
              style={{
                opacity:
                  showHamburgerMenu && !isDrawerDisabled ? 1 : 0,
              }}>
              <Pressable
                style={{opacity: isDrawerOpen ? 0 : 1}}
                onPress={onOpenDrawer}>
                <Ionicons name="menu-sharp" size={26} color={BRAND.text} />
              </Pressable>
            </View>

            {/* App name badge */}
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                alignItems: 'center',
              }}>
              <Text
                style={{
                  color: BRAND.text,
                  fontSize: 18,
                  fontWeight: '800',
                  letterSpacing: 0.5,
                }}>
                {APP_NAME}
              </Text>
            </View>

            <Pressable
              onPress={() => setSearchActive(true)}
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255,255,255,0.08)',
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.12)',
              }}>
              <Feather name="search" size={18} color={BRAND.text} />
            </Pressable>
          </>
        )}

        {searchActive && (
          <Animated.View
            entering={FadeIn.duration(250)}
            style={{flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10}}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: BRAND.elevated,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: BRAND.border,
                paddingHorizontal: 14,
                height: 44,
              }}>
              <Feather name="search" size={16} color={BRAND.textMuted} />
              <TextInput
                onBlur={() => setSearchActive(false)}
                autoFocus={true}
                onSubmitEditing={e => handleSearchSubmit(e.nativeEvent.text)}
                placeholder={`Search ${provider.display_name}…`}
                style={{
                  flex: 1,
                  color: BRAND.text,
                  fontSize: 15,
                  marginLeft: 8,
                }}
                placeholderTextColor={BRAND.textMuted}
              />
            </View>
            <TouchableOpacity onPress={() => setSearchActive(false)}>
              <Text style={{color: BRAND.textMuted, fontSize: 14}}>Cancel</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>

      {/* Hero image */}
      {isLoading ? (
        <View style={{flex: 1, backgroundColor: BRAND.surface}} />
      ) : (
        <Image
          source={imageSource}
          style={{width: '100%', height: '100%', resizeMode: 'cover'}}
        />
      )}

      {/* Gradient overlay */}
      <LinearGradient
        colors={[
          'rgba(5,8,17,0.15)',
          'rgba(5,8,17,0.4)',
          'rgba(5,8,17,0.92)',
          BRAND.dark,
        ]}
        locations={[0, 0.4, 0.8, 1]}
        style={{position: 'absolute', inset: 0}}
      />

      {/* Side gradient for depth */}
      <LinearGradient
        colors={['transparent', 'rgba(5,8,17,0.5)']}
        start={{x: 1, y: 0}}
        end={{x: 0, y: 0}}
        style={{position: 'absolute', inset: 0}}
      />

      {/* Hero content */}
      <View
        style={{
          position: 'absolute',
          bottom: 28,
          left: 0,
          right: 0,
          paddingHorizontal: 20,
          zIndex: 20,
        }}>
        {!isLoading && heroData && (
          <Animated.View
            entering={FadeInDown.duration(500)}
            style={{alignItems: 'center', gap: 12}}>
            {heroData.logo ? (
              <Image
                source={{uri: heroData.logo}}
                style={{width: 220, height: 90, resizeMode: 'contain'}}
              />
            ) : (
              <Text
                style={{
                  color: BRAND.text,
                  fontSize: 24,
                  fontWeight: '800',
                  textAlign: 'center',
                  letterSpacing: -0.5,
                }}>
                {heroData.name || heroData.title}
              </Text>
            )}

            {displayGenres.length > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 6,
                  flexWrap: 'wrap',
                  justifyContent: 'center',
                }}>
                {displayGenres.map((genre: string, index: number) => (
                  <View
                    key={index}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      paddingHorizontal: 10,
                      paddingVertical: 3,
                      borderRadius: 20,
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.15)',
                    }}>
                    <Text
                      style={{
                        color: 'rgba(255,255,255,0.8)',
                        fontSize: 11,
                        fontWeight: '600',
                        letterSpacing: 0.5,
                      }}>
                      {genre}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {hero?.link && (
              <View style={{flexDirection: 'row', gap: 10, marginTop: 4}}>
                <TouchableOpacity
                  onPress={handlePlayPress}
                  activeOpacity={0.85}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: BRAND.text,
                    paddingHorizontal: 28,
                    paddingVertical: 12,
                    borderRadius: 12,
                  }}>
                  <FontAwesome name="play" size={14} color="#050811" />
                  <Text
                    style={{
                      color: '#050811',
                      fontWeight: '800',
                      fontSize: 15,
                      letterSpacing: 0.2,
                    }}>
                    Play Now
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handlePlayPress}
                  activeOpacity={0.85}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    backgroundColor: 'rgba(255,255,255,0.12)',
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.2)',
                  }}>
                  <Feather name="info" size={15} color={BRAND.text} />
                  <Text
                    style={{
                      color: BRAND.text,
                      fontWeight: '700',
                      fontSize: 15,
                    }}>
                    Details
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </Animated.View>
        )}

        {isLoading && (
          <View style={{alignItems: 'center', gap: 10}}>
            <View
              style={{
                height: 80,
                width: 200,
                backgroundColor: BRAND.elevated,
                borderRadius: 8,
              }}
            />
            <View
              style={{
                height: 44,
                width: 140,
                backgroundColor: BRAND.elevated,
                borderRadius: 12,
              }}
            />
          </View>
        )}

        {error && !isLoading && (
          <View style={{alignItems: 'center'}}>
            <Text
              style={{
                color: BRAND.text,
                fontSize: 22,
                fontWeight: '800',
                textAlign: 'center',
              }}>
              {hero?.title || 'Content Unavailable'}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
});

Hero.displayName = 'Hero';
export default Hero;
