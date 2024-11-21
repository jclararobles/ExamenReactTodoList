import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, Switch, StyleSheet } from 'react-native';
import { db } from './firebase';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';

const MainPage = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'tasks'));
      const tasksList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksList);
      setLoading(false);
    } catch (error) {
      Alert.alert('Error', 'Ha ocurrido un error al cargar las tareas');
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTasks();
    const unsubscribe = navigation.addListener('focus', fetchTasks);
    return unsubscribe;
  }, [navigation]);

  const toggleTaskCompletion = async (id, currentCompletion) => {
    const newCompletionStatus = !currentCompletion;  // Invertir el estado actual
    const taskRef = doc(db, 'tasks', id);

    // Actualizar la tarea en la base de datos
    try {
      await updateDoc(taskRef, { Completed: newCompletionStatus });
      // Actualizar el estado local de la tarea después de la actualización en la base de datos
      setTasks(prevTasks => prevTasks.map(task =>
        task.id === id ? { ...task, Completed: newCompletionStatus } : task
      ));
    } catch (error) {
      Alert.alert('Error', 'Ha ocurrido un error al actualizar la tarea');
      console.error(error);
    }
  };

 const deleteTask = (id) => {
  Alert.alert(
    'Confirmación',
    '¿Seguro que quieres eliminar esta tarea?',
    [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          // Eliminar de la lista local primero para que no se vea inmediatamente
          setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
          
          // Eliminar la tarea en Firestore
          try {
            const taskRef = doc(db, 'tasks', id);
            await deleteDoc(taskRef);
          } catch (error) {
            Alert.alert('Error', 'Ha ocurrido un error al eliminar la tarea');
            console.error(error);
          }
        },
      },
    ]
  );
};

  const renderTask = ({ item }) => (
    <View style={styles.taskContainer}>
      <Switch
        value={item.Completed}  // Usamos el valor directamente desde el estado local de la tarea
        onValueChange={() => toggleTaskCompletion(item.id, item.Completed)}  // Se invierte el valor de 'Completed'
        trackColor={{ false: "#767577", true: "#81b0ff" }}
        thumbColor={item.Completed ? "#f5dd4b" : "#f4f3f4"}
      />
      <View style={styles.taskDetails}>
        <Text style={[styles.taskTitle, item.Completed && styles.completedTask]}>
          {item.Title}
        </Text>
        <Text style={styles.taskDate}>{item.Date || 'Sin fecha de vencimiento'}</Text>
      </View>
      <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditTask', { task: item })}>
        <Text style={styles.buttonText}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTask(item.id)}>
        <Text style={styles.buttonText}>Eliminar</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando tareas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Tareas</Text>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity style={styles.createButton} onPress={() => navigation.navigate('CreateTask')}>
        <Text style={styles.buttonText}>Crear Tarea</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
  },
  taskContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  taskDetails: {
    flex: 1,
    marginLeft: 10,
  },
  taskTitle: {
    fontSize: 18,
    color: '#333',
  },
  completedTask: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskDate: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#FF4C4C',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  createButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
});

export default MainPage;
