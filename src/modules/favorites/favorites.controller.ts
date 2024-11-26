import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { User } from 'src/common/decorators/customise.decorator';
import { IUser } from '../users/users.interface';

@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService
  ) {}

  @Get('')
  getListFavorite(
    @User() user: IUser
  ){
    return this.favoritesService.getListFavorite(user._id)
  }

  @Post('like/:id')
  @HttpCode(HttpStatus.OK)
  likePost(
    @Param('id') idPost: string,
    @User() user: IUser
  ){
    return this.favoritesService.likePost(idPost, user._id)
  }
}
