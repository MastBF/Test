import React, { useEffect, useState } from 'react';
import { Alert, Linking, TouchableOpacity, View, Platform, StyleSheet } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { PanGestureHandler } from 'react-native-gesture-handler';
import ListOfCompanies from '../components/ListOfCompanies';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { BASE_URL } from '@/utils/requests';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';
import BranchInfo from '../components/BranchInfo';

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
    const [shops, setShops] = useState([]);
    const [companyBranches, setCompanyBranches] = useState(null);
    const [showBranches, setShowBranches] = useState(false);
    const [companyImage, setCompanyImage] = useState(null);


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

    const heightAnim = useSharedValue(200); 

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
        const filteredBranches = branches.find(branch => branch.companyName === companyName);
        if (filteredBranches) {
            setImageHeader(filteredBranches.companyUiFileName);
        }
    }

    const animatedStyle = useAnimatedStyle(() => {
        return {
            height: heightAnim.value,
        };
    });

    const handleGesture = (event) => {
        if (event.nativeEvent.translationY > 0) {
            heightAnim.value = withSpring(150);
            setIsListVisible(false);
        } else {
            heightAnim.value = withSpring(400);
            setIsListVisible(true);
        }
    };

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
            setCompanyBranches(response.data);
        } catch (error) {
            console.error('Error fetching branches:', error);
        }
    };

    const fetchShops = async () => {
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
            const response = await axios.get(`${BASE_URL}/api/v1/Company/nearest/${longitude}/${latitude}`, {
                headers: {
                    TokenString: token,
                },
            });
            if (Array.isArray(response.data)) {
                setShops(response.data);
                setShowBranches(false);
            } else {
                console.error("Expected an array but got:", response.data);
            }
        } catch (error) {
            console.error("Error fetching shops:", error);
        }
    };

    const companyAllBranches = async (id) => {
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
            console.log(latitude, longitude, id)

            const response = await axios.get(`${BASE_URL}/api/v1/Branch/all-branches/${id}/${latitude}/${longitude}`, {
                headers: { TokenString: token },
            });
            // setBranches(response.data);
            setCompanyImage(response.data[0].companyLogoFileName);
        } catch (error) {
            console.error('Error fetching company branches:', error);
        }
    };

    const onBackPress = () => {
        setShopInfoShow(false)
    }

    useEffect(() => {
        if (token && location) {
            fetchAllBranches()
            fetchShops();
        };
    }, [token, location]);

    const onPressCompany = (id, companyName) => {
        companyAllBranches(id);
        setShowBranches(true);
        setCompanyName(companyName)
    }

    // Ensure MapView works well on Web, if needed
    const isWeb = Platform.OS === 'web';

    return (
        <View style={{ flex: 1 }}>
            <MapView
                style={{ flex: 1 }}
                region={region}
                showsUserLocation={true}
                showsMyLocationButton={false}
                userLocationPriority="high"
                showsCompass={false}
                provider={isWeb ? PROVIDER_GOOGLE : null} 
            >
                {branches.map(marker => (
                    <Marker
                        key={marker.id}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        title={marker.title}
                        description={marker.description}
                        onPress={() => onMarekerPress(marker.id, marker.imageUrl, marker.address, marker.companyName, marker.companyLogoFileName)}
                        pinColor={marker.companyColour}
                    >
                        <Callout>
                            <View style={{ width: 150, padding: 5 }} />
                        </Callout>
                    </Marker>
                ))}
            </MapView>
            <PanGestureHandler onGestureEvent={handleGesture}>
                <Animated.View style={[{ position: 'absolute', bottom: 0, width: '100%', backgroundColor: '#E0E0E0', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 5, overflow: 'hidden' }, animatedStyle]}>
                    <View style={{ width: 40, height: 5, backgroundColor: '#CCC', borderRadius: 2.5, alignSelf: 'center', marginVertical: 10 }} />
                    {shopInfoShow ? (
                        <BranchInfo image={image} address={address} id={companyId} companyName={companyName} logo={logo} navigation={navigation} imageHeader={uiImagePath} onBack={onBackPress} />
                    ) : (
                        <ListOfCompanies navigation={navigation} shops={shops} onPressCompany={onPressCompany} companyBranches={companyBranches} showBranches={showBranches} companyImage={companyImage} onBranchPress={onMarekerPress} companyName={companyName} onBackPress={fetchShops} />
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
        // flex: 1,
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