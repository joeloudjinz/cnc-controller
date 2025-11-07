import { Conversion } from '../models/Conversion';
import { User } from '../models/User';

export interface IImageConversionService {
  convertImageToGcode(userId: number, originalFileName: string, conversionParams?: Record<string, any>): Promise<Conversion>;
  processImageFile(originalFileName: string, userId: number): Promise<void>;
  saveConversionResult(userId: number, originalFileName: string, convertedFileName: string): Promise<Conversion>;
  queueConversionJob(conversion: Conversion): Promise<void>;
}

export interface IHardwareCommunicationService {
  sendGcodeToCNC(gcodeFilePath: string): Promise<boolean>;
  pauseCNC(): Promise<boolean>;
  stopCNC(): Promise<boolean>;
  resumeCNC(): Promise<boolean>;
  isCNCReady(): Promise<boolean>;
  getCNCStatus(): Promise<string>;
}