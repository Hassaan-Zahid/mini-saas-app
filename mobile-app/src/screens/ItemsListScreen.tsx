import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
// @ts-ignore
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import axios from '../api';
import { useAuth } from '../context/AuthContext';
import Pusher from 'pusher-js';

type ItemsListScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'ItemsList'>;
};

const ItemsListScreen: React.FC<ItemsListScreenProps> = ({ navigation }) => {
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { user, logout } = useAuth();
    const fetchItems = async () => {
        try {
            const { data } = await axios.get('/api/items');
            setItems(data);
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchItems();

        // @ts-ignore
        const pusher = new Pusher('e154607f3abdcae7338e', {
            cluster: 'ap2',
            encrypted: true
        });

        const channel = pusher.subscribe('items');
        channel.bind('item.created', (data: any) => {
            setItems(prev => [...prev, data.item]);
        });
        channel.bind('item.status.updated', (data: any) => {
            setItems(prev => prev.map(item =>
                item.id === data.item.id ? data.item : item
            ));
        });

        return () => {
            pusher.unsubscribe('items');
        };
    }, []);

    const handleRefresh = () => {
        setRefreshing(true);
        fetchItems();
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#6200EE" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Items</Text>
                {user && (
                    <View style={styles.headerButtons}>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.navigate('CreateItem')}
                        >
                            <Text style={styles.buttonText}>Add Item</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => logout(navigation)}
                        >
                            <Text style={styles.buttonText}>Logout</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <FlatList
                data={items}
                refreshing={refreshing}
                onRefresh={handleRefresh}
                keyExtractor={(item, index) => item.id ? item.id.toString() : `${item.title}-${index}`}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={styles.item}
                        onPress={() => navigation.navigate('ItemDetail', { id: item.id })}
                    >
                        <View style={styles.itemContent}>
                            <View style={styles.itemRow}>
                                <Text style={styles.itemLabel}>Title:</Text>
                                <Text style={styles.itemText}>{item.title}</Text>
                            </View>
                            <View style={styles.itemRow}>
                                <Text style={styles.itemLabel}>Price:</Text>
                                <Text style={styles.itemText}>${item.price}</Text>
                            </View>
                            <View style={styles.itemRow}>
                                <Text style={styles.itemLabel}>Status:</Text>
                                <Text style={[styles.itemText, item.status === 'active' ? styles.active : styles.inactive]}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f8f8f8',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#333',
    },
    headerButtons: {
        flexDirection: 'row',
    },
    button: {
        backgroundColor: '#6200EE',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginLeft: 10,
        elevation: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemPrice: {
        fontSize: 16,
        color: '#6200EE',
        marginVertical: 5,
    },
    itemStatus: {
        fontSize: 14,
        fontWeight: '600',
    },
    item: {
        padding: 15,
        marginBottom: 12,
        backgroundColor: 'white',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    itemContent: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    itemLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        width: 80,
    },
    itemText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    active: {
        color: 'green',
        fontWeight: 'bold',
    },
    inactive: {
        color: 'red',
        fontWeight: 'bold',
    },

});

export default ItemsListScreen;
