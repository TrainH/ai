import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    naver: any;
  }
}

const MapPage: React.FC = () => {
  const mapElement = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { naver } = window;
    if (!mapElement.current || !naver) return;

    // 지도 초기화
    const location = new naver.maps.LatLng(37.5665, 126.9780); // 서울 시청 기준
    const mapOptions = {
      center: location,
      zoom: 15,
      minZoom: 10,
    };

    const map = new naver.maps.Map(mapElement.current, mapOptions);

    // 마커 추가 (예시)
    new naver.maps.Marker({
      position: location,
      map: map,
      title: '서울시청'
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: '100%' }}>
      <div
        ref={mapElement}
        id="map"
        style={{
          flex: 1,
          width: '100%'
        }}
      />
    </div>
  );
};

export default MapPage;
