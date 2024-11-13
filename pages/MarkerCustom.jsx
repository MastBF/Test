import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Marker } from 'react-native-maps';

const MarkerCustom = ({ coordinate }) => {
    const bounceAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const bounceAnimation = Animated.timing(bounceAnim, {
            toValue: 1,
            duration: 800,
            easing: Easing.bounce,
            useNativeDriver: true,
        });

        const pulseAnimation = Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 0,
                    duration: 1200,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: true,
                })
            ])
        );

        bounceAnimation.start();
        pulseAnimation.start();

        return () => {
            bounceAnimation.stop();
            pulseAnimation.stop();
        };
    }, [bounceAnim, pulseAnim]);

    const bounceStyle = {
        transform: [
            {
                translateY: bounceAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-100, 0],
                }),
            },
            { rotate: '-15deg' },
        ],
        opacity: bounceAnim,
    };

    const pulseStyle = {
        transform: [
            {
                scale: pulseAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1.5],
                }),
            },
        ],
        opacity: pulseAnim,

        borderRadius: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [25 * 0.7, 25 * 1.5],
        }),
    };

    return (
        <Marker coordinate={coordinate} style={styles.marker}>
            <View style={styles.containerMarker}>
                <Animated.View style={[styles.pulse, pulseStyle]} />
                <Animated.View style={[styles.pin, bounceStyle]}>
                    <LinearGradient
                        colors={['#4c669f', '#3b5998', '#192f6a']}
                        style={styles.gradient}
                    />
                </Animated.View>
            </View>
        </Marker>
    );
};

const styles = StyleSheet.create({
    marker: {
        borderRadius: 50,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
    },
    containerMarker: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
    },
    pin: {
        width: 20,
        height: 20,
        borderRadius: 15,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
    },
    gradient: {
        width: '100%',
        height: '100%',
        borderRadius: 15,
    },
    pulse: {
        width: 38,
        height: 38,
        backgroundColor: 'rgba(125, 62, 255, 0.3)',
        borderRadius: 25,
        position: 'absolute',
    },
});

export default MarkerCustom;
