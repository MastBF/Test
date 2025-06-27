import React, { useEffect, useState } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, Animated, Easing, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const ProdInfo = ({ visible, productInfo, onClose, onAddToCart, companyColor, handleVisibility }) => {
    const [opacityAnim] = useState(new Animated.Value(0));
    const [translateYAnim] = useState(new Animated.Value(100));
    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 300,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.out(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(opacityAnim, {
                    toValue: 0,
                    duration: 300,
                    easing: Easing.ease,
                    useNativeDriver: true,
                }),
                Animated.timing(translateYAnim, {
                    toValue: 100,
                    duration: 300,
                    easing: Easing.in(Easing.ease),
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const onAdd = () => {
        onAddToCart();
        handleVisibility();
    };
    if (!visible || !productInfo) return null;

    return (
        <Modal transparent visible={visible} animationType="none"  >
            <View style={styles.overlay}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        { opacity: opacityAnim, transform: [{ translateY: translateYAnim }] },
                    ]}
                >
                    <TouchableOpacity style={styles.closeIcon} onPress={onClose}>
                        <AntDesign name="closecircle" size={24} color="#000" />
                    </TouchableOpacity>
                    <Image source={{ uri: productInfo.item.fileName }} style={styles.image} />
                    <Text style={[styles.productName, { color: companyColor }]}>{productInfo.name}</Text>
                    {/* <Text style={styles.description}>{productInfo.description}</Text> */}
                    <Text style={styles.description}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium adipisci asperiores blanditiis placeat </Text>
                    <Text style={styles.price}>Price: {productInfo.price} AMD</Text>
                    <TouchableOpacity style={[styles.addToCartButton, { backgroundColor: companyColor }]} onPress={onAdd} >
                        <Text style={styles.addToCartText}>Add to Cart</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    closeIcon: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    image: {
        width: 150,
        height: 200,
        resizeMode: 'contain',
        marginVertical: 10,
    },
    productName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    description: {
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 10,
    },
    price: {
        fontSize: 16,
        color: '#333',
        marginVertical: 10,
    },
    addToCartButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
        marginTop: 20,
    },
    addToCartText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default ProdInfo;

