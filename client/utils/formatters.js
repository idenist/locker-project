import { Linking, Text } from "react-native";

export const handleCall = (phoneNumber) => {
  if (!phoneNumber) return;
  const onlyNum = String(phoneNumber).replace(/\D/g, "");
  Linking.openURL(`tel:${onlyNum}`);
};

export function formatTime(time) {
  if (!time || time.length < 4) return "-";
  return time.slice(0, 2) + ":" + time.slice(2, 4);
}

export function datetimeFormat(date) {
  if (!date || date.length !== 14) {
    return "실시간 정보가 제공되지 않습니다";
  }

  return (
    "업데이트 일시: " +
    date.slice(0, 4) +
    "-" +
    date.slice(4, 6) +
    "-" +
    date.slice(6, 8) +
    " " +
    date.slice(8, 10) +
    ":" +
    date.slice(10, 12) +
    ":" +
    date.slice(12, 14)
  );
}

export function formatPhoneNumber(phone) {
  if (!phone) return "";

  const onlyNum = String(phone).replace(/\D/g, "");

  if (/^(15|16|18)\d{6}$/.test(onlyNum)) {
    return onlyNum.replace(/(\d{4})(\d{4})/, "$1-$2");
  }

  if (/^02\d{7,8}$/.test(onlyNum)) {
    if (onlyNum.length === 9) {
      return onlyNum.replace(/(02)(\d{3})(\d{4})/, "$1-$2-$3");
    }
    if (onlyNum.length === 10) {
      return onlyNum.replace(/(02)(\d{4})(\d{4})/, "$1-$2-$3");
    }
  }

  if (/^0\d{9,10}$/.test(onlyNum)) {
    if (onlyNum.length === 10) {
      return onlyNum.replace(/(0\d{2})(\d{3})(\d{4})/, "$1-$2-$3");
    }
    if (onlyNum.length === 11) {
      return onlyNum.replace(/(0\d{2})(\d{4})(\d{4})/, "$1-$2-$3");
    }
  }

  return onlyNum;
}

export function normalizeText(text) {
  if (!text) return "";

  return text
    // 1. "1. ", "2. " 처럼 숫자+점 앞에 줄바꿈이 없다면 강제로 삽입
    // (?<!^): 문장 맨 처음은 제외, (?=\d+\.): 숫자+점 앞에 위치 지정
    .replace(/(?<!^)(?=\d+\.)/g, '\n') 
    
    // 2. ">" 기호 앞뒤에 줄바꿈이 없다면 줄바꿈으로 변경 (선택 사항)
    .replace(/\s*>\s*/g, '\n> ') 

    .split('\n')
    .map(line => line.trim())
    .filter(line => line !== "")
    .map(line => {
      // 숫자/불릿 뒤 공백 한 칸으로 통일
      let processed = line.replace(/^([•·▪\-*‣]|\d+[\.\)])[\s]*/, "$1 ");
      return processed;
    })
    .join('\n');
};

export function formatLockerSize(locker) {
  const collector = []

  if(locker.stlckWdthLenExpln) {
    const width = locker.stlckWdthLenExpln.replace(/[^\d\s]/g, "").trim().split(/\s+/);
    collector.push(width)
  } else {
    collector.push("N")
  }

  if(locker.stlckDpthExpln) {
    const depth = locker.stlckDpthExpln.replace(/[^\d\s]/g, "").trim().split(/\s+/);
    collector.push(depth)
  } else {
    collector.push("N")
  }

  if(locker.stlckHgtExpln) {
    const height = locker.stlckHgtExpln.replace(/[^\d\s]/g, "").trim().split(/\s+/);
    collector.push(height)
  } else {
    collector.push("N")
  }

  if(collector[0].length == 1)
    return <Text>{collector[0][0]} × {collector[1][0]} × {collector[2][0]}</Text>;
  if(collector[0].length == 3)
    return <>
      <Text>• 소형: {collector[0][0]} × {collector[1][0]} × {collector[2][0]}</Text>
      <Text>• 중형: {collector[0][1]} × {collector[1][1]} × {collector[2][1]}</Text>
      <Text>• 대형: {collector[0][2]} × {collector[1][2]} × {collector[2][2]}</Text>
    </>

  const ret = [];
  for(let i=0; i<collector[0].length; i++)
      ret.push(<Text>• {collector[0][i]} × {collector[1][i]} × {collector[2][i]}</Text>)
  return ret;
}