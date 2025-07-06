import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Alert, Linking, TouchableOpacity, View, Platform, StyleSheet, SafeAreaView, Dimensions, Text, FlatListComponent } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    useAnimatedGestureHandler,
    interpolate,
    Extrapolate,
    runOnJS,
    useAnimatedReaction
} from 'react-native-reanimated';
import { FlatList, PanGestureHandler } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '@/utils/requests'; // Import the configured api instance
import * as Location from 'expo-location';
import BranchInfo from '../components/BranchInfo';
import { AntDesign, Entypo, EvilIcons, Feather, FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Image } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native-paper';
import { AuthContext } from '@/context/AuthProvider';
import { useFocusEffect } from '@react-navigation/native';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const MAX_TRANSLATE_Y = -SCREEN_HEIGHT * 0.7;
const MIN_TRANSLATE_Y = -SCREEN_HEIGHT * 0.3;
const CLOSED_POSITION = 70;
const { width, height } = Dimensions.get('window');

function MapScreen({ navigation, route }) {
    const [location, setLocation] = useState(null);
    const [region, setRegion] = useState(null);
    const [branches, setBranches] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);
    const [nearestCompanies, setNearestCompanies] = useState([]);
    const [isPressed, setIsPressed] = useState()
    const translateY = useSharedValue(0);
    const context = useSharedValue({ y: 0 });
    const [branchInfo, setBranchInfo] = useState()
    const [loadingBranches, setLoadingBranches] = useState(false);
    const [loadingCompanies, setLoadingCompanies] = useState(false);
    const { branchId, isUpdate } = route.params || {};
    const [isMarkerPressed, setIsMarkerPressed] = useState(false)
    const [speceficBranchInfo, setSpeceficBranchInfo] = useState(null)
    const { token } = useContext(AuthContext);
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
    const scrollTo = useCallback((destination) => {
        translateY.value = withSpring(destination, { damping: 50 });
    }, []);

    const closeSheet = useCallback(() => {
        scrollTo(CLOSED_POSITION);
        setSelectedBranch(null);
    }, []);

    const openSheet = useCallback(() => {
        if (!branchId) {
            scrollTo(MIN_TRANSLATE_Y);
        }
    }, []);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.y = translateY.value;
        },
        onActive: (event, ctx) => {
            translateY.value = event.translationY + ctx.y;
            translateY.value = Math.max(MAX_TRANSLATE_Y, Math.min(translateY.value, CLOSED_POSITION));
        },
        onEnd: (event) => {
            const velocity = event.velocityY;

            if (Math.abs(velocity) > 800) {
                if (velocity > 0) {
                    translateY.value = withSpring(CLOSED_POSITION, { damping: 50 });
                    if (selectedBranch) {
                        runOnJS(setSelectedBranch)(null);
                    }
                } else {
                    translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
                }
                return;
            }

            if (translateY.value > -SCREEN_HEIGHT * 0.5) {
                if (translateY.value > -SCREEN_HEIGHT * 0.2) {
                    translateY.value = withSpring(CLOSED_POSITION, { damping: 50 });
                    if (selectedBranch) {
                        runOnJS(setSelectedBranch)(null);
                    }
                } else {
                    translateY.value = withSpring(MIN_TRANSLATE_Y, { damping: 50 });
                }
            } else {
                translateY.value = withSpring(MAX_TRANSLATE_Y, { damping: 50 });
            }
        },
    });
    const handleCompanyPress = async (companyId) => {
        if (!location || !token) return;

        try {
            setIsPressed(true);
            setLoadingBranches(true);
            const response = await api.get(
                `/api/v1/Branch/all-branches/${companyId}/${location.coords.latitude}/${location.coords.longitude}`
            );
            setBranches(response.data);
            setBranchInfo(response.data);
        } catch (error) {
            console.error("Error fetching company branches:", error);
        } finally {
            setLoadingBranches(false);
        }
    };

    const handleMarkerPress = (branchInfo) => {
        setIsMarkerPressed(true);
        setSpeceficBranchInfo(branchInfo);
        if (Platform.OS === 'ios') {
            setTimeout(() => {
                scrollTo(MAX_TRANSLATE_Y);
            }, 50);
        } else {
            scrollTo(MAX_TRANSLATE_Y);
        }
    };



    const fetchNearestCompany = async () => {
        try {
            setLoadingCompanies(true);
            // Use api instance, BASE_URL and Auth header handled by interceptor
            // Note: Using hardcoded coordinates from original code
            const response = await api.get(`/api/v1/Company/nearest/${region.longitude}/${region.latitude}`);
            setNearestCompanies(response.data);
        } catch (error) {
            console.error("Error fetching nearest company:", error);
        } finally {
            setLoadingCompanies(false);
        }
    };

    useEffect(() => {
        if (token && location) {
            fetchNearestCompany();
        }
    }, [token, location]);

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
                });
            } catch (error) {
                console.error("Error getting location:", error);
            }
        })();
    }, []);


    const fetchBranches = async () => {
        if (!region || !token) return;
        try {
            // Use api instance, BASE_URL and Auth header handled by interceptor
            const response = await api.get(`/api/v1/Branch/all-branches/${region.latitude}/${region.longitude}`);
            setBranches(response.data);
        } catch (err) {
            console.error('Err:', err);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, [token, region]);
    const bottomSheetStyle = useAnimatedStyle(() => {
        const borderRadius = interpolate(
            translateY.value,
            [MAX_TRANSLATE_Y + 50, MAX_TRANSLATE_Y],
            [25, 5],
            Extrapolate.CLAMP
        );

        return {
            borderRadius,
            transform: [{ translateY: translateY.value }],
            height: SCREEN_HEIGHT,
            ...(Platform.OS === 'ios' ? { zIndex: 10 } : {})
        };
    });
    useFocusEffect(
        useCallback(() => {
            if (branchId && token && location) {
                setIsMarkerPressed(false);
                setIsPressed(true);
                scrollTo(MAX_TRANSLATE_Y);
                handleCompanyPress(branchId);
            }
        }, [branchId, isUpdate, token, location])
    );


    return (
        <View style={{ flex: 1, backgroundColor: '#0C0C0C' }}>
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    region={region}
                    showsUserLocation={true}
                    onPress={closeSheet}
                    customMapStyle={darkTheme}
                >
                    {branches.map(marker => (
                        <Marker
                            key={marker.id}
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            pinColor={marker.companyColour}
                            onPress={() => handleMarkerPress(marker)}
                        />
                    ))}
                </MapView>

                <PanGestureHandler onGestureEvent={gestureHandler}>
                    <Animated.View style={[styles.bottomSheetContainer, bottomSheetStyle]}>
                        <View style={styles.header}>
                            <View style={styles.dragHandle} />
                            {(isPressed || isMarkerPressed) && (
                                <TouchableOpacity
                                    style={styles.backButton}
                                    onPress={async () => {
                                        setIsPressed(false);
                                        setIsMarkerPressed(false);
                                        try {
                                            await fetchBranches();
                                        } catch (error) {
                                            console.error("Error fetching branches:", error);
                                        }
                                    }}
                                >
                                    <Feather
                                        name="chevron-left"
                                        size={26}
                                        color="#F7A300"
                                        style={{
                                            padding: 4,
                                            backgroundColor: '#1A1A1A',
                                            borderRadius: 10,
                                            borderWidth: 1,
                                            borderColor: '#2E2E2E'
                                        }}
                                    />


                                </TouchableOpacity>

                            )}
                        </View>

                        {isMarkerPressed ?
                            <View style={styles.specificBranch}>
                                <Image source={{ uri: speceficBranchInfo.fileName }} style={styles.branchImage} />
                                <TouchableOpacity style={[styles.branchCard, styles.specificOptions]} onPress={() => navigation.navigate('ProductScreen', { branchId: speceficBranchInfo.id })}>
                                    <View style={styles.branchIconWrapper}>
                                        <FontAwesome5 name="map-marker-alt" size={20} color="#F7A300" />
                                    </View>
                                    <View style={styles.branchDetails}>
                                        <Text style={styles.branchAddress}>{speceficBranchInfo.address}</Text>
                                        <Text style={styles.branchPhone}>Phone: {speceficBranchInfo.phone || 'Not specified'}</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.openInMapsButton}
                                    onPress={() => {
                                        const { latitude, longitude } = speceficBranchInfo;
                                        const url = Platform.select({
                                            ios: `maps://?ll=${latitude},${longitude}`,
                                            android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`
                                        });
                                        Linking.openURL(url).catch(err => console.error("Couldn't load page", err));
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <View style={styles.mapIconContainer}>
                                        <MaterialCommunityIcons name="map-outline" size={20} color="#F7A300" />
                                    </View>
                                    <Text style={styles.openInMapsText}>Open in Maps</Text>
                                    <View style={styles.arrowIcon}>
                                        <Feather name="arrow-up-right" size={18} color="#F7A300" />
                                    </View>
                                </TouchableOpacity>

                            </View>
                            : (!isPressed ? (
                                loadingCompanies ? (
                                    <ActivityIndicator size="large" color="#F7A300" style={{ marginTop: 20 }} />
                                ) : (
                                    <FlatList
                                        data={nearestCompanies}
                                        keyExtractor={(item) => item.id.toString()}
                                        scrollEnabled={true}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={styles.companyCard}
                                                onPress={(e) => handleCompanyPress(item.id, e)}
                                            >
                                                <View style={styles.iconContainer}>
                                                    <Feather name="coffee" size={30} color="#F7A300" />
                                                </View>
                                                <View style={styles.companyInfo}>
                                                    <Text style={styles.companyName}>{item.name}</Text>
                                                    <Text style={styles.distanceText}>~900 м</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        contentContainerStyle={styles.listContent}
                                    />
                                )


                            ) : (
                                loadingBranches ? (
                                    <ActivityIndicator size="large" color="#F7A300" style={{ marginTop: 20 }} />
                                ) : (
                                    <FlatList
                                        data={branchInfo}
                                        keyExtractor={(item) => item.id.toString()}
                                        scrollEnabled={true}
                                        renderItem={({ item }) => (
                                            <TouchableOpacity style={styles.branchCard} onPress={() => navigation.navigate('ProductScreen', { branchId: item.id })}>
                                                <View style={styles.branchIconWrapper}>
                                                    <FontAwesome5 name="map-marker-alt" size={20} color="#F7A300" />
                                                </View>
                                                <View style={styles.branchDetails}>
                                                    <Text style={styles.branchAddress}>{item.address}</Text>
                                                    <Text style={styles.branchPhone}>Phone: {item.phone || 'Not specified'}</Text>
                                                </View>
                                            </TouchableOpacity>
                                        )}
                                        contentContainerStyle={styles.listContent}
                                    />
                                )
                            ))}
                    </Animated.View>
                </PanGestureHandler>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        position: 'relative',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    iconContainer: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#F7A300',
        borderWidth: 1,
    },
    bottomSheetContainer: {
        position: 'absolute',
        width: '102%',
        alignSelf: 'center',
        backgroundColor: '#0C0C0C',
        top: Platform.OS === 'ios' ? SCREEN_HEIGHT - 170 : SCREEN_HEIGHT - 120,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingHorizontal: 15,
        paddingTop: 10,
        borderTopWidth: 1,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopColor: '#F7A300',
        borderLeftColor: '#F7A300',
        borderRightColor: '#F7A300',
    },
    title: {
        fontSize: 18,
        fontWeight: '300',
        marginLeft: 40,
        flexShrink: 1,
        color: '#fff',
    },
    listContent: {
        paddingHorizontal: 15,
        paddingBottom: 20,
    },

    emptyState: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 100,
    },
    content: {
        alignItems: 'center',
        padding: 15,
    },
    header: {
        alignItems: 'center',
        paddingTop: 10,
        marginBottom: 40,
    },
    dragHandle: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 5,
    },
    address: {
        fontSize: 16,
        color: '#fff',
    },
    companyCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 16,
        padding: 12,
        marginBottom: 16,
        shadowColor: '#F7A300',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },

    companyInfo: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },

    backButton: {
        position: 'absolute',
        left: 13,
        top: 0,
        zIndex: 10,
    },
    companyName: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },
    distanceText: {
        fontSize: 14,
        color: '#F7A300',
    },
    iconContainerBranch: {
        width: 32,
        height: 32,
        borderRadius: 12,
        backgroundColor: '#1e1e1e',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#F7A300',
        borderWidth: 1,
    },
    branchCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        padding: 12,
        marginBottom: 14,
        shadowColor: '#F7A300',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 5,
    },
    specificOptions: {
        marginTop: 20,
    },
    branchImage: {
        height: height * 0.25,
        borderRadius: width * 0.05,
        width: '100%',
        // borderWidth: 1,
        // borderColor: '#F7A300',
    },
    branchIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: '#0e0e0e',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#F7A300',
        borderWidth: 1,
        marginRight: 12,
    },

    branchDetails: {
        flex: 1,
        justifyContent: 'center',
    },

    branchAddress: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 4,
    },

    branchPhone: {
        fontSize: 14,
        color: '#ccc',
    },
    openInMapsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#2a2a2a',
        // Тень для эффекта глубины
        shadowColor: '#F7A300',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    openInMapsText: {
        color: '#F7A300',
        fontSize: 15,
        fontWeight: '600',
        marginHorizontal: 10,
        flex: 1,
    },

});

export default MapScreen;