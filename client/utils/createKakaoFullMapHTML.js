export function createKakaoFullMapHTML({
  kakaoMapKey,
  currentLocation,
  lockers = [],
}) {
  const validLockers = lockers.filter((locker) => {
    const lat = Number(locker.lat);
    const lng = Number(locker.lot);

    return (
      !Number.isNaN(lat) &&
      !Number.isNaN(lng) &&
      lat !== 0 &&
      lng !== 0
    );
  });

  const markersJson = JSON.stringify(
    validLockers.map((locker) => ({
      id: locker.stlckId ?? "",
      stdgCd: locker.stdgCd ?? "",
      title: locker.stlckRprsPstnNm ?? "물품보관함",
      address: locker.fcltRoadNmAddr ?? "",
      lat: Number(locker.lat),
      lng: Number(locker.lot),
    }))
  );

  const centerLat = currentLocation?.latitude ?? 37.5665;
  const centerLng = currentLocation?.longitude ?? 126.9780;

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
    />
    <style>
      html, body, #map {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .info-window {
        padding: 8px 10px;
        font-size: 12px;
        line-height: 1.4;
        min-width: 180px;
      }

      .info-title {
        font-weight: bold;
        margin-bottom: 4px;
        color: #111827;
      }

      .info-address {
        color: #4b5563;
      }

      .info-link {
        margin-top: 8px;
        color: #2563eb;
        font-weight: 700;
        cursor: pointer;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>

    <script src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&libraries=clusterer"></script>
    <script>
      (function () {
        window.handleDetailClick = function (payload) {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(payload);
          }
        };

        const currentLocation = {
          lat: ${centerLat},
          lng: ${centerLng}
        };

        const lockerMarkers = ${markersJson};

        const mapContainer = document.getElementById("map");

        // 처음엔 내 위치 주변만 보이게 시작
        const mapOption = {
          center: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
          level: 4
        };

        const map = new kakao.maps.Map(mapContainer, mapOption);
        let openedInfoWindow = null;

        // 지도 컨트롤
        const mapTypeControl = new kakao.maps.MapTypeControl();
        map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

        const zoomControl = new kakao.maps.ZoomControl();
        map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

        // 내 위치 마커
        const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'; // 마커 이미지 주소
        const imageSize = new kakao.maps.Size(31, 44); // 마커 이미지의 크기
        const imageOption = {offset: new kakao.maps.Point(27, 69)}; // 마커 좌표와 일치시킬 이미지 안의 좌표

        // 마커 이미지를 생성합니다
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

        const currentMarker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(currentLocation.lat, currentLocation.lng),
            map: map,
            image: markerImage // 생성한 마커 이미지를 설정합니다
        });

        const currentInfoWindow = new kakao.maps.InfoWindow({
          content: \`
            <div class="info-window">
              <div class="info-title">현재 위치</div>
            </div>
          \`
        });

        // 다른 곳 누르면 윈도우 꺼짐
        kakao.maps.event.addListener(currentMarker, "click", function () {
          if (openedInfoWindow) {
            openedInfoWindow.close();
          }

          currentInfoWindow.open(map, currentMarker);
          openedInfoWindow = currentInfoWindow;
        });

        // 보관소 마커들 생성
        const markers = lockerMarkers.map((locker) => {
          const markerPosition = new kakao.maps.LatLng(locker.lat, locker.lng);

          const marker = new kakao.maps.Marker({
            position: markerPosition
          });

          const infoWindow = new kakao.maps.InfoWindow({
            content: \`
              <div class="info-window">
                <div class="info-title">\${escapeHtml(locker.title)}</div>
                <div class="info-address">\${escapeHtml(locker.address)}</div>
                <div
                  class="info-link"
                  onclick='handleDetailClick(\${JSON.stringify(
                    JSON.stringify({
                      type: "locker_detail",
                      stlckId: locker.id,
                      stdgCd: locker.stdgCd,
                    })
                  )})'
                >
                  상세정보 보기
                </div>
              </div>
            \`
          });

          // 다른 곳 누르면 윈도우 꺼짐
          kakao.maps.event.addListener(marker, "click", function () {
            if (openedInfoWindow) {
              openedInfoWindow.close();
            }

            infoWindow.open(map, marker);
            openedInfoWindow = infoWindow;
          });

          // 마커가 아닌 부분을 눌러도 꺼짐
          kakao.maps.event.addListener(map, "click", function () {
            if (openedInfoWindow) {
              openedInfoWindow.close();
              openedInfoWindow = null;
            }
          });

          return marker;
        });

        // 축소 시 묶이도록 클러스터러 적용
        const clusterer = new kakao.maps.MarkerClusterer({
          map: map,
          averageCenter: true,
          minLevel: 6,
          disableClickZoom: false,
          styles: [
            {
              width: "40px",
              height: "40px",
              background: "rgba(17, 24, 39, 0.85)",
              borderRadius: "20px",
              color: "#ffffff",
              textAlign: "center",
              fontWeight: "bold",
              lineHeight: "40px"
            },
            {
              width: "50px",
              height: "50px",
              background: "rgba(31, 41, 55, 0.85)",
              borderRadius: "25px",
              color: "#ffffff",
              textAlign: "center",
              fontWeight: "bold",
              lineHeight: "50px"
            },
            {
              width: "60px",
              height: "60px",
              background: "rgba(55, 65, 81, 0.85)",
              borderRadius: "30px",
              color: "#ffffff",
              textAlign: "center",
              fontWeight: "bold",
              lineHeight: "60px"
            }
          ]
        });

        clusterer.addMarkers(markers);

        function escapeHtml(value) {
          if (typeof value !== "string") return "";

          return value
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        }
      })();
    </script>
  </body>
</html>
  `;
}