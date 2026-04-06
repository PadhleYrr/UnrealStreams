import {Image, Pressable, Text, TouchableOpacity, View} from 'react-native';
import React, {memo, useCallback} from 'react';
import type {Post} from '../lib/providers/types';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {HomeStackParamList} from '../App';
import useContentStore from '../lib/zustand/contentStore';
import {FlashList} from '@shopify/flash-list';
import SkeletonLoader from './Skeleton';
import useThemeStore from '../lib/zustand/themeStore';
import {BRAND} from '../lib/constants';
import {Feather} from '@expo/vector-icons';

const Slider = ({
  isLoading,
  title,
  posts,
  filter,
  providerValue,
  isSearch = false,
  error,
}: {
  isLoading: boolean;
  title: string;
  posts: Post[];
  filter: string;
  providerValue?: string;
  isSearch?: boolean;
  error?: string;
}): React.ReactElement => {
  const {provider} = useContentStore(state => state);
  const {primary} = useThemeStore(state => state);
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const [isSelected, setSelected] = React.useState('');

  const handleMorePress = useCallback(() => {
    navigation.navigate('ScrollList', {
      title: title,
      filter: filter,
      providerValue: providerValue,
      isSearch: isSearch,
    });
  }, [navigation, title, filter, providerValue, isSearch]);

  const handleItemPress = useCallback(
    (item: Post) => {
      setSelected('');
      navigation.navigate('Info', {
        link: item.link,
        provider: item.provider || providerValue || provider?.value,
        poster: item?.image,
      });
    },
    [navigation, providerValue, provider?.value],
  );

  const renderItem = useCallback(
    ({item}: {item: Post}) => (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={e => {
          e.stopPropagation();
          handleItemPress(item);
        }}
        style={{marginRight: 10}}>
        <View
          style={{
            borderRadius: 10,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: BRAND.border,
          }}>
          <Image
            source={{
              uri:
                item?.image ||
                'https://placehold.jp/24/0D1117/6B7A99/100x150.png?text=US',
            }}
            style={{width: 110, height: 160}}
          />
        </View>
        <Text
          style={{
            color: BRAND.textMuted,
            fontSize: 11,
            textAlign: 'center',
            marginTop: 6,
            width: 110,
            fontWeight: '500',
          }}
          numberOfLines={1}>
          {item.title.length > 16 ? `${item.title.slice(0, 16)}...` : item.title}
        </Text>
      </TouchableOpacity>
    ),
    [handleItemPress],
  );

  const keyExtractor = useCallback((item: Post) => item.link, []);

  return (
    <Pressable onPress={() => setSelected('')} style={{marginTop: 20, paddingHorizontal: 14}}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
          <View
            style={{
              width: 3,
              height: 18,
              backgroundColor: primary,
              borderRadius: 2,
            }}
          />
          <Text
            style={{
              color: BRAND.text,
              fontSize: 16,
              fontWeight: '700',
              letterSpacing: -0.2,
            }}
            numberOfLines={1}>
            {title}
          </Text>
        </View>
        {filter !== 'recent' && (
          <TouchableOpacity
            onPress={handleMorePress}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
              backgroundColor: primary + '15',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 20,
            }}>
            <Text style={{color: primary, fontSize: 12, fontWeight: '600'}}>
              See all
            </Text>
            <Feather name="chevron-right" size={12} color={primary} />
          </TouchableOpacity>
        )}
      </View>
      {isLoading ? (
        <View style={{flexDirection: 'row', gap: 10}}>
          {Array.from({length: 6}).map((_, index) => (
            <View key={index} style={{gap: 6}}>
              <SkeletonLoader height={160} width={110} />
              <SkeletonLoader height={10} width={110} />
            </View>
          ))}
        </View>
      ) : (
        <FlashList
          estimatedItemSize={120}
          showsHorizontalScrollIndicator={false}
          data={posts}
          extraData={isSelected}
          horizontal
          contentContainerStyle={{paddingBottom: 8}}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          removeClippedSubviews={true}
          drawDistance={300}
          ListFooterComponent={
            !isLoading && error ? (
              <View style={{width: 200, justifyContent: 'center', alignItems: 'center', height: 160}}>
                <Text style={{color: '#FF3D71', textAlign: 'center', fontSize: 13}}>{error}</Text>
              </View>
            ) : !isLoading && posts.length === 0 ? (
              <View style={{width: 200, justifyContent: 'center', alignItems: 'center', height: 160}}>
                <Text style={{color: BRAND.textMuted, textAlign: 'center', fontSize: 13}}>
                  No content found
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </Pressable>
  );
};

export default memo(Slider);
