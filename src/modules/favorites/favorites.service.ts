import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Favorite } from './schemas/favorite.schema';
import { Model } from 'mongoose';
import { sendResponse } from 'src/config';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectModel(Favorite.name) private favoriteModel: Model<Favorite>,
  ){}

  async getListFavorite(id: string){
    const favorites = await this.favoriteModel.find({user: id})
      .populate({
        path: "post",
        select: "-image",
        populate: {
          path: "user",
          select: "fullName avatar slug"
        }
      })
      
    return sendResponse("success", "Lấy danh sách yêu thích thành công", favorites)
  }

  async likePost(idPost: string, idUser: string){
    const favoriteRecord = await this.favoriteModel.findOne({
      user: idUser,
      post: idPost
    })
    if(favoriteRecord){
      await favoriteRecord.deleteOne()
      return sendResponse("success", "Xóa bài viết khỏi mục yêu thích thành công", null)
    }else{
      const favorite = await this.favoriteModel.create({user: idUser, post: idPost})
      return sendResponse("success", "Thêm bài viết vào mục yêu thích thành công", favorite)
    }
  }

  async deleteByIdPost(id: string){
    await this.favoriteModel.deleteMany({post: id})
  }
}
