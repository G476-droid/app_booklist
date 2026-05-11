import React, { useEffect, useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";

import { formStyles } from "../styles/appStyles";
import { ScreenProps } from "../navigation/typesNavigation";
import { NewBook } from "../types/book";
import { bookService } from "../services/bookService";

type Props = ScreenProps<"Form">;

export const FormScreen = ({ route, navigation }: Props) => {
  const id = route.params?.id;
  const isEditMode: boolean = id !== undefined;

  const [form, setForm] = useState({
    title: "",
    author: "",
    year: "",
    genre: "",
  });

  const [saving, setSaving] = useState<boolean>(false);

  useEffect(() => {
    if (isEditMode && id !== undefined) {
      loadBook(id);
    }
  }, [id]);

  const loadBook = async (bookId: number): Promise<void> => {
    try {
      const book = await bookService.getById(bookId);

      if (book === null) {
        Alert.alert("Error", "Libro no encontrado");
        navigation.goBack();
        return;
      }

      setForm({
        title: book.title,
        author: book.author,
        year: book.year.toString(),
        genre: book.genre,
      });
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el libro");
      console.error(error);
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setForm((form) => ({ ...form, [key]: value }));
  };

  const handleSave = async (): Promise<void> => {
    if (saving) return;

    if (
      form.title.trim() === "" ||
      form.author.trim() === "" ||
      form.year.trim() === "" ||
      form.genre.trim() === ""
    ) {
      Alert.alert("Campos incompletos", "Por favor, llena todos los campos");
      return;
    }

    const yearNumber = Number(form.year);

    if (isNaN(yearNumber) || yearNumber < 1000 || yearNumber > 2026) {
      Alert.alert("Año inválido", "Ingrese un año entre 1000 y 2026");
      return;
    }

    const newBook: NewBook = {
      title: form.title.trim(),
      author: form.author.trim(),
      year: yearNumber,
      genre: form.genre.trim(),
    };

    try {
      setSaving(true);

      if (isEditMode && id !== undefined) {
        await bookService.update(id, newBook);

        Alert.alert("Exitoso", "Libro actualizado con éxito", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      } else {
        await bookService.create(newBook);

        Alert.alert("Exitoso", "Libro creado con éxito", [
          {
            text: "OK",
            onPress: () => navigation.goBack(),
          },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "No se logró guardar el libro");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }}>
      <ScrollView
        style={formStyles.container}
        contentContainerStyle={formStyles.scrollContent}
      >
        <Text style={formStyles.title}>
          {isEditMode ? "Editar Libro" : "Nuevo Libro"}
        </Text>

        <Text style={formStyles.label}>Título *</Text>
        <TextInput
          style={formStyles.input}
          value={form.title}
          onChangeText={(value) => handleInputChange("title", value)}
          placeholder="Ej: Clean Code"
          maxLength={60}
        />

        <Text style={formStyles.label}>Autor *</Text>
        <TextInput
          style={formStyles.input}
          value={form.author}
          onChangeText={(value) => handleInputChange("author", value)}
          placeholder="Ej: Robert C. Martin"
          maxLength={60}
        />

        <Text style={formStyles.label}>Año *</Text>
        <TextInput
          style={formStyles.input}
          value={form.year}
          onChangeText={(value) => handleInputChange("year", value)}
          keyboardType="numeric"
          placeholder="Ej: 2008"
        />

        <Text style={formStyles.label}>Género *</Text>
        <TextInput
          style={formStyles.input}
          value={form.genre}
          onChangeText={(value) => handleInputChange("genre", value)}
          placeholder="Ej: Programación"
          maxLength={60}
        />

        <TouchableOpacity
          style={[
            formStyles.saveButton,
            saving && formStyles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={saving}
        >
          <Text style={formStyles.saveButtonText}>
            {saving
              ? "Guardando..."
              : isEditMode
              ? "Actualizar Libro"
              : "Guardar Libro"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={formStyles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={formStyles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
