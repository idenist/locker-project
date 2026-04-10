import { useEffect, useMemo, useRef, useState } from "react";
import { ScrollView, View } from "react-native";
import { Button, Card, DataTable, Divider, Text } from "react-native-paper";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

import InfoRow from "../components/LockerDetailScreen/InfoRow";
import PhoneValue from "../components/LockerDetailScreen/PhoneValue";
import LockerMap from "../components/LockerDetailScreen/LockerMap";
import ScrollToTopButton from "../components/common/ScrollToTopButton";
import { ProcessedCrgExplnText, ProcessedAddCrgText, ProcessedMthdExpln } from "../components/LockerDetailScreen/ProcessedText"

import styles from "../styles/lockerDetailStyles";
import { formatTime, datetimeFormat, formatLockerSize } from "../utils/formatters";
import { getTodaysDay, getTodayOperationTime } from "../utils/getDateTime";

export default function LockerDetailScreen({ route, navigation }) {
  const baseURL = process.env.EXPO_PUBLIC_BASE_URL;
  const kakaoMapKey = process.env.EXPO_PUBLIC_KAKAO_MAP_JS_KEY;
  const [lockers, setLockers] = useState([]);
  const [showScrollTopButton, setShowScrollTopButton] = useState(false);

  const scrollRef = useRef(null);
  const insets = useSafeAreaInsets();
  const { stdgCd, stlckId } = route.params.locker;

  const handleScroll = (event) => {
    const y = event.nativeEvent.contentOffset.y;
    setShowScrollTopButton(y > 300);
  };

  const handleScrollToTop = () => {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  };

  useEffect(() => {
    fetch(`${baseURL}/lockers/${stdgCd}/${stlckId}`)
      .then((res) => res.json())
      .then((data) => {
        const fetched = data?.data ?? [];
        setLockers(fetched);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [baseURL, stdgCd, stlckId]);

  const locker = lockers[0] ?? null;

  if (!locker) {
    return (
      <View>
        <Text>불러오는 중...</Text>
      </View>
    );
  }

  const sortedLockers = useMemo(() => {
    if (!lockers) return [];

    return [...lockers].sort((a, b) => {
      if (/^\d+$/.test(a.stlckDtlId) && /^\d+$/.test(b.stlckDtlId)) {
        return Number(a.stlckDtlId) - Number(b.stlckDtlId);
      }
      return String(a.stlckDtlId).localeCompare(String(b.stlckDtlId));
    });
  }, [lockers]);

  const todayTime = getTodayOperationTime(locker);

  const remainCount =
    Number(locker.usePsbltyLrgszStlckCnt || 0) +
    Number(locker.usePsbltyMdmszStlckCnt || 0) +
    Number(locker.usePsbltySmlszStlckCnt || 0);

  const fullAddress = `${locker.fcltRoadNmAddr.trim() || ""}${
    locker.fcltLotnoAddr ? `\n(${locker.fcltLotnoAddr.trim()})` : ""
  }`;

    // 실제 API 필드명에 맞게 수정
  const latitude = Number(locker.lat);
  const longitude = Number(locker.lot);

  const hasValidCoords = 
  !Number.isNaN(latitude) && !Number.isNaN(longitude) && latitude != 0 && longitude != 0;

  const handleOpenExternalMap = () => {
    if (!hasValidCoords) return;

    const url = `https://map.kakao.com/link/map/${encodeURIComponent(
      locker.stlckRprsPstnNm || "물품보관함"
    )},${latitude},${longitude}`;

    Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            {locker.stlckRprsPstnNm}
          </Text>
          <Text style={styles.subtitle}>물품보관함 상세정보</Text>
        </View>

        {/* 맨 위 지도 */}
        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text style={styles.sectionTitle}>위치</Text>
            <View style={styles.infoBlock}>
              <Text style={styles.blockLabel}>지역</Text>
              <Text style={styles.blockValue}>{locker.ctpvNm + " " + locker.sggNm}</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoBlock}>
              <Text style={styles.blockLabel}>주소</Text>
              <Text style={styles.blockValue}>{fullAddress}</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoBlock}>
              <Text style={styles.blockLabel}>세부위치</Text>
              <Text style={styles.blockValue}>{locker.stlckDtlPstnNm}</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoBlock}>
              <Text style={styles.blockLabel}>오시는 길</Text>
              <LockerMap
                latitude={latitude}
                longitude={longitude}
                title={locker.stlckRprsPstnNm}
                kakaoMapKey={kakaoMapKey}
                hasValidCoords={hasValidCoords}
              />
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text style={styles.sectionTitle}>실시간 현황</Text>

            <View style={styles.statusBox}>
              <InfoRow
                label="총 보관함 수"
                value={`${remainCount}/${locker.stlckCnt}`}
              />
              <InfoRow
                label="크기별 잔여 현황"
                value={`대형 ${locker.usePsbltyLrgszStlckCnt ?? 0}, 중형 ${locker.usePsbltyMdmszStlckCnt ?? 0 }, 소형 ${locker.usePsbltySmlszStlckCnt ?? 0}`}
              />
            </View>

            <Text style={styles.additionalText}>{datetimeFormat(locker.totDt)}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text style={styles.sectionTitle}>운영 시간</Text>
            <Text variant="bodyMedium">* 오늘은 <Text style={styles.emphasis}>{getTodaysDay()}</Text>이에요</Text>
            <InfoRow
              label="평일"
              value={`${formatTime(locker.wkdyOperBgngTm)} ~ ${(locker.wkdyOperBgngTm > locker.wkdyOperEndTm ? "익일 " : "") + formatTime(locker.wkdyOperEndTm)}`}
            />
            <Divider style={styles.divider} />
            <InfoRow
              label="토요일"
              value={`${formatTime(locker.satOperBgngTm)} ~ ${(locker.satOperBgngTm > locker.satOperEndTm ? "익일 " : "") + formatTime(locker.satOperEndTm)}`}
            />
            <Divider style={styles.divider} />
            <InfoRow
              label="일요일/공휴일"
              value={`${formatTime(locker.lhldyOperBgngTm)} ~ ${(locker.lhldyOperBgngTm > locker.lhldyOperEndTm ? "익일 " : "") + formatTime(locker.lhldyOperEndTm)}`}
            />
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text style={styles.sectionTitle}>보관함 목록 정보</Text>
            <Text variant="bodyMedium">* 크기 단위는 cm × cm × cm입니다</Text>
            <Text variant="bodyMedium">* 크기 정보가 없으면 N으로 표시됩니다</Text>
            <View>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title style={{ flex: 1 }}>ID</DataTable.Title>
                  <DataTable.Title style={{ flex: 1, justifyContent: "center" }}>종류</DataTable.Title>
                  <DataTable.Title style={{ flex: 2, justifyContent: "flex-end" }}>크기(너비 × 깊이 × 높이)</DataTable.Title>
                </DataTable.Header>

                {sortedLockers.map((loc, index) => (
                  <DataTable.Row key={loc.stlckDtlId ?? index} style={{paddingVertical: 10}}>
                    <DataTable.Cell style={{ flex: 1 }}>
                      {loc.stlckDtlId.replace("_DETAIL", "") ?? "-"}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 1, justifyContent: "center" }}>
                      {loc.stlckKndNm ?? "-"}
                    </DataTable.Cell>
                    <DataTable.Cell style={{ flex: 2, justifyContent: "flex-end" }}>
                      <View>
                        {formatLockerSize(loc) ?? "-"}
                      </View>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text style={styles.sectionTitle}>요금 정보</Text>
              {/* <Text style={styles.blockValue}>{locker.utztnCrgExpln}</Text> */}
              <ProcessedCrgExplnText value={locker.utztnCrgExpln}/>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text style={styles.sectionTitle}>추가요금 부과 방식</Text>
            <View>
              <ProcessedAddCrgText value={locker.addCrgExpln}></ProcessedAddCrgText>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text style={styles.sectionTitle}>결제 방법</Text>
            <View>
              <Text>{locker.stlmMnsNm}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text style={styles.sectionTitle}>이용 방법</Text>
            <View style={styles.infoBlock}>
              <Text style={styles.blockLabel}>작동 방식</Text>
              <Text style={styles.blockValue}>{locker.cntrlMthSeNm}</Text>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.infoBlock}>
              <Text style={styles.blockLabel}>설명</Text>
              <ProcessedMthdExpln value={locker.useMthdExpln}/>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="elevated">
            <Card.Content>
              <Text style={styles.sectionTitle}>보관 금지 물품</Text>
              <View style={styles.infoBlock}>
                <Text style={styles.blockValue}>{locker.cntrlMthSeNm === locker.kpngLmtCmdtyExpln ? '정보 없음' : locker.kpngLmtCmdtyExpln}</Text>
              </View>
            </Card.Content>
          </Card>

        <Card style={styles.card} mode="elevated">
          <Card.Content>
            <Text style={styles.sectionTitle}>문의</Text>
            <InfoRow label="관리기관" value={locker.mngInstNm} />
            <Divider style={styles.divider} />
            <InfoRow
              label="관리기관 연락처"
              value={<PhoneValue phone={locker.mngInstTelno} />}
            />
            <Divider style={styles.divider} />
            <InfoRow
              label="고객센터"
              value={<PhoneValue phone={locker.custCntrTelno} />}
            />
          </Card.Content>
        </Card>
      </ScrollView>

      <ScrollToTopButton
        visible={showScrollTopButton}
        onPress={handleScrollToTop}
        bottomOffset={100}
      />

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          mode="contained"
          onPress={() => navigation.goBack()}
          contentStyle={styles.mapButtonContent}
          labelStyle={styles.mapButtonLabel}
          buttonColor="#111827"
        >
          뒤로가기
        </Button>
      </View>
    </SafeAreaView>
    
  );
}