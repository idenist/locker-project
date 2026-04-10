import * as Location from "expo-location";
import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import FilterChips from "../components/HomeScreen/FilterChips";
import HeaderSection from "../components/HomeScreen/HeaderSection";
import LockerListCard from "../components/HomeScreen/LockerListCard";
import RecommendationCard from "../components/HomeScreen/RecommendationCard";
import ScrollToTopButton from "../components/common/ScrollToTopButton";

import { getTodayOperationTime } from "../utils/getDateTime";
import { getDistanceFromLatLonInKm } from "../utils/location";

import { styles } from '../styles/homeScreenStyles';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [lockersData, setLockersData] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    setShowScrollTopButton(y > 300);
  };

  const handleScrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  const baseURL = process.env.EXPO_PUBLIC_BASE_URL;
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  
  useEffect(() => {
    const params = "";
    params += searchQuery ? "keyword="+searchQuery+"&" : "";

    fetch(baseURL + '/lockers?' + params)
      .then(res => res.json())
      .then(data => {
        setLockersData(data.data);
      })
      .catch(err => {
        console.error(err);
      });
  }, [searchQuery]);

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== "granted") {
          return;
        }

        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (err) {
        console.error("현재 위치 조회 실패:", err);

        // // 위치 조회 실패시 fallback
        setCurrentLocation({
          latitude: 37.5665,
          longitude: 126.9780,
        });
      }
    };

    getCurrentLocation();
  }, []);

  const filteredLockers = useMemo(() => {
    let result = Array.isArray(lockersData) ? [...lockersData] : [];
    const date = new Date(); // 현재 날짜 및 시간 객체 생성
    const now = date.getMinutes() < 10 ?
      Number(String(date.getHours()) + '0' + String(date.getMinutes())) :
      Number(String(date.getHours()) + String(date.getMinutes()))

    if (selectedFilters.includes("현재 사용 가능한 보관함")) {
      result = result.filter((locker) => {
        const hasEmpty = Number(locker.usePsbltyLrgszStlckCnt) + Number(locker.usePsbltyMdmszStlckCnt) + Number(locker.usePsbltySmlszStlckCnt) > 0
        
        const operationTime = getTodayOperationTime(locker);
        const start = Number(operationTime.start.replace(':', ''));
        const end = Number(operationTime.end.replace("익일 ", "").replace(':', ''));
        
        const nowAvailable = start < end ? (start <= now && now <= end) : (end >= now || now >= start);

        return hasEmpty && nowAvailable;
      });
    }

    if (selectedFilters.includes("대형 가능")) {
      result = result.filter((locker) => 
        locker.usePsbltyLrgszStlckCnt > 0);
    }

    if (currentLocation) {
      result = result
        .map((locker) => ({
          ...locker,
          distanceKm: getDistanceFromLatLonInKm(
            currentLocation.latitude,
            currentLocation.longitude,
            Number(locker.lat),
            Number(locker.lot)
          ),
        }))
        .sort((a, b) => a.distanceKm - b.distanceKm);
    }


    return result;
  }, [lockersData, selectedFilters, currentLocation]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        ref={scrollRef}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <HeaderSection
          searchQuery={searchQuery}
          onChangeSearch={setSearchQuery}
        />
        <FilterChips
          selectedFilters={selectedFilters}
          onChangeFilters={setSelectedFilters}
        />

        <View style={styles.section}>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            내 위치와 가까운 보관소
          </Text>

          <Text variant="bodySmall" style={styles.sectionComment}>
            - 내 위치와 가장 가까운 5개의 보관소를 추천해줘요 {'\n'}
            - 직선 거리는 현재 위치와 보관소 위치를 직선으로 이을 때 거리를 의미하며, 
            실제 이동 거리와는 차이가 있을 수 있습니다.
          </Text>
          
          {filteredLockers.length === 0 ? (
            <Text variant="bodyLarge" style={styles.emptyText}>
              검색 결과가 없습니다
            </Text>
          ) : (
            <>
              <RecommendationCard
                locker={filteredLockers[0]}
                currentLocation={currentLocation}
                filters={selectedFilters}
              />

              {filteredLockers.slice(1, 5).map((locker) => (
                <LockerListCard
                  key={locker.stlckRprsPstnNm}
                  locker={locker}
                  currentLocation={currentLocation}
                />
              ))}
            </>
          )}
        </View>

        <View style={styles.bottomSpace} />
      </ScrollView>

      <ScrollToTopButton
        visible={showScrollTopButton}
        onPress={handleScrollToTop}
        bottomOffset={100}
      />

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          mode="contained"
          onPress={() =>
            navigation.navigate("MapScreen", {
              lockers: filteredLockers,
              currentLocation,
            })
          }
          contentStyle={styles.mapButtonContent}
          labelStyle={styles.mapButtonLabel}
          buttonColor="#111827"
        >
          지도에서 보기
        </Button>
      </View>
    </SafeAreaView>
  );
}