import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import ListOfCompanies from '../components/ListOfCompanies';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { BASE_URL } from '@/utils/requests';
import AsyncStorage from '@react-native-async-storage/async-storage';
function MapScreen({ navigation }) {
    const [isListVisible, setIsListVisible] = useState(true);
    const [branches, setBranches] = useState([]);
    const [token, setToken] = useState(null);

    useEffect(() => {
        const getToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                } else {
                    console.error("Token not found in AsyncStorage");
                }
            } catch (error) {
                console.error("Error getting token from AsyncStorage:", error);
            }
        };

        getToken();
    }, []);

    // Animated values
    const heightAnim = useSharedValue(200); // Initial height in pixels

    // Toggle the list height
    const toggleList = () => {
        heightAnim.value = withSpring(isListVisible ? 50 : 350); // Minimize to 50px and expand to 200px
        setIsListVisible(!isListVisible);
    };

    const onMarekerPress = () => {

    }

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

    const fetchAllBranches = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/v1/Branch/all-branches`, {
                headers: {
                    TokenString: token,
                },
            });
            console.log('Branches response:', response.data);
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    }

    useEffect(() => {
        if (token) fetchAllBranches();

    }, [token]);
    return (
        <View style={styles.container}>
            <Icon
                name="left"
                type="antdesign"
                color="white"
                containerStyle={styles.closeIcon}
                onPress={() => navigation.goBack()}
            />
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
                {branches.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        // title={marker.title}
                        // description={marker.description}
                        onPress={onMarekerPress}
                        pinColor="#3EC4C1"
                    >
                        <Callout>
                            <View style={styles.callout}>
                                {/* <Text style={styles.title}>{marker.title}</Text>
                                <Text style={styles.description}>{marker.description}</Text> */}
                            </View>
                        </Callout>
                    </Marker>
                ))}a
            </MapView>
            <PanGestureHandler onGestureEvent={handleGesture}>
                <Animated.View style={[styles.listContainer, animatedStyle]}>
                    <View style={styles.dragHandle} />
                    <ListOfCompanies navigation={navigation} />
                </Animated.View>
            </PanGestureHandler>
        </View >
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    description: {
        fontSize: 14,
        color: '#333',
    },
    callout: {
        width: 150,
        padding: 5,
    },
    closeIcon: {
        position: 'absolute',
        top: 40,
        left: 0,
        padding: 10,
        zIndex: 1,
    },
});


export default MapScreen;