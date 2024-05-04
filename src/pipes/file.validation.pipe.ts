import {
  Injectable,
  PipeTransform,
  ArgumentMetadata,
  BadRequestException,
} from "@nestjs/common";
import { CustomUploadedFile } from "src/interfaces/CustomUploadedFile";

@Injectable()
export class FileValidationPipe implements PipeTransform {
  public async transform(
    file: CustomUploadedFile,
    metadata: ArgumentMetadata
  ): Promise<CustomUploadedFile> {
    const { type } = metadata;

    if (type === "body" && (file === undefined || file === null)) {
      throw new BadRequestException("Файл не завантажено");
    }

    if (file) {
      const fileSizeLimit = 5 * 1024 * 1024;
      const allowedMimeTypes = ["image/jpeg", "image/png"];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new BadRequestException("Непідтримуваний тип файлу");
      }

      if (file.size > fileSizeLimit) {
        throw new BadRequestException("Розмір файлу перевищує ліміт");
      }
    }

    return file;
  }
}
