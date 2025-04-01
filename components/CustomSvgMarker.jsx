import React, { useState } from 'react';
import { Marker } from 'react-native-maps';
import Svg, { Circle, Defs, LinearGradient, Stop, Text } from 'react-native-svg';
import { Animated } from 'react-native';

const CustomSvgMarker = React.memo(({ latitude, longitude, companyName, color }) => {
    const initial = companyName?.[0]?.toUpperCase() || '';
    const [tracksChanges, setTracksChanges] = useState(true);
    const scaleAnim = new Animated.Value(1);

    const handlePress = () => {
        setTracksChanges(true);
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 1.2, duration: 100, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start(() => setTracksChanges(false));
    };

    return (
        <Marker
            coordinate={{ latitude, longitude }}
            tracksViewChanges={tracksChanges}
            onPress={handlePress}
        >
            <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Svg width={40} height={40} viewBox="0 0 50 50">
                    <Defs>
                        <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                            <Stop offset="0%" stopColor={color || '#FF7F50'} />
                            <Stop offset="100%" stopColor={color ? `${color}AA` : '#FF4500'} />
                        </LinearGradient>
                    </Defs>
                    <Circle cx="25" cy="25" r="20" fill="url(#grad)" stroke="#FF4500" strokeWidth="2" />
                    <Text
                        x="25"
                        y="30"
                        textAnchor="middle"
                        fill="white"
                        fontSize="18"
                        fontWeight="bold"
                    >
                        {initial}
                    </Text>
                </Svg>
            </Animated.View>
        </Marker>
    );
});

export default CustomSvgMarker;
