import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Button, Card, Chip, Divider, Icon, Text } from "react-native-paper";
import { getTodayOperationTime } from "../../utils/getDateTime";
import { getDistanceFromLatLonInKm } from "../../utils/location";

export default function RecommendationCard({ locker, currentLocation, filters }) {
  if(!locker)
    return 

  const navigation = useNavigation();
  const remainingCnt = Number(locker.usePsbltyLrgszStlckCnt) + Number(locker.usePsbltyMdmszStlckCnt) + Number(locker.usePsbltySmlszStlckCnt);
  const todayTime = getTodayOperationTime(locker);

  const comment = !filters.length ? "현재 위치에서 가장 가까워요"
  : filters.includes('현재 사용 가능한 보관함') && filters.includes('대형 가능') ? "현재 대형 보관함을 이용할 수 있는 가장 가까운 장소를 찾았어요"
  : filters.includes('현재 사용 가능한 보관함') ? "현재 보관함을 이용할 수 있는 가장 가까운 장소를 찾았어요"
  : "대형 보관함이 있는 가장 가까운 장소를 찾았어요"
  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <Chip style={styles.badge} textStyle={styles.badgeText} compact>
          추천 보관함
        </Chip>

        <Text variant="titleLarge" style={styles.title}>
          { locker.stlckRprsPstnNm }
        </Text>


        <Text variant="bodyMedium" style={[styles.description, {fontWeight: 'bold'}]}>
          {comment}
        </Text>

        <Text variant="bodySmall" style={styles.description}>
          {`${locker.fcltRoadNmAddr.trim()} \n (${locker.fcltLotnoAddr.trim()})`}
        </Text>

        <Divider style={styles.divider} />

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon source="map-marker-distance" size={16} color="#800035" />
            <Text style={styles.undertext}>
              직선 거리:{" "}
              {currentLocation
                ? getDistanceFromLatLonInKm(
                    currentLocation.latitude,
                    currentLocation.longitude,
                    Number(locker.lat),
                    Number(locker.lot)
                  ).toFixed(2) + "km"
                : "위치 정보 수신 불가"}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Icon source="archive" size={16} color="rgb(192, 143, 79)" />
            <Text style={styles.undertext}>
              남은 보관함 수: {remainingCnt}/{locker.stlckCnt}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Icon source="clock-outline" size={16} color="#00862a" />
            <Text style={styles.undertext}>
              {todayTime.label} 이용 가능 시간: {todayTime.start} ~ {todayTime.end}
            </Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => navigation.navigate("LockerDetail", { locker })}
          style={styles.button}
          contentStyle={styles.buttonContent}
          labelStyle={styles.buttonLabel}
          buttonColor="#fdffed"
          textColor="#3636ff"
        >
          상세정보
        </Button>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    marginBottom: 14,
    backgroundColor: "#cdeaff",
    marginTop: 8,
  },
  badge: {
    alignSelf: "flex-start",
    marginBottom: 12,
    backgroundColor: "#19a7ff",
  },
  badgeText: {
    color: "#ffffff",
    fontWeight: "700",
  },
  title: {
    color: "#000080",
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    color: "rgb(0, 0, 0)",
    lineHeight: 20,
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  info: {
    color: "#fff",
    fontSize: 13,
    marginRight: 14,
    marginBottom: 6,
  },
  button: {
    marginTop: 10,
    borderRadius: 14,
  },
  buttonContent: {
    paddingVertical: 6,
  },
  buttonLabel: {
    fontWeight: "700",
  },
    infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 6,
  },
  undertext: {
    color: "#000080",
    fontWeight: "700",
    fontSize: 13,
    marginRight: 14,
    marginBottom: 6,
  },
  divider: {
    backgroundColor: "#ffffff",
    marginBottom: 10
  },
});