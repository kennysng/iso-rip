import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { lstat, readdir } from 'fs/promises';
import { basename, extname, resolve } from 'path';
import { ConfigService } from './config.service';
import { Album } from './models/album.model';
import { CD } from './models/cd.model';
import { TaskStatus } from './models/task.model';
import { Track } from './models/track.model';
import { AlbumService } from './modules/model/album.service';
import { LogService } from './modules/model/log.service';
import { TaskService } from './modules/model/task.service';

@Injectable()
export class AppService {
  // scanning for albums
  private isScanning = false;

  // converting mdx to iso
  private isConverting = false;

  // ripping audio tracks
  private isRipping = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly albumService: AlbumService,
    private readonly logger: LogService,
    private readonly taskService: TaskService,
  ) {}

  @Cron('0 0 * * *')
  async scheduleScan() {
    if (!this.isScanning) {
      try {
        this.isScanning = true;

        // read albums
        const albumsPath =
          this.configService.album?.path || resolve('..', 'album');
        let albums: string[];
        try {
          albums = await readdir(albumsPath);
        } catch (e) {
          this.logger.log('AppService', 'Album folder not found');
          return;
        }

        const result: Album[] = [];
        for (const albumName of albums) {
          try {
            let album = await this.albumService.findOne({
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
              if (['.iso', '.mdx'].indexOf(ext) === -1) continue;
              const stat = await lstat(cdPath);
              if (!stat.isFile()) continue;

              album.cds.push({
                name: basename(cdName, extname(cdName)),
                cdNum: i + 1,
                needConvert: ext === '.mdx',
              } as CD);
            }

            result.push(album);
          } catch (e) {
            this.logger.error('AppService', e.message, e.stack);
          }
        }

        await this.albumService.update(result);
      } finally {
        this.isScanning = false;
      }
    }
  }

  @Cron('0 0 * * *')
  async scheduleConvert() {
    if (!this.isConverting) {
      try {
        this.isConverting = true;

        while (true) {
          // TODO get needConvert CD
        }
      } finally {
        this.isConverting = false;
      }
    }
  }

  @Cron('0 0 * * *')
  async scheduleRip() {
    if (!this.isRipping) {
      try {
        this.isRipping = true;

        while (true) {
          const pending = await this.taskService.findOne({
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
