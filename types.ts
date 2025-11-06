export enum AppState {
  IDLE = 'IDLE',
  FILES_LOADED = 'FILES_LOADED',
  PROCESSING = 'PROCESSING',
  DONE = 'DONE',
}

export enum FileStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface ProcessableFile {
  id: string;
  file: File;
  status: FileStatus;
  markdown?: string;
  error?: string;
}
