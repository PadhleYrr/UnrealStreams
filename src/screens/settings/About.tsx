import {
  View,
  Text,
  TouchableNativeFeedback,
  ToastAndroid,
  Linking,
  Alert,
  Switch,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {Feather} from '@expo/vector-icons';
import {settingsStorage} from '../../lib/storage';
import * as RNFS from '@dr.pogodin/react-native-fs';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import useThemeStore from '../../lib/zustand/themeStore';
import * as Application from 'expo-application';
import {notificationService} from '../../lib/services/Notification';
import {APP_NAME, BRAND} from '../../lib/constants';
import LinearGradient from 'react-native-linear-gradient';

const downloadUpdate = async (url: string, name: string) => {
  await notificationService.requestPermission();
  try {
    if (await RNFS.exists(`${RNFS.DownloadDirectoryPath}/${name}`)) {
      await notificationService.displayUpdateNotification({
        id: 'downloadComplete',
        title: 'Download Completed',
        body: 'Tap to install',
        data: {name: `${name}`, action: 'install'},
      });
      return;
    }
  } catch (error) {}
  const {promise} = RNFS.downloadFile({
    fromUrl: url,
    background: true,
    progressInterval: 1000,
    progressDivider: 1,
    toFile: `${RNFS.DownloadDirectoryPath}/${name}`,
    begin: res => {},
    progress: res => {
      notificationService.showUpdateProgress(
        'Downloading Update',
        `${name}`,
        {
          current: res.bytesWritten,
          max: res.contentLength,
          indeterminate: false,
        },
      );
    },
  });
  promise.then(async res => {
    if (res.statusCode === 200) {
      await notificationService.cancelNotification('updateProgress');
      await notificationService.displayUpdateNotification({
        id: 'downloadComplete',
        title: 'Download Complete',
        body: 'Tap to install',
        data: {name, action: 'install'},
      });
    }
  });
};

export const checkForUpdate = async (
  setUpdateLoading: React.Dispatch<React.SetStateAction<boolean>>,
  autoDownload: boolean,
  showToast: boolean = true,
) => {
  setUpdateLoading(true);
  try {
    const res = await fetch(
      'https://api.github.com/repos/unrealstreams/app/releases/latest',
    );
    const data = await res.json();
    const localVersion = Application.nativeApplicationVersion;
    if (compareVersions(localVersion || '', data.tag_name.replace('v', ''))) {
      ToastAndroid.show('New update available', ToastAndroid.SHORT);
      Alert.alert(`Update v${localVersion} → ${data.tag_name}`, data.body, [
        {text: 'Cancel'},
        {
          text: 'Update',
          onPress: () =>
            autoDownload
              ? downloadUpdate(
                  data?.assets?.[2]?.browser_download_url,
                  data.assets?.[2]?.name,
                )
              : Linking.openURL(data.html_url),
        },
      ]);
    } else {
      showToast && ToastAndroid.show('App is up to date', ToastAndroid.SHORT);
    }
  } catch (error) {
    ToastAndroid.show('Failed to check for update', ToastAndroid.SHORT);
  }
  setUpdateLoading(false);
};

const SectionRow = ({
  children,
  isLast = false,
}: {
  children: React.ReactNode;
  isLast?: boolean;
}) => (
  <View
    style={{
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: BRAND.border,
    }}>
    {children}
  </View>
);

const About = () => {
  const {primary} = useThemeStore(state => state);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [autoDownload, setAutoDownload] = useState(
    settingsStorage.isAutoDownloadEnabled(),
  );
  const [autoCheckUpdate, setAutoCheckUpdate] = useState<boolean>(
    settingsStorage.isAutoCheckUpdateEnabled(),
  );

  return (
    <ScrollView
      style={{flex: 1, backgroundColor: BRAND.dark}}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}>
      {/* Header */}
      <LinearGradient
        colors={[primary + '18', 'transparent']}
        style={{paddingHorizontal: 20, paddingTop: 20, paddingBottom: 24}}>
        <Text
          style={{
            fontSize: 26,
            fontWeight: '800',
            color: BRAND.text,
            letterSpacing: -0.5,
          }}>
          About
        </Text>
        <Text style={{color: BRAND.textMuted, marginTop: 4, fontSize: 14}}>
          {APP_NAME} information & updates
        </Text>
      </LinearGradient>

      <View style={{paddingHorizontal: 16, gap: 12}}>
        {/* App info card */}
        <View
          style={{
            backgroundColor: BRAND.surface,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: BRAND.border,
            overflow: 'hidden',
          }}>
          <SectionRow>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: primary + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="information-outline"
                    size={20}
                    color={primary}
                  />
                </View>
                <Text style={{color: BRAND.text, fontSize: 15, fontWeight: '500'}}>
                  Version
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: primary + '15',
                  paddingHorizontal: 12,
                  paddingVertical: 4,
                  borderRadius: 20,
                  borderWidth: 1,
                  borderColor: primary + '30',
                }}>
                <Text style={{color: primary, fontSize: 13, fontWeight: '700'}}>
                  v{Application.nativeApplicationVersion}
                </Text>
              </View>
            </View>
          </SectionRow>

          <SectionRow>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: primary + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="download-circle-outline"
                    size={20}
                    color={primary}
                  />
                </View>
                <Text style={{color: BRAND.text, fontSize: 15, fontWeight: '500'}}>
                  Auto Install Updates
                </Text>
              </View>
              <Switch
                value={autoDownload}
                onValueChange={() => {
                  setAutoDownload(!autoDownload);
                  settingsStorage.setAutoDownloadEnabled(!autoDownload);
                }}
                thumbColor={autoDownload ? primary : BRAND.textMuted}
                trackColor={{false: BRAND.elevated, true: primary + '50'}}
              />
            </View>
          </SectionRow>

          <SectionRow isLast>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 16,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  flex: 1,
                }}>
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    backgroundColor: primary + '20',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <MaterialCommunityIcons
                    name="bell-ring-outline"
                    size={20}
                    color={primary}
                  />
                </View>
                <View style={{flex: 1}}>
                  <Text
                    style={{
                      color: BRAND.text,
                      fontSize: 15,
                      fontWeight: '500',
                    }}>
                    Check on Startup
                  </Text>
                  <Text
                    style={{
                      color: BRAND.textMuted,
                      fontSize: 12,
                      marginTop: 2,
                    }}>
                    Auto-check for updates when app launches
                  </Text>
                </View>
              </View>
              <Switch
                value={autoCheckUpdate}
                onValueChange={() => {
                  setAutoCheckUpdate(!autoCheckUpdate);
                  settingsStorage.setAutoCheckUpdateEnabled(!autoCheckUpdate);
                }}
                thumbColor={autoCheckUpdate ? primary : BRAND.textMuted}
                trackColor={{false: BRAND.elevated, true: primary + '50'}}
              />
            </View>
          </SectionRow>
        </View>

        {/* Check for updates button */}
        <TouchableNativeFeedback
          onPress={() => checkForUpdate(setUpdateLoading, autoDownload, true)}
          disabled={updateLoading}
          background={TouchableNativeFeedback.Ripple(primary + '20', false)}>
          <LinearGradient
            colors={[primary + '18', primary + '08']}
            style={{
              borderRadius: 16,
              borderWidth: 1,
              borderColor: primary + '30',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
              opacity: updateLoading ? 0.6 : 1,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 12}}>
              <MaterialCommunityIcons
                name="update"
                size={22}
                color={primary}
              />
              <Text
                style={{
                  color: BRAND.text,
                  fontSize: 15,
                  fontWeight: '600',
                }}>
                {updateLoading ? 'Checking...' : 'Check for Updates'}
              </Text>
            </View>
            <Feather name="chevron-right" size={20} color={primary} />
          </LinearGradient>
        </TouchableNativeFeedback>

        {/* App tagline */}
        <View style={{alignItems: 'center', paddingVertical: 16}}>
          <Text
            style={{
              color: BRAND.textMuted,
              fontSize: 12,
              letterSpacing: 2,
              textTransform: 'uppercase',
              fontWeight: '600',
            }}>
            {APP_NAME} • Stream Beyond Limits
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default About;

function compareVersions(localVersion: string, remoteVersion: string): boolean {
  try {
    const local = localVersion.split('.').map(Number);
    const remote = remoteVersion.split('.').map(Number);
    if (remote[0] > local[0]) return true;
    if (remote[0] < local[0]) return false;
    if (remote[1] > local[1]) return true;
    if (remote[1] < local[1]) return false;
    if (remote[2] > local[2]) return true;
    return false;
  } catch (error) {
    return false;
  }
}
