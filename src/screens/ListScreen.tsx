import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { listStyles } from "../styles/appStyles";
import { ScreenProps } from "../navigation/typesNavigation";
import { useCallback, useState } from "react";
import { Book } from "../types/book";
import {bookService } from "../services/bookService";
import { useFocusEffect } from "@react-navigation/native";

type Props = ScreenProps<"List">;

export const ListScreen = ({ navigation }: Props) => {
  const [books, setBooks] = useState<Book[]>([]);

  //Verificar la carga, para evitar que la pantalla se muestre vacía
  const [loading, setLoading] = useState<boolean>(false);

  //Buscar por nombre
  const [searchText, setSearchText] = useState<string>("");

  //useFocusEffect: permite ejecutar loadcCourses cada vez que la pantalla vuelve
  //a estar isible.
  //Así grarantizamos que siempre veamos los datos actualizados.
  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, []),
  );

  const loadBooks = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await bookService.getAll();
      setBooks(data);
    } catch (error) {
      Alert.alert("Error", "No se puede cargar los libros");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  //Arreglo con datos filrados
  const filteredBooks = books.filter((book) => 
    book.title.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={listStyles.container}>
      {/* Search bar */}
      <View style={listStyles.searchContainer}>
        <TextInput
          style={listStyles.searchInput}
          placeholder="🔍 Buscar por nombre..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={listStyles.list}
        ListEmptyComponent={<Text style={listStyles.emptyText}>
          <Text style={listStyles.emptyText}>
            {loading
            ? "Cargando..."
            : searchText
            ? "Libro no encontrado"
            : "Todavía no hay libros. Crea el primer libro!"
            }
          </Text>
        </Text>}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={listStyles.card}
            onPress={() => navigation.navigate("Detail", { id: item.id })}
          >
            <Text style={listStyles.cardName}>{item.title}</Text>
            <Text style={listStyles.cardDetail}>
              {item.author} - {item.year}
            </Text>
            <Text style={listStyles.cardGenre}>{item.genre}</Text>
          </TouchableOpacity>
        )}
      />

      <TouchableOpacity
        style={listStyles.fab}
        onPress={() => navigation.navigate("Form", {})}
      >
        <Text style={listStyles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};