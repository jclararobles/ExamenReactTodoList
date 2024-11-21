import React, { useState, useEffect } from 'react';
import { View, TextInput, Text, Button, Switch, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { db } from './firebase';  // Importa la configuración de Firebase
import { doc, updateDoc } from 'firebase/firestore';  // Funciones de Firestore

const EditTask = ({ route, navigation }) => {
  const { task } = route.params;

  const [title, setTitle] = useState(task.Title);
  const [date, setDate] = useState(task.Date || '');  // Maneja fecha vacía si no tiene
  const [hasDueDate, setHasDueDate] = useState(!!task.Date);

  useEffect(() => {
    setTitle(task.Title);
    setDate(task.Date || ''); // Asegura que la fecha sea vacía si no está presente
    setHasDueDate(!!task.Date);
  }, [task]);

  const handleEditTask = async () => {
    if (!title) {
      Alert.alert('Error', 'El títol és obligatori!');
      return;
    }

    const updatedTask = { ...task, Title: title, Date: hasDueDate ? date : null };

    try {
      const taskRef = doc(db, 'tasks', task.id);
      await updateDoc(taskRef, updatedTask);
      navigation.goBack(); // Regresa a la pantalla anterior
    } catch (error) {
      Alert.alert('Error', 'Ha ocurrido un error al editar la tarea');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Editar Tasca</Text>

      <TextInput
        style={styles.input}
        placeholder="Títol de la tasca"
        value={title}
        onChangeText={setTitle}
      />

      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Té data de venciment?</Text>
        <Switch
          value={hasDueDate}
          onValueChange={setHasDueDate}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={hasDueDate ? "#f5dd4b" : "#f4f3f4"}
        />
      </View>

      {hasDueDate && (
        <TextInput
          style={styles.input}
          placeholder="Data de venciment"
          value={date}
          onChangeText={setDate}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleEditTask}>
        <Text style={styles.buttonText}>Desa Canvis</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Cancel·lar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  cancelButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditTask;
