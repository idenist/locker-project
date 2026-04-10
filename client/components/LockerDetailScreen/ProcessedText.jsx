import styles from '../../styles/lockerDetailStyles'
import { View } from "react-native";
import { Divider, Text } from "react-native-paper";

export function ProcessedCrgExplnText({ value }) {
    if(/[ㆍ・]/.test(value)) {
        const sentences = value.trim().split(/[ㆍ・]/).map(s => s.trim()).slice(1)
        const components = [];

        if(sentences.length > 1) {
            for(const s of sentences) {
                const lines = s.split('\n').map(s => s.trim())
                if(lines.length == 1) {
                    components.push(<Text key={s} style={styles.blockValue}>・ {s}</Text>) 
                } else {
                    components.push(
                        <View key={s} style={styles.lineBox}>
                            <Text>{s}</Text>
                        </View>
                    )
                }
            }
            return <>{components}</>;
        } else {
            return <Text style={styles.blockValue}>{sentences[0]}</Text>
        }
    }

    return <Text style={styles.blockValue}>{value}</Text>
}

export function ProcessedAddCrgText({ value }) {
    if(!value.includes('\n'))
        return <Text style={styles.blockValue}>{value}</Text>
    
    const lines = value.split('\n').map(s => s.trim())
    const notInView = [];
    const inView = [];

    for(const line of lines) {
        if(!line)
            continue;

        if(/[ㆍ・]/.test(line)) {
            inView.push(<Text key={line}>{line.replace(/[ㆍ・]/, '').trim()}</Text>)
        } else {
            notInView.push(<Text key={line} style={styles.blockValue}>{line}</Text>)
        }
    }

    return <>
        {notInView}
        <View style={styles.lineBox}>
            {inView}
        </View>
    </>
}

export function ProcessedMthdExpln({ value }) {
    function normalizeNumberedText(text) {
        return String(text ?? "")
            .replace(/\r\n/g, "\n")
            .replace(/^\s*/, "")
            .replace(/\s*(\d+\.)\s*/g, "\n$1 ")
            .replace(/^\n/, "")
            .trim();
    }

    function isNumberedLine(line) {
        return /^\d+\.\s*/.test(line);
    }

    const text = normalizeNumberedText(value);
    const rawLines = text
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

    const components = [];
    let numberedGroup = [];

    const flushNumberedGroup = (key) => {
        if (numberedGroup.length === 0) return;

        components.push(
        <View key={key} style={styles.lineBox}>
            {numberedGroup.map((line, idx) => (
            <Text key={idx} style={styles.lineText}>
                {line}
            </Text>
            ))}
        </View>
        );

        numberedGroup = [];
    };

    rawLines.forEach((line, idx) => {
        // ・ 보관 / ・ 찾기 같은 섹션 제목
        if (/^[ㆍ・]\s*/.test(line)) {
        flushNumberedGroup(`group-before-title-${idx}`);

        components.push(
            <View key={`title-${idx}`} style={styles.infoBlock}>
            <Text style={styles.blockLabel}>{line.replace(/^[ㆍ・]\s*/, "")}</Text>
            </View>
        );
        return;
        }

        // 1. 2. 3. 번호 줄
        if (isNumberedLine(line)) {
        numberedGroup.push(line);
        return;
        }

        // 일반 문장
        flushNumberedGroup(`group-before-normal-${idx}`);

        components.push(
        <View key={`text-${idx}`} style={styles.infoBlock}>
            <Text style={styles.blockValue}>{line}</Text>
        </View>
        );
    });

    flushNumberedGroup("group-last");

    return <>{components}</>;
}