import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Keyboard,
    TouchableWithoutFeedback,
    Platform, KeyboardAvoidingView
} from 'react-native';
// @ts-ignore
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types';
import axios from '../api';

type CreateItemScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'CreateItem'>;
};

const CreateItemScreen: React.FC<CreateItemScreenProps> = ({ navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [status, setStatus] = useState('active');
    const [error, setError] = useState('');

    const handleCreate = async () => {
        if (!title || !description || !price) {
            setError('Please fill in all fields');
            return;
        }

        try {
            await axios.post('/api/items', {
                title,
                description,
                price: parseFloat(price),
                status
            });
            navigation.navigate('ItemsList');
        } catch (err) {
            setError('Error creating item');
            console.error('Error creating item:', err);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            <ScrollView>
                <Text style={styles.title}>Create New Item</Text>
                {error ? <Text style={styles.error}>{error}</Text> : null}
                <View style={styles.formCard}>
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Title:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter item title"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Description:</Text>
                        <TextInput
                            style={[styles.input, styles.multilineInput]}
                            placeholder="Enter item description"
                            value={description}
                            onChangeText={setDescription}
                            multiline
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Price:</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter item price"
                            value={price}
                            onChangeText={setPrice}
                            keyboardType="numeric"
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleCreate}>
                        <Text style={styles.buttonText}>Create Item</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#f7f7f7',
    },
    title: {
        fontSize: 28,
        marginBottom: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#333',
    },
    formCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    multilineInput: {
        height: 120,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#007bff',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
    },
});

export default CreateItemScreen;
