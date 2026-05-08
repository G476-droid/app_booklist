import React, { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import { ScreenProps } from "../navigation/typesNavigation";
import { Book } from "../types/book";
import { bookService } from "../services/bookService";
import { useFocusEffect } from "@react-navigation/native";
import { detailStyles } from "../styles/appStyles";

type Props = ScreenProps<"Detail">;

export default function DetailScreen({ route, navigation }: Props) {
  const { id } = route.params;

  const [book, setBook] = useState<Book | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadBook();
    }, []),
  );

  const loadBook = async (): Promise<void> => {
    try {
      const data = await bookService.getById(id);
      setBook(data);
      if (data === null) {
        Alert.alert("Error", "Libro no encontrado");
        navigation.goBack();
        return;
      }
    } catch (error) {
      Alert.alert("Error", "No se puede cargar el libro");
      console.error(error);
    }
  };

  const confirmDelete = (): void => {
    if (book === null) return;

    Alert.alert(
      "Eliminar libro",
      `Estás seguro que quieres eliminar el libro "${book.title}"? Está acción no se puede deshacer.`,
      [
        {text: "Cancelar", style: "cancel"},
        {text: "Eliminar", style:"destructive", onPress: handleDelete}
      ]
    )
  };

  const handleDelete = async (): Promise<void> => {
    if (book === null) return;
    try {
      await bookService.delete(book.id);
      Alert.alert("Exitoso", "Libro eliminado con éxito");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "El libro no se puede eliminar");
      console.error(error);
    }
  };

  if (book === null) {
    return (
      <View style={detailStyles.container}>
        <Text style={detailStyles.loadingText}>Cargando....</Text>
      </View>
    );
  }

  return (
    <ScrollView style={detailStyles.container}>
      <View style={detailStyles.card}>
        <Text style={detailStyles.title}>{book.title}</Text>

        <View style={detailStyles.field}>
          <Text style={detailStyles.label}>Autor</Text>
          <Text style={detailStyles.value}>{book.author}</Text>
        </View>

        <View style={detailStyles.field}>
          <Text style={detailStyles.label}>Año</Text>
          <Text style={detailStyles.value}>{book.year}</Text>
        </View>

        <View style={detailStyles.field}>
          <Text style={detailStyles.label}>Genero</Text>
          <Text style={detailStyles.value}>{book.genre}</Text>
        </View>

        <View style={detailStyles.buttonContainer}>
          <TouchableOpacity
            style={detailStyles.editButton}
            onPress={() => navigation.navigate("Form", { id: book.id })}
          >
            <Text style={detailStyles.editButtonText}>✏️ Editar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={detailStyles.deleteButton}
            onPress={confirmDelete}
          >
            <Text style={detailStyles.deleteButtonText}>🗑️ Eliminar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
