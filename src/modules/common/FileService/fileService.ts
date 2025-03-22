import { Injectable } from '@nestjs/common';
import * as fs from 'node:fs/promises';

import * as path from 'path';

export interface IFileService {
  createPathToUploadsFolder(fileName: string): string;
  readFile(filePath: string): Promise<Buffer>;
  writeFile(filePath: string, content: string): Promise<void>;
  deleteFile(filePath: string): Promise<void>;
}

export const FileServiceSymbol = Symbol('File_Service');

@Injectable()
export class FileService implements IFileService {
  public createPathToUploadsFolder(fileName: string): string {
    return path.resolve('src/utils/uploads/' + fileName);
  }

  async readFile(filePath: string): Promise<Buffer> {
    try {
      const absolutePath = path.resolve(filePath);
      const data = await fs.readFile(absolutePath);
      return data;
    } catch (error) {
      throw new Error(`Error reading file at ${filePath}: ${error.message}`);
    }
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      const absolutePath = path.resolve(filePath);
      await fs.writeFile(absolutePath, content, 'utf8');
    } catch (error) {
      throw new Error(`Error writing file at ${filePath}: ${error.message}`);
    }
  }

  async deleteFile(filePath: string): Promise<void> {
    try {
      const absolutePath = path.resolve(filePath);
      await fs.unlink(absolutePath);
    } catch (error) {
      throw new Error(`Error deleting file at ${filePath}: ${error.message}`);
    }
  }
}
