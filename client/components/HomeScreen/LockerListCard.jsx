import { useNavigation } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { Button, Card, Text, Icon } from "react-native-paper";

import { getTodaysDay, getTodayOperationTime } from "../../utils/getDateTime";
import { getDistanceFromLatLonInKm } from "../../utils/location"

export default function LockerListCard({ locker, currentLocation }) {
  const navigation = useNavigation();
  const todaysDay = getTodaysDay();
  const remainingCnt = Number(locker.usePsbltyLrgszStlckCnt) + Number(locker.usePsbltyMdmszStlckCnt) + Number(locker.usePsbltySmlszStlckCnt);
  const todayTime = getTodayOperationTime(locker);

  return (
    <Card style={styles.card} mode="elevated">
      <Card.Content>
        <View style={styles.topRow}>
          <Text variant="titleMedium" style={styles.name}>
            {locker.stlckRprsPstnNm}
          </Text>
          {/* <Text
            variant="labelMedium"
            style={[
              styles.status,
              { color: isAvailable ? "#1E9E57" : "#E04848" },
            ]}
          >
            {isAvailable ? `${locker.available}칸 가능` : "만석"}
          </Text> */}
        </View>

        <Text variant="bodySmall" style={styles.subText}>
          {`${locker.fcltRoadNmAddr.trim()} \n (${locker.fcltLotnoAddr.trim()})`}
        </Text>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Icon source="map-marker-distance" size={16} color="#444" />
            <Text style={styles.info}>
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
            <Icon source="archive" size={16} color="#rgb(192, 143, 79)" />
            <Text style={styles.info}>
              남은 보관함 수:<Text style={styles.bold}> {remainingCnt}</Text>/{locker.stlckCnt}
            </Text>
          </View>

          <View style={styles.infoItem}>
            <Icon source="clock-outline" size={16} color="#0062d2" />
            <Text style={styles.info}>
              {todayTime.label} 이용 가능 시간: {todayTime.start} ~ {todayTime.end}
            </Text>
          </View>
        </View>

        <Button
          mode="contained-tonal"
          onPress={() => navigation.navigate("LockerDetail", { locker })}
          style={styles.button}
          contentStyle={styles.buttonContent}
          textColor="#355EDB"
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
    backgroundColor: "#FFFFFF",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: {
    flex: 1,
    fontWeight: "700",
    color: "#111",
    marginRight: 10,
  },
  status: {
    fontWeight: "700",
  },
  subText: {
    marginTop: 8,
    color: "#666",
  },
  infoRow: {
    marginTop: 12,
    marginBottom: 14,
  },
  info: {
    fontSize: 13,
    lineHeight: 18,
    color: "#444",
    marginBottom: 6,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 6,
  },
  bold: {
    fontWeight: "900",
    lineHeight: 18,
  },
  button: {
    borderRadius: 12,
  },
  buttonContent: {
    paddingVertical: 4,
  },
  distInfo: {
    fontSize: 15 
  }
});