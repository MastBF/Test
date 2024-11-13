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
import * as Location from 'expo-location';
import BranchInfo from '../components/BranchInfo';
import MarkerCustom from './MarkerCustom';
import CustomMarker from '../components/CustomMarker';
import Svg, { Path } from 'react-native-svg';

function MapScreen({ navigation }) {
    const [isListVisible, setIsListVisible] = useState(false);
    const [branches, setBranches] = useState([]);
    const [token, setToken] = useState(null);
    const [shopInfoShow, setShopInfoShow] = useState(false);
    const [location, setLocation] = useState(null);
    const [region, setRegion] = useState(null);
    const [image, setImage] = useState(null);
    const [address, setAddress] = useState(null);
    const [companyId, setCompanyId] = useState(null);
    const [logo, setLogo] = useState(null);
    const [companyName, setCompanyName] = useState(null);
    const [imageHeader, setImageHeader] = useState(null);
    const [uiImagePath, setUiImagePath] = useState(null);

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

    const heightAnim = useSharedValue(200); // Initial height in pixels

    const toggleList = () => {
        heightAnim.value = withSpring(isListVisible ? 50 : 350);
        setIsListVisible(!isListVisible);
    };

    const onMarekerPress = (id, image, address, companyName, logo) => {
        if (!isListVisible) toggleList();
        if (!shopInfoShow) {
            setShopInfoShow(prev => !prev);
        }
        setCompanyId(id);
        setImage(image);
        setAddress(address);
        setCompanyName(companyName);
        setLogo(logo);
        const filteredBranches = branches.filter(branch => branch.companyName === companyName);
        if (filteredBranches.length > 0) {
            setUiImagePath(filteredBranches[0].companyUiFileName);
        }
        setImageHeader(uiImagePath);
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: heightAnim.value,
        };
    });

    const handleGesture = (event) => {
        if (event.nativeEvent.translationY > 0) {
            heightAnim.value = withSpring(50);
            setIsListVisible(false);
        } else {
            heightAnim.value = withSpring(350);
            setIsListVisible(true);
        }
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
                    "visibility": "on"
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
                    "visibility": "on"
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

    useEffect(() => {
        (async () => {
            try {
                let { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    console.error('Permission to access location was denied');
                    return;
                }

                let location = await Location.getCurrentPositionAsync({});
                setLocation(location);
                setRegion({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.015,
                    longitudeDelta: 0.0121,
                }); // Set the region to focus on the user’s location
            } catch (error) {
                console.error("Error getting location:", error);
            }
        })();
    }, []);

    const fetchAllBranches = async () => {
        if (!token) {
            console.error("No token found");
            return;
        }
        if (!location) {
            console.error("No location found");
            return;
        }
        try {
            const { latitude, longitude } = location.coords;
            const response = await axios.get(`${BASE_URL}/api/v1/Branch/all-branches/${latitude}/${longitude}`, {
                headers: { TokenString: token },
            });
            console.log('Branches response:', response.data);
            setBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    useEffect(() => {
        if (token && location) fetchAllBranches();
    }, [token, location]);
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
                region={region} // Use region instead of initialRegion
                customMapStyle={darkTheme}
                onPress={toggleList}
            >
                {location && (
                    <MarkerCustom
                        coordinate={{
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                        }}
                    />
                )}
                {branches.map(marker => (
                    //     <Marker
                    //         key={marker.id}
                    //         coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                    //         title={marker.title}
                    //         description={marker.description}
                    //         onPress={() => onMarekerPress(marker.id, marker.imageUrl, marker.address, marker.companyName, marker.companyLogoFileName)}
                    //         pinColor={marker.companyColour}
                    //     >
                    //         <Callout>
                    //             <View style={styles.callout}>
                    //                 {/* <Text style={styles.title}>{marker.title}</Text>
                    //                 <Text style={styles.description}>{marker.description}</Text> */}
                    //             </View>
                    //         </Callout>
                    //     </Marker>
                    // ))}
                    //     <CustomMarker
                    //         key={marker.id}
                    //         coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                    //         title={marker.title}
                    //         description={marker.description}
                    //         onPress={() => onMarekerPress(marker.id, marker.imageUrl, marker.address, marker.companyName, marker.companyLogoFileName)}
                    //         pinColor={marker.companyColour}
                    //     >
                    //         <Callout>
                    //             <View style={styles.callout}>
                    //                 {/* <Text style={styles.title}>{marker.title}</Text>
                    //                 <Text style={styles.description}>{marker.description}</Text> */}
                    //             </View>
                    //         </Callout>
                    //     </CustomMarker>
                    // ))}
                    <Marker coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}>
                        <View style={{ width: 50, height: 50 }}>
                            <Svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <Path d="M19.7 3.2C17.5 1.1 14.8 0 11.9 0C8.89995 0 6.29995 1.1 4.09995 3.2C1.79995 5.3 0.699951 8.1 0.699951 11.3C0.699951 13.7 1.59995 16.2 3.29995 18.7C4.89995 21 7.29995 23.5 10.6 26.2L11.9 27.3L13.2 26.2C16.4 23.5 18.9 21 20.5 18.7C22.2 16.2 23.1 13.7 23.1 11.3C23 8.1 21.9 5.3 19.7 3.2ZM18.8 17.6C17.3 19.8 15 22.1 11.9 24.7C8.79995 22.1 6.49995 19.8 4.99995 17.6C3.49995 15.4 2.69995 13.3 2.69995 11.3C2.69995 8.6 3.59995 6.3 5.39995 4.6C7.19995 2.9 9.39995 2 11.9 2C14.4 2 16.5 2.9 18.3 4.6C20.1 6.3 21 8.6 21 11.3C21 13.3 20.3 15.4 18.8 17.6Z" fill="white" />
                                <Path d="M18.3 4.6C16.5 2.9 14.3 2 11.9 2C9.39995 2 7.19995 2.9 5.39995 4.6C3.59995 6.4 2.69995 8.6 2.69995 11.3C2.69995 13.3 3.49995 15.4 4.99995 17.5C6.49995 19.6 8.79995 22 11.9 24.6C15 22 17.3 19.7 18.8 17.5C20.3 15.3 21.1 13.2 21.1 11.3C21 8.6 20.1 6.4 18.3 4.6Z" fill="#3BDC65" />
                                <Path d="M11.8999 13.1992C12.3999 13.1992 12.8999 12.9992 13.2999 12.5992C13.6999 12.1992 13.8999 11.7992 13.8999 11.1992C13.8999 10.6992 13.6999 10.1992 13.2999 9.79922C12.8999 9.39922 12.4999 9.19922 11.8999 9.19922C11.3999 9.19922 10.8999 9.39922 10.4999 9.79922C10.0999 10.1992 9.8999 10.6992 9.8999 11.1992C9.8999 11.6992 10.0999 12.1992 10.4999 12.5992C10.8999 12.9992 11.2999 13.1992 11.8999 13.1992Z" fill="white" />
                            </Svg>
                        </View>
                    </Marker>
                ))}
            </MapView>
            <PanGestureHandler onGestureEvent={handleGesture}>
                <Animated.View style={[styles.listContainer, animatedStyle]}>
                    <View style={styles.dragHandle} />
                    {shopInfoShow ? (
                        <BranchInfo image={image} address={address} id={companyId} companyName={companyName} logo={logo} navigation={navigation} imageHeader={uiImagePath} />
                    ) : (
                        <ListOfCompanies navigation={navigation} branches={branches} />
                    )}
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
    markerStyle: {
        borderRadius: 50,
    },
});


export default MapScreen;