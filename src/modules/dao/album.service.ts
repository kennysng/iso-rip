import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Album } from 'src/models/album.model';
import { BaseDaoService } from './dao.service';

@Injectable()
export class AlbumDaoService extends BaseDaoService<Album> {
  constructor(sequelize: Sequelize, @InjectModel(Album) model: typeof Album) {
    super(sequelize, model, { deleteMode: 'destroy' });
  }

  // @override
  public toJSON(instance: Album): Album {
    return {
      id: instance.id,
      name: instance.name,
      year: instance.year,
      type: instance.type,
      performer: instance.performer,
      author: instance.author,
      createdAt: instance.createdAt,
      updatedAt: instance.updatedAt,
    } as Album;
  }
}
