// books.controller.ts

import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, HttpStatus, Res, HttpException, UseFilters } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard';
import { ResponseDto } from 'src/common/dto/response.dto';
import { ExpressAdapter } from '@nestjs/platform-express';
import { HttpAdapterHost } from '@nestjs/core';
import { CustomUnauthorizedExceptionFilter } from 'src/common/filters/custom-unauthorised-exception.filter';

@Controller('books')
@ApiTags('Books')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseFilters(CustomUnauthorizedExceptionFilter)
export class BooksController {
  httpAdapter: ExpressAdapter;
  constructor(
    private readonly booksService: BooksService,
    private readonly httpAdapterHost: HttpAdapterHost<ExpressAdapter>,
  ) {
    this.httpAdapter = this.httpAdapterHost.httpAdapter;
  }

  @Get()
  @ApiOperation({ summary: 'List All Books' })
  async getAllBooks(@Res({ passthrough: true }) res: Response) {
    const books = await this.booksService.getAllBooks();

    this.httpAdapter.status(res, HttpStatus.OK);

    return new ResponseDto(HttpStatus.OK, 'List all books', books);
  }

  @Get(':id')
  @ApiOperation({ summary: 'List individual book based on id' })
  async getBookById(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const book = await this.booksService.getBookById(id);

    this.httpAdapter.status(res, HttpStatus.OK);

    return new ResponseDto(HttpStatus.OK, 'Fetched book detail successfully', book);
  }

  @Post()
  @ApiOperation({ summary: 'Add new book record' })
  @ApiBody({
    description: 'Add new book record',
    schema: {
      example: {
        title: 'New Book Title',
        isbn: 'ITI123'
      },
    },
  })
  async createBook(@Body() createBookDto: CreateBookDto, @Res({ passthrough: true }) res: Response) {
    const book = await this.booksService.createBook(createBookDto);
    this.httpAdapter.status(res, HttpStatus.CREATED);

    return new ResponseDto(HttpStatus.CREATED, 'Added new book successfully', book);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update existing book record' })
  @ApiBody({
    description: 'Update existing books',
    schema: {
      example: {
        title: 'Updated Book Title',
      },
    },
  })
  async updateBookTitle(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto, @Res({ passthrough: true }) res: Response) {
    await this.booksService.updateBook(id, updateBookDto);

    this.httpAdapter.status(res, HttpStatus.OK);

    return new ResponseDto(HttpStatus.OK, 'Book details updated successfully', {});
  }

  @Delete(':id')
  async deleteBook(@Param('id') id: string, @Res({ passthrough: true }) res: Response) {
    const response = await this.booksService.deleteBook(id);

    this.httpAdapter.status(res, HttpStatus.OK);

    return new ResponseDto(HttpStatus.OK, 'Record Deleted successfully', {});
  }
}
