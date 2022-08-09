import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { lstat, readdir } from 'fs/promises';
import { basename, extname, resolve } from 'path';
import { ConfigService } from './config.service';
import { Logger } from './logger';
import { Album } from './models/album.model';
import { CD } from './models/cd.model';
import { TaskStatus } from './models/task.model';
import { Track } from './models/track.model';
import { AlbumDaoService } from './modules/dao/album.service';
import { TaskDaoService } from './modules/dao/task.service';

@Injectable()
export class AppService {
  // scanning for albums
  private isScanning = false;

  // ripping audio tracks
  private isRipping = false;

  private readonly logger = new Logger('AppService');

  constructor(
    private readonly config: ConfigService,
    private readonly albumDaoService: AlbumDaoService,
    private readonly taskDaoService: TaskDaoService,
  ) {}

  @Cron('0 0 * * *')
  async scheduleScan() {
    if (!this.isScanning) {
      try {
        this.isScanning = true;

        // read albums
        const albumsPath = this.config.album?.path || resolve('..', 'album');
        let albums: string[];
        try {
          albums = await readdir(albumsPath);
        } catch (e) {
          this.logger.log('Album folder not found', 'scheduleScan');
          return;
        }

        const result: Album[] = [];
        for (const albumName of albums) {
          try {
            let album = await this.albumDaoService.findOne({
              where: { name: albumName },
            });
            if (album && !album.rescan) continue;
            if (!album) album = { name: albumName, cds: [] } as Album;

            // check if is folder
            const albumPath = await resolve(albumsPath, albumName);
            const stat = await lstat(albumPath);
            if (!stat.isDirectory()) continue;

            // read cds
            const cds = await readdir(albumPath);
            for (let i = 0, length = cds.length; i < length; i += 1) {
              const cdName = cds[i];

              // check if is file
              const cdPath = await resolve(albumPath, cdName);
              const ext = extname(cdPath);
              if (['.mdx'].indexOf(ext) === -1) continue;
              const stat = await lstat(cdPath);
              if (!stat.isFile()) continue;

              album.cds.push({
                name: basename(cdName, extname(cdName)),
                cdNum: i + 1,
              } as CD);
            }

            result.push(album);
          } catch (e) {
            this.logger.error(e.message, {
              tag: 'scheduleScan',
              extra: e.stack,
            });
          }
        }

        await this.albumDaoService.update(result);
      } finally {
        this.isScanning = false;
      }
    }
  }

  @Cron('0 0 * * *')
  async scheduleRip() {
    if (!this.isRipping) {
      try {
        this.isRipping = true;

        while (true) {
          const pending = await this.taskDaoService.findOne({
            where: { status: TaskStatus.pending },
            include: [Album, CD, Track],
          });
          if (!pending) break;

          // TODO rip
        }
      } finally {
        this.isRipping = false;
      }
    }
  }
}
