import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import ListOfBranches from '../components/ListOfBranches';

export default function MapScreen() {
    const [isListVisible, setIsListVisible] = useState(true);

    // Animated values
    const heightAnim = useSharedValue(200); // Initial height in pixels

    // Toggle the list height
    const toggleList = () => {
        heightAnim.value = withSpring(isListVisible ? 50 : 200); // Minimize to 50px and expand to 200px
        setIsListVisible(!isListVisible);
    };

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: heightAnim.value,
        };
    });

    const handleGesture = (event) => {
        // Drag the list up or down based on gesture
        heightAnim.value = withSpring(event.nativeEvent.translationY > 0 ? 50 : 350);
    };


    const darkTheme = [

        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#212121"
                }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#212121"
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#9e9e9e"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#bdbdbd"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#181818"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#1b1b1b"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#2c2c2c"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#8a8a8a"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#373737"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#3c3c3c"
                }
            ]
        },
        {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#4e4e4e"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#616161"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#757575"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#3d3d3d"
                }
            ]
        }
    ];

    const markers = [
        { id: 1, longitude: 44.5076, latitude: 40.1921, title: 'Marker 1', description: 'Description 1' },
        { id: 2, longitude: 44.5304, latitude: 40.1728, title: 'Marker 2', description: 'Description 2' },
        { id: 3, longitude: 44.5149, latitude: 40.1765, title: 'Marker 3', description: 'Description 3' },
        { id: 4, longitude: 44.5251, latitude: 40.1854, title: 'Marker 4', description: 'Description 4' },
        { id: 5, longitude: 44.5043, latitude: 40.1987, title: 'Marker 5', description: 'Description 5' },
        { id: 6, longitude: 44.5206, latitude: 40.1882, title: 'Marker 6', description: 'Description 6' },
        { id: 7, longitude: 44.5148, latitude: 40.1815, title: 'Marker 7', description: 'Description 7' },
    ];


    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: 40.1851098,
                    longitude: 44.5208345,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                customMapStyle={darkTheme}
                onPress={toggleList} // Toggle list visibility on map press
            >
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        title={marker.title}
                        description={marker.description}
                    />
                ))}
            </MapView>
            <PanGestureHandler onGestureEvent={handleGesture}>
                <Animated.View style={[styles.listContainer, animatedStyle]} >
                    <View style={styles.dragHandle} />
                    <ListOfBranches />
                </Animated.View>
            </PanGestureHandler>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1E1E1E',
    },
    map: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    listContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        backgroundColor: '#E0E0E0',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingHorizontal: 5,
        overflow: 'hidden',
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#CCC',
        borderRadius: 2.5,
        alignSelf: 'center',
        marginVertical: 10,
    },
});
