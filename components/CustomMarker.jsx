import React, { memo } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Marker } from 'react-native-maps';
import logo from '../assets/images/iceLavaLogo.png';
import Svg, { Path } from 'react-native-svg';
const MarkerCustom = ({ coordinate }) => {
    return (
        <Marker coordinate={coordinate}>
            <View style={{ width: 50, height: 50 }}>
                <Svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <Path d="M19.7 3.2C17.5 1.1 14.8 0 11.9 0C8.89995 0 6.29995 1.1 4.09995 3.2C1.79995 5.3 0.699951 8.1 0.699951 11.3C0.699951 13.7 1.59995 16.2 3.29995 18.7C4.89995 21 7.29995 23.5 10.6 26.2L11.9 27.3L13.2 26.2C16.4 23.5 18.9 21 20.5 18.7C22.2 16.2 23.1 13.7 23.1 11.3C23 8.1 21.9 5.3 19.7 3.2ZM18.8 17.6C17.3 19.8 15 22.1 11.9 24.7C8.79995 22.1 6.49995 19.8 4.99995 17.6C3.49995 15.4 2.69995 13.3 2.69995 11.3C2.69995 8.6 3.59995 6.3 5.39995 4.6C7.19995 2.9 9.39995 2 11.9 2C14.4 2 16.5 2.9 18.3 4.6C20.1 6.3 21 8.6 21 11.3C21 13.3 20.3 15.4 18.8 17.6Z" fill="white" />
                    <Path d="M18.3 4.6C16.5 2.9 14.3 2 11.9 2C9.39995 2 7.19995 2.9 5.39995 4.6C3.59995 6.4 2.69995 8.6 2.69995 11.3C2.69995 13.3 3.49995 15.4 4.99995 17.5C6.49995 19.6 8.79995 22 11.9 24.6C15 22 17.3 19.7 18.8 17.5C20.3 15.3 21.1 13.2 21.1 11.3C21 8.6 20.1 6.4 18.3 4.6Z" fill="#3BDC65" />
                    <Path d="M11.8999 13.1992C12.3999 13.1992 12.8999 12.9992 13.2999 12.5992C13.6999 12.1992 13.8999 11.7992 13.8999 11.1992C13.8999 10.6992 13.6999 10.1992 13.2999 9.79922C12.8999 9.39922 12.4999 9.19922 11.8999 9.19922C11.3999 9.19922 10.8999 9.39922 10.4999 9.79922C10.0999 10.1992 9.8999 10.6992 9.8999 11.1992C9.8999 11.6992 10.0999 12.1992 10.4999 12.5992C10.8999 12.9992 11.2999 13.1992 11.8999 13.1992Z" fill="white" />
                </Svg>
            </View>
        </Marker>
    );
};

const styles = StyleSheet.create({
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pinContainer: {
        width: 40,
        height: 40,
        borderRadius: 25, // Circular shape
        backgroundColor: '#FFFFFF', // Background for contrast
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#4285F4', // Blue color like Google's
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.4,
        shadowRadius: 3,
        elevation: 5,
    },
    pinTip: {
        width: 12, // Bottom part width of the drop
        height: 12,
        backgroundColor: '#4285F4',
        transform: [{ rotate: '45deg' }], // Rotation for triangle shape
        marginTop: -6, // Overlapping the top part
    },
    logo: {
        width: 20, // Logo size inside the marker
        height: 20,
        resizeMode: 'contain',
    },
});

export default MarkerCustom;



// {
//     branches?.map((item) => (


//     <Marker
//         coordinate={{
//             latitude: item?.latitude ?? 0, // Latitude of the USA
//             longitude: item?.longitude ?? 0, // Longitude of the USA
//         }}
//         key={item.id}

//     >

// <View style={{ width: 50, height: 50 }}>
//     <Svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
//         <Path d="M19.7 3.2C17.5 1.1 14.8 0 11.9 0C8.89995 0 6.29995 1.1 4.09995 3.2C1.79995 5.3 0.699951 8.1 0.699951 11.3C0.699951 13.7 1.59995 16.2 3.29995 18.7C4.89995 21 7.29995 23.5 10.6 26.2L11.9 27.3L13.2 26.2C16.4 23.5 18.9 21 20.5 18.7C22.2 16.2 23.1 13.7 23.1 11.3C23 8.1 21.9 5.3 19.7 3.2ZM18.8 17.6C17.3 19.8 15 22.1 11.9 24.7C8.79995 22.1 6.49995 19.8 4.99995 17.6C3.49995 15.4 2.69995 13.3 2.69995 11.3C2.69995 8.6 3.59995 6.3 5.39995 4.6C7.19995 2.9 9.39995 2 11.9 2C14.4 2 16.5 2.9 18.3 4.6C20.1 6.3 21 8.6 21 11.3C21 13.3 20.3 15.4 18.8 17.6Z" fill="white" />
//         <Path d="M18.3 4.6C16.5 2.9 14.3 2 11.9 2C9.39995 2 7.19995 2.9 5.39995 4.6C3.59995 6.4 2.69995 8.6 2.69995 11.3C2.69995 13.3 3.49995 15.4 4.99995 17.5C6.49995 19.6 8.79995 22 11.9 24.6C15 22 17.3 19.7 18.8 17.5C20.3 15.3 21.1 13.2 21.1 11.3C21 8.6 20.1 6.4 18.3 4.6Z" fill="#3BDC65" />
//         <Path d="M11.8999 13.1992C12.3999 13.1992 12.8999 12.9992 13.2999 12.5992C13.6999 12.1992 13.8999 11.7992 13.8999 11.1992C13.8999 10.6992 13.6999 10.1992 13.2999 9.79922C12.8999 9.39922 12.4999 9.19922 11.8999 9.19922C11.3999 9.19922 10.8999 9.39922 10.4999 9.79922C10.0999 10.1992 9.8999 10.6992 9.8999 11.1992C9.8999 11.6992 10.0999 12.1992 10.4999 12.5992C10.8999 12.9992 11.2999 13.1992 11.8999 13.1992Z" fill="white" />
//     </Svg>
// </View>
//     </Marker>


// ))}