import { HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { Book } from 'src/models/book.model';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);
  /**
   * 
   * @description Method to fetch all books record
   * @returns {Object} Book[] 
   * 
  */
  async getAllBooks(): Promise<Book[]> {
    try {
      return Book.findAll();
    } catch (error) {
      this.logger.error({ error });
      throw new HttpException(
        'Failed to fetch list of books',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 
   * @description Method to fetch book by ID
   * @Param {Integer} id
   * @returns {Object} Book
   * 
  */
  async getBookById(id: string): Promise<Book> {
    const book = await Book.findByPk(id);

    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return book;
  }

  /**
   * 
   * @description Method to create new book
   * @Param {Object} CreateBookDto
   * @returns {Object} Book 
   * 
  */
  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    try {
      const { title, isbn } = createBookDto;
      return Book.create({ title, isbn });
    } catch (error) {
      this.logger.error({ error });
      throw new HttpException(
        'Failed to add book reference',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 
   * @description Update book title 
   * @Param {Integer, Object} id UpdateBookDto
   * @returns { Book } 
   * 
  */
  async updateBook(id: string, updateBookDto: UpdateBookDto): Promise<Object> {

    const book = await this.getBookById(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    try {
      const response = await Book.update(
        updateBookDto,
        { where: { id } }
      );
      return response;
      // book.title = updateBookDto.title;
      // return book.save();
    } catch (error) {
      this.logger.error({ error });
      throw new HttpException(
        'Failed to update book detail',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * 
   * @description Delete book 
   * @Param {Integer} id
   * 
  */
  async deleteBook(id: string): Promise<Boolean | any> {
    const book = await this.getBookById(id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    try {
      return Book.destroy({ where: { id } });
    } catch (error) {
      this.logger.error({ error });
      throw new HttpException(
        'Failed to delete book reference',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

