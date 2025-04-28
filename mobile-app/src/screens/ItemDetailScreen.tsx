import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native';
// @ts-ignore
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../types';
import axios from '../api';
import { useAuth } from '../context/AuthContext';

type ItemDetailScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'ItemDetail'>;
    route: RouteProp<RootStackParamList, 'ItemDetail'>;
};

const ItemDetailScreen: React.FC<ItemDetailScreenProps> = ({ navigation, route }) => {
    const { id } = route.params;
    const [item, setItem] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const { data } = await axios.get(`/api/items/${id}`);
                setItem(data);
            } catch (error) {
                console.error('Error fetching item:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!item) {
        return (
            <View style={styles.center}>
                <Text>Item not found</Text>
            </View>
        );
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Item Details</Text>

            <View style={styles.detailSection}>
                <Text style={styles.label}>Title:</Text>
                <Text style={styles.detailText}>{item.title}</Text>
            </View>

            <View style={styles.detailSection}>
                <Text style={styles.label}>Description:</Text>
                <Text style={styles.detailText}>{item.description}</Text>
            </View>

            <View style={styles.detailSection}>
                <Text style={styles.label}>Price:</Text>
                <Text style={styles.detailText}>${item.price}</Text>
            </View>

            <View style={styles.detailSection}>
                <Text style={styles.label}>Status:</Text>
                <Text style={item.status === 'active' ? styles.active : styles.inactive}>
                    {item.status}
                </Text>
            </View>

            <View style={styles.detailSection}>
                <Text style={styles.label}>Owner:</Text>
                <Text style={styles.detailText}>{item.owner?.name}</Text>
            </View>

            {user && (user.id === item.owner_id || user.role_id === 1) && (
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditItem', { id: item.id })}
                >
                    <Text style={styles.editButtonText}>Edit Item</Text>
                </TouchableOpacity>
            )}

            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Back to Items</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    detailSection: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    detailText: {
        fontSize: 16,
        color: '#555',
    },
    active: {
        color: 'green',
        fontSize: 16,
    },
    inactive: {
        color: 'red',
        fontSize: 16,
    },
    editButton: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    backButton: {
        backgroundColor: '#6c757d',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default ItemDetailScreen;
