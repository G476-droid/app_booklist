import { getDatabase } from "../database/database";
import { Book, NewBook } from "../types/book";

export const bookService = {
  //CREATE
  async create(book: NewBook): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      "INSERT INTO books(title, author, year, genre) VALUES (?, ?, ?, ?)",
      [book.title, book.author, book.year, book.genre],
    );
    return result.lastInsertRowId;
  },

  //READ (ALL)
  async getAll(): Promise<Book[]> {
    const db = await getDatabase();
    const books = await db.getAllAsync<Book>(
      "SELECT * FROM books ORDER BY title ASC",
    );
    return books;
  },

  //READ (BY ID)
  async getById(id: number): Promise<Book | null> {
    const db = await getDatabase();
    const book = await db.getFirstAsync<Book>(
      "SELECT * FROM books WHERE id = ?",
      [id],
    );
    return book ?? null;
  },

  //UPDATE
  async update(id: number, book: NewBook): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      "UPDATE books SET title=?, author=?, year=?, genre=? WHERE id=?",
      [book.title, book.author, book.year, book.genre, id],
    );
  },

  //DELETE
  async delete(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync("DELETE FROM books WHERE id = ?", [id]);
  },
};
