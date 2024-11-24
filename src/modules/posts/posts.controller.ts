import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseInterceptors, UploadedFile, BadRequestException, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { Public, User } from 'src/common/decorators/customise.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { sendResponse } from 'src/config';
import { IUser } from '../users/users.interface';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
  ) { }

  // [GET]: /api/posts?page=
  @Get('')
  @Public()
  @HttpCode(HttpStatus.OK)
  async getListPost(
    @Query("page") page: number
  ) {    
    return this.postsService.getListPost(page < 1 ? 1 : page)
  }

  // [GET]: api/posts/follow?page=
  @Get('follow')
  @HttpCode(HttpStatus.OK)
  async getListPostByFollow(
    @Query("page") page: number,
    @User() user: IUser
  ) {    
    return this.postsService.getListPostByFollow(page < 1 ? 1 : page, user)
  }

  // [GET]: /api/posts/slug/:slug
  @Get('slug/:slug')
  @Public()
  @HttpCode(HttpStatus.OK)
  async getPostBySlug(
    @Param("slug") slug: string
  ) {
    return this.postsService.findByslug(slug)
  }

  // [GET]: /api/posts/user/:id
  @Get('user/:id')
  @Public()
  @HttpCode(HttpStatus.OK)
  async getPostByIdUser(
    @Param("id") id: string
  ) {
    return this.postsService.findByIdUser(id)
  }

  // [POST]: /api/posts
  @Post('')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (_, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new BadRequestException(sendResponse("error", "Chỉ được phép tải ảnh lên", null)), false)
        }
        callback(null, true)
      },
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  async upPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile() image: Express.Multer.File,
    @User() user: IUser
  ) {
    return this.postsService.upPost(createPostDto, image, user)
  }

  // [PATCH]: /api/posts/:id
  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('image', {
      fileFilter: (_, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(new BadRequestException(sendResponse("error", "Chỉ được phép tải ảnh lên", null)), false)
        }
        callback(null, true)
      },
    }),
  )
  @HttpCode(HttpStatus.OK)
  async editPost(
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile() image: Express.Multer.File,
    @User() user: IUser,
    @Param('id') id: string
  ) {
    return this.postsService.editPost(updatePostDto, image, user, id)
  }

  // [DELETE]: /api/posts/:id
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deletePost(
    @Param("id") id: string,
    @User() user: IUser
  ) {
    return this.postsService.deletePost(id, user)
  }
}
