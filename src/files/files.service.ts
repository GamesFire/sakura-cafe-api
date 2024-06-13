import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import { CustomUploadedFile } from "src/interfaces/CustomUploadedFile";
import * as path from "path";
import * as fs from "fs";
import * as uuid from "uuid";
import * as mime from "mime-types";

@Injectable()
export class FilesService {
  public async createFile(file: CustomUploadedFile): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      if (!file) {
        throw new BadRequestException("Файл не надано");
      }

      const fileExtension = mime.extension(file.mimetype);

      if (!fileExtension) {
        reject(new BadRequestException("Непідтримуваний тип файлу"));
        return;
      }

      const fileName = uuid.v4() + "." + fileExtension;
      const filePath = path.resolve(__dirname, "..", "static");

      if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath, { recursive: true });
      }

      const writeStream = fs.createWriteStream(path.join(filePath, fileName));

      writeStream.write(file.buffer);

      writeStream.on("finish", () => {
        resolve(fileName);
      });

      writeStream.on("error", () => {
        reject(
          new InternalServerErrorException(
            "Виникла помилка під час запису файлу"
          )
        );
      });

      writeStream.end();
    });
  }

  public async deleteFile(fileName: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const filePath = path.resolve(__dirname, "..", "static", fileName);

      if (fs.existsSync(filePath)) {
        fs.unlink(filePath, (err) => {
          if (err) {
            reject(
              new InternalServerErrorException(
                "Виникла помилка під час видалення файлу"
              )
            );
          } else {
            resolve();
          }
        });
      }
    });
  }
}
