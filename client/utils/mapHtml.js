export function createKakaoMapHTML({ lat, lng, title, address, appKey }) {
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
            background: #f5f5f5;
          }

          .info-window {
            padding: 6px 10px;
            font-size: 12px;
            line-height: 1.4;
            color: #222;
            max-width: 220px;
            word-break: keep-all;
          }

          .info-title {
            font-weight: 700;
            margin-bottom: 2px;
          }

          .info-address {
            color: #666;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>

        <script
          type="text/javascript"
          src="https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}"
        ></script>
        <script>
          (function () {
            var container = document.getElementById('map');

            var markerPosition = new kakao.maps.LatLng(${lat}, ${lng});
            var centerPosition = new kakao.maps.LatLng(${lat} - 0.00035, ${lng});

            var map = new kakao.maps.Map(container, {
              center: centerPosition,
              level: 4
            });

            var marker = new kakao.maps.Marker({
              position: markerPosition
            });

            marker.setMap(map);

            var infoContent = \`
              <div class="info-window">
                <div class="info-title">${String(title ?? "물품보관함").replace(/`/g, "")}</div>
                <div class="info-address">${String(address ?? "").replace(/`/g, "")}</div>
              </div>
            \`;

            var infowindow = new kakao.maps.InfoWindow({
              content: infoContent
            });

            infowindow.open(map, marker);

            setTimeout(function () {
              map.relayout();
              map.setCenter(centerPosition);
            }, 100);

            setTimeout(function () {
              map.relayout();
              map.setCenter(centerPosition);
            }, 300);
          })();
        </script>
      </body>
    </html>
  `;
}