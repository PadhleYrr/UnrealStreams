import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  TouchableNativeFeedback,
  ScrollView,
  Dimensions,
} from 'react-native';
import React, {useCallback, useMemo} from 'react';
import {
  settingsStorage,
  cacheStorageService,
  ProviderExtension,
} from '../../lib/storage';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import useContentStore from '../../lib/zustand/contentStore';
import {
  NativeStackScreenProps,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import {SettingsStackParamList, TabStackParamList} from '../../App';
import {
  MaterialCommunityIcons,
  Feather,
  MaterialIcons,
} from '@expo/vector-icons';
import useThemeStore from '../../lib/zustand/themeStore';
import useWatchHistoryStore from '../../lib/zustand/watchHistrory';
import Animated, {FadeInDown, Layout} from 'react-native-reanimated';
import {useNavigation} from '@react-navigation/native';
import RenderProviderFlagIcon from '../../components/RenderProviderFLagIcon';
import {BRAND, APP_NAME} from '../../lib/constants';
import LinearGradient from 'react-native-linear-gradient';

type Props = NativeStackScreenProps<SettingsStackParamList, 'Settings'>;

interface SettingsItemProps {
  icon: string;
  iconFamily?: 'MaterialCommunityIcons' | 'MaterialIcons' | 'Feather';
  label: string;
  onPress: () => void;
  primary: string;
  isLast?: boolean;
  danger?: boolean;
}

const SettingsItem = ({
  icon,
  iconFamily = 'MaterialCommunityIcons',
  label,
  onPress,
  primary,
  isLast = false,
  danger = false,
}: SettingsItemProps) => {
  const iconColor = danger ? '#FF3D71' : primary;
  const IconComponent =
    iconFamily === 'MaterialIcons'
      ? MaterialIcons
      : iconFamily === 'Feather'
      ? Feather
      : MaterialCommunityIcons;

  return (
    <View
      style={{
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: BRAND.border,
      }}>
      <TouchableNativeFeedback
        onPress={onPress}
        background={TouchableNativeFeedback.Ripple(primary + '15', false)}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            paddingVertical: 14,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 14}}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: iconColor + '18',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <IconComponent name={icon as any} size={19} color={iconColor} />
            </View>
            <Text
              style={{
                color: danger ? '#FF3D71' : BRAND.text,
                fontSize: 15,
                fontWeight: '500',
              }}>
              {label}
            </Text>
          </View>
          <Feather name="chevron-right" size={18} color={BRAND.textMuted} />
        </View>
      </TouchableNativeFeedback>
    </View>
  );
};

const SectionCard = ({children}: {children: React.ReactNode}) => (
  <View
    style={{
      backgroundColor: BRAND.surface,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: BRAND.border,
      overflow: 'hidden',
      marginBottom: 12,
    }}>
    {children}
  </View>
);

const SectionLabel = ({label}: {label: string}) => (
  <Text
    style={{
      color: BRAND.textMuted,
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      marginBottom: 8,
      marginTop: 4,
      paddingHorizontal: 4,
    }}>
    {label}
  </Text>
);

const Settings = ({navigation}: Props) => {
  const tabNavigation =
    useNavigation<NativeStackNavigationProp<TabStackParamList>>();
  const {primary} = useThemeStore(state => state);
  const {provider, setProvider, installedProviders} = useContentStore(
    state => state,
  );
  const {clearHistory} = useWatchHistoryStore(state => state);

  const handleProviderSelect = useCallback(
    (item: ProviderExtension) => {
      setProvider(item);
      if (settingsStorage.isHapticFeedbackEnabled()) {
        ReactNativeHapticFeedback.trigger('virtualKey', {
          enableVibrateFallback: true,
          ignoreAndroidSystemSettings: false,
        });
      }
      tabNavigation.navigate('HomeStack');
    },
    [setProvider, tabNavigation],
  );

  const renderProviderItem = useCallback(
    (item: ProviderExtension, isSelected: boolean) => (
      <TouchableOpacity
        key={item.value}
        onPress={() => handleProviderSelect(item)}
        activeOpacity={0.7}
        style={{
          marginRight: 10,
          borderRadius: 12,
          borderWidth: 1.5,
          borderColor: isSelected ? primary : BRAND.border,
          backgroundColor: isSelected ? primary + '15' : BRAND.elevated,
          width: Dimensions.get('window').width * 0.28,
          height: 70,
          overflow: 'hidden',
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 8,
          }}>
          <RenderProviderFlagIcon type={item.type} />
          <Text
            numberOfLines={1}
            style={{
              color: isSelected ? primary : BRAND.text,
              fontSize: 11,
              fontWeight: '600',
              textAlign: 'center',
              marginTop: 6,
            }}>
            {item.display_name}
          </Text>
          {isSelected && (
            <View style={{position: 'absolute', top: 6, right: 6}}>
              <MaterialIcons name="check-circle" size={14} color={primary} />
            </View>
          )}
        </View>
      </TouchableOpacity>
    ),
    [handleProviderSelect, primary],
  );

  const providersList = useMemo(
    () =>
      installedProviders.map(item =>
        renderProviderItem(item, provider.value === item.value),
      ),
    [installedProviders, provider.value, renderProviderItem],
  );

  const clearCacheHandler = useCallback(() => {
    if (settingsStorage.isHapticFeedbackEnabled()) {
      ReactNativeHapticFeedback.trigger('virtualKey', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
    cacheStorageService.clearAll();
  }, []);

  const clearHistoryHandler = useCallback(() => {
    if (settingsStorage.isHapticFeedbackEnabled()) {
      ReactNativeHapticFeedback.trigger('virtualKey', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
    clearHistory();
  }, [clearHistory]);

  return (
    <Animated.ScrollView
      style={{flex: 1, backgroundColor: BRAND.dark}}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>

      {/* Header */}
      <LinearGradient
        colors={[primary + '14', 'transparent']}
        style={{paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24}}>
        <Text
          style={{
            fontSize: 28,
            fontWeight: '800',
            color: BRAND.text,
            letterSpacing: -0.5,
          }}>
          Settings
        </Text>
        <Text style={{color: BRAND.textMuted, marginTop: 4, fontSize: 14}}>
          Customize your {APP_NAME} experience
        </Text>
      </LinearGradient>

      <View style={{paddingHorizontal: 16}}>
        {/* Provider section */}
        <Animated.View entering={FadeInDown.delay(50).springify()}>
          <SectionLabel label="Content Source" />
          <SectionCard>
            <View style={{padding: 14}}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{paddingRight: 6}}>
                {providersList}
                {installedProviders.length === 0 && (
                  <Text style={{color: BRAND.textMuted, fontSize: 13, padding: 8}}>
                    No providers installed
                  </Text>
                )}
              </ScrollView>
            </View>
            <View style={{borderTopWidth: 1, borderTopColor: BRAND.border}}>
              <SettingsItem
                icon="puzzle"
                label="Provider Manager"
                onPress={() => navigation.navigate('Extensions')}
                primary={primary}
                isLast
              />
            </View>
          </SectionCard>
        </Animated.View>

        {/* Options */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <SectionLabel label="Options" />
          <SectionCard>
            <SettingsItem
              icon="folder-download"
              label="Downloads"
              onPress={() => navigation.navigate('Downloads')}
              primary={primary}
            />
            <SettingsItem
              icon="subtitles"
              label="Subtitle Style"
              onPress={() => navigation.navigate('SubTitlesPreferences')}
              primary={primary}
            />
            <SettingsItem
              icon="history"
              label="Watch History"
              onPress={() => navigation.navigate('WatchHistoryStack')}
              primary={primary}
            />
            <SettingsItem
              icon="room-preferences"
              iconFamily="MaterialIcons"
              label="Preferences"
              onPress={() => navigation.navigate('Preferences')}
              primary={primary}
              isLast
            />
          </SectionCard>
        </Animated.View>

        {/* Data Management */}
        <Animated.View entering={FadeInDown.delay(150).springify()}>
          <SectionLabel label="Data" />
          <SectionCard>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: 1,
                borderBottomColor: BRAND.border,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 14}}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: '#FF3D7118',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="cached"
                    size={19}
                    color="#FF3D71"
                  />
                </View>
                <Text style={{color: BRAND.text, fontSize: 15, fontWeight: '500'}}>
                  Clear Cache
                </Text>
              </View>
              <TouchableOpacity
                onPress={clearCacheHandler}
                style={{
                  backgroundColor: '#FF3D7120',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#FF3D7140',
                }}>
                <MaterialCommunityIcons
                  name="delete-sweep-outline"
                  size={18}
                  color="#FF3D71"
                />
              </TouchableOpacity>
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: 16,
                paddingVertical: 14,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 14}}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: '#FF3D7118',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="history"
                    size={19}
                    color="#FF3D71"
                  />
                </View>
                <Text style={{color: BRAND.text, fontSize: 15, fontWeight: '500'}}>
                  Clear Watch History
                </Text>
              </View>
              <TouchableOpacity
                onPress={clearHistoryHandler}
                style={{
                  backgroundColor: '#FF3D7120',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: '#FF3D7140',
                }}>
                <MaterialCommunityIcons
                  name="delete-sweep-outline"
                  size={18}
                  color="#FF3D71"
                />
              </TouchableOpacity>
            </View>
          </SectionCard>
        </Animated.View>

        {/* About */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <SectionLabel label="About" />
          <SectionCard>
            <SettingsItem
              icon="information-outline"
              label="About UnrealStreams"
              onPress={() => navigation.navigate('About')}
              primary={primary}
              isLast
            />
          </SectionCard>
        </Animated.View>
      </View>
    </Animated.ScrollView>
  );
};

export default Settings;
