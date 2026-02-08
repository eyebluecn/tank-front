import axios, { CancelTokenSource } from 'axios';
import HttpUtil from '../../util/HttpUtil';
import { calculateChunkMd5, isMd5Available } from '../../util/Md5Util';

// Default chunk size: 50MB
const DEFAULT_CHUNK_SIZE = 50 * 1024 * 1024;
// Minimum chunk size: 5MB (aligned with AWS S3 standard)
const MIN_CHUNK_SIZE = 5 * 1024 * 1024;
// Maximum chunk size: 100MB
const MAX_CHUNK_SIZE = 100 * 1024 * 1024;
// Minimum file size to use chunked upload: 100MB
const MIN_FILE_SIZE_FOR_CHUNK = 100 * 1024 * 1024;
// Maximum concurrent chunk uploads
const MAX_CONCURRENT_UPLOADS = 6;
// Maximum retry attempts for failed chunk uploads
const MAX_RETRY_ATTEMPTS = 3;
// Base delay for retry backoff (ms)
const RETRY_BASE_DELAY = 1000;
// Session expiration time for localStorage cleanup (24 hours in ms, matching backend)
const SESSION_MAX_AGE_MS = 24 * 60 * 60 * 1000;
// Upload timeout for large chunks (10 minutes in ms)
const UPLOAD_TIMEOUT_MS = 10 * 60 * 1000;

// Upload session status
export enum UploadSessionStatus {
  UPLOADING = 'UPLOADING',
  MERGING = 'MERGING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR',
  CANCELLED = 'CANCELLED',
  PAUSED = 'PAUSED',
}

// Upload session info from server
export interface UploadSession {
  uuid: string;
  userUuid: string;
  spaceUuid: string;
  matterUuid: string;
  puuid: string;
  filename: string;
  totalSize: number;
  chunkSize: number;
  totalChunks: number;
  privacy: boolean;
  fileMd5: string;
  status: string;
  expireTime: string;
}

// Session info with uploaded chunks
export interface UploadSessionInfo {
  session: UploadSession;
  uploadedChunks: number[];
  missingChunks: number[];
}

// Chunk upload progress callback
export interface ChunkUploadProgress {
  sessionUuid: string;
  filename: string;
  totalSize: number;
  uploadedSize: number;
  progress: number; // 0-1
  speed: number; // bytes per second
  uploadedChunks: number;
  totalChunks: number;
  status: UploadSessionStatus;
}

// Local storage key for saving upload sessions
const UPLOAD_SESSION_STORAGE_KEY = 'tank_chunk_upload_sessions';

export default class ChunkUploader {
  // API endpoints
  static URL_CREATE_SESSION = '/api/chunk/create/session';
  static URL_UPLOAD_CHUNK = '/api/chunk/upload';
  static URL_MERGE_CHUNKS = '/api/chunk/merge';
  static URL_SESSION_INFO = '/api/chunk/session/info';
  static URL_CANCEL_SESSION = '/api/chunk/cancel';

  // File to upload
  file: File;
  // Parent directory UUID
  puuid: string;
  // Space UUID
  spaceUuid: string;
  // Privacy flag
  privacy: boolean;
  // Chunk size in bytes
  chunkSize: number;
  // Upload session info
  session: UploadSession | null = null;
  // Current status
  status: UploadSessionStatus = UploadSessionStatus.UPLOADING;
  // Uploaded chunk indices
  uploadedChunks: Set<number> = new Set();
  // Uploading chunk indices (currently in progress)
  uploadingChunks: Set<number> = new Set();
  // Total chunks
  totalChunks: number = 0;
  // Cancel token sources for each chunk
  cancelSources: Map<number, CancelTokenSource> = new Map();
  // Progress callback
  onProgress?: (progress: ChunkUploadProgress) => void;
  // Complete callback
  onComplete?: (matter: any) => void;
  // Error callback
  onError?: (error: string) => void;
  // React component for UI updates
  reactComponent?: React.Component;

  // Speed calculation
  private lastUpdateTime: number = 0;
  private lastUploadedSize: number = 0;
  private currentSpeed: number = 0;

  // Track progress of each chunk (chunkIndex -> bytes uploaded)
  private chunkProgress: Map<number, number> = new Map();

  // Quick file fingerprint for session matching (not full MD5)
  private fileFingerprint: string = '';

  // Whether chunk-level MD5 verification is available (spark-md5 installed)
  private chunkMd5Available: boolean = false;

  constructor(
    file: File,
    puuid: string,
    spaceUuid: string,
    privacy: boolean = true,
    chunkSize?: number,
    reactComponent?: React.Component
  ) {
    this.file = file;
    this.puuid = puuid;
    this.spaceUuid = spaceUuid;
    this.privacy = privacy;
    this.reactComponent = reactComponent;

    // Validate and set chunk size
    if (chunkSize) {
      this.chunkSize = Math.max(MIN_CHUNK_SIZE, Math.min(MAX_CHUNK_SIZE, chunkSize));
    } else {
      this.chunkSize = DEFAULT_CHUNK_SIZE;
    }

    // Calculate total chunks
    this.totalChunks = Math.ceil(file.size / this.chunkSize);
  }

  // Check if file should use chunked upload
  static shouldUseChunkedUpload(fileSize: number): boolean {
    return fileSize >= MIN_FILE_SIZE_FOR_CHUNK;
  }

  // Start the upload process
  async start(): Promise<void> {
    try {
      this.status = UploadSessionStatus.UPLOADING;
      this.lastUpdateTime = Date.now();
      this.lastUploadedSize = 0;

      // Calculate file fingerprint for better session matching
      this.fileFingerprint = await this.calculateFileFingerprint();

      // Try to resume from existing session
      const existingSession = await this.loadSessionFromStorage();
      if (existingSession) {
        // Verify session with server
        const sessionInfo = await this.getSessionInfo(existingSession.uuid);
        if (sessionInfo && sessionInfo.session.status === 'UPLOADING') {
          this.session = sessionInfo.session;
          this.uploadedChunks = new Set(sessionInfo.uploadedChunks);
          this.totalChunks = this.session.totalChunks;
          this.updateProgress();
          await this.uploadMissingChunks(sessionInfo.missingChunks);
          return;
        } else {
          // Session expired or completed, remove from storage
          this.removeSessionFromStorage();
        }
      }

      // Check if chunk-level MD5 verification is available
      this.chunkMd5Available = await isMd5Available();
      if (this.chunkMd5Available) {
        console.info('Chunk-level MD5 verification enabled');
      }

      // Create new session
      await this.createSession();

      // Save session to storage for resume capability
      this.saveSessionToStorage();

      // Upload all chunks
      const missingChunks = Array.from({ length: this.totalChunks }, (_, i) => i);
      await this.uploadMissingChunks(missingChunks);
    } catch (error: any) {
      // Don't change status if already PAUSED (pause() was called)
      if (this.status === UploadSessionStatus.PAUSED) {
        return;
      }
      if (axios.isCancel(error)) {
        this.status = UploadSessionStatus.CANCELLED;
      } else {
        this.status = UploadSessionStatus.ERROR;
        this.onError?.(error.message || 'Upload failed');
      }
      this.updateProgress();
    }
  }

  // Create upload session
  private async createSession(): Promise<void> {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('puuid', this.puuid);
      formData.append('filename', this.file.name);
      formData.append('totalSize', this.file.size.toString());
      formData.append('chunkSize', this.chunkSize.toString());
      formData.append('privacy', this.privacy.toString());
      formData.append('spaceUuid', this.spaceUuid);

      HttpUtil.httpPost(
        ChunkUploader.URL_CREATE_SESSION,
        formData,
        (response: any) => {
          this.session = response.data.data;
          this.totalChunks = this.session!.totalChunks;
          resolve();
        },
        (error: any) => {
          const msg = error.response?.data?.msg || 'Failed to create upload session';
          reject(new Error(msg));
        }
      );
    });
  }

  // Get session info from server
  private async getSessionInfo(sessionUuid: string): Promise<UploadSessionInfo | null> {
    return new Promise((resolve) => {
      HttpUtil.httpGet(
        ChunkUploader.URL_SESSION_INFO,
        { sessionUuid },
        (response: any) => {
          resolve(response.data.data);
        },
        () => {
          resolve(null);
        }
      );
    });
  }

  // Upload missing chunks with concurrency control
  private async uploadMissingChunks(missingChunks: number[]): Promise<void> {
    const queue = [...missingChunks];
    const uploading: Promise<void>[] = [];

    while (queue.length > 0 || uploading.length > 0) {
      // Check if cancelled or paused
      if (this.status === UploadSessionStatus.CANCELLED || this.status === UploadSessionStatus.PAUSED) {
        // Wait for ongoing uploads to finish
        await Promise.all(uploading);
        return;
      }

      // Start new uploads up to max concurrent
      while (queue.length > 0 && this.uploadingChunks.size < MAX_CONCURRENT_UPLOADS) {
        const chunkIndex = queue.shift()!;
        const promise = this.uploadChunk(chunkIndex).then(() => {
          const index = uploading.indexOf(promise);
          if (index > -1) {
            uploading.splice(index, 1);
          }
        });
        uploading.push(promise);
      }

      // Wait for at least one upload to complete
      if (uploading.length > 0) {
        await Promise.race(uploading);
      }
    }

    // All chunks uploaded, merge them
    if (this.status === UploadSessionStatus.UPLOADING) {
      await this.mergeChunks();
    }
  }

  // Upload a single chunk with retry support and chunk-level MD5 verification
  private async uploadChunk(chunkIndex: number, retryCount: number = 0): Promise<void> {
    if (this.uploadedChunks.has(chunkIndex)) {
      return;
    }

    this.uploadingChunks.add(chunkIndex);
    this.chunkProgress.set(chunkIndex, 0);

    const start = chunkIndex * this.chunkSize;
    const end = Math.min(start + this.chunkSize, this.file.size);
    const chunk = this.file.slice(start, end);
    const chunkActualSize = end - start;

    // Calculate chunk MD5 if available (this is fast since chunk is small)
    let chunkMd5 = '';
    if (this.chunkMd5Available) {
      try {
        chunkMd5 = await calculateChunkMd5(chunk);
      } catch (e) {
        console.warn(`Failed to calculate MD5 for chunk ${chunkIndex}:`, e);
      }
    }

    const formData = new FormData();
    formData.append('sessionUuid', this.session!.uuid);
    formData.append('chunkIndex', chunkIndex.toString());
    formData.append('file', chunk);
    formData.append('spaceUuid', this.spaceUuid);
    if (chunkMd5) {
      formData.append('chunkMd5', chunkMd5);
    }

    const cancelSource = axios.CancelToken.source();
    this.cancelSources.set(chunkIndex, cancelSource);

    return new Promise((resolve, reject) => {

      HttpUtil.httpPostFile(
        ChunkUploader.URL_UPLOAD_CHUNK,
        formData,
        () => {
          this.uploadingChunks.delete(chunkIndex);
          this.uploadedChunks.add(chunkIndex);
          this.chunkProgress.set(chunkIndex, chunkActualSize);
          this.cancelSources.delete(chunkIndex);
          this.updateProgress();
          resolve();
        },
        (error: any) => {
          this.uploadingChunks.delete(chunkIndex);
          this.cancelSources.delete(chunkIndex);
          this.chunkProgress.delete(chunkIndex);

          if (axios.isCancel(error)) {
            reject(error);
          } else if (retryCount < MAX_RETRY_ATTEMPTS) {
            // Determine if error is retryable (network errors, timeouts)
            const isRetryable =
              error.code === 'ECONNABORTED' || // timeout
              error.code === 'ERR_NETWORK' || // network error
              !error.response || // no response (network issue)
              (error.response?.status >= 500 && error.response?.status < 600); // server errors

            if (isRetryable) {
              // Retry with exponential backoff
              const delay = RETRY_BASE_DELAY * Math.pow(2, retryCount);
              console.warn(
                `Chunk ${chunkIndex} upload failed (${error.code || error.response?.status || 'unknown'}), retrying in ${delay}ms (attempt ${retryCount + 1}/${MAX_RETRY_ATTEMPTS})`
              );
              setTimeout(() => {
                this.uploadChunk(chunkIndex, retryCount + 1).then(resolve).catch(reject);
              }, delay);
            } else {
              // Non-retryable error (4xx client errors)
              const msg = error.response?.data?.msg || `Failed to upload chunk ${chunkIndex}: ${error.message}`;
              reject(new Error(msg));
            }
          } else {
            const msg = error.response?.data?.msg || `Failed to upload chunk ${chunkIndex} after ${MAX_RETRY_ATTEMPTS} attempts`;
            reject(new Error(msg));
          }
        },
        undefined,
        (progressEvent: any) => {
          // Track real-time progress for this chunk
          if (progressEvent.loaded) {
            this.chunkProgress.set(chunkIndex, progressEvent.loaded);
            this.updateProgress();
          }
        },
        { cancelToken: cancelSource.token, timeout: UPLOAD_TIMEOUT_MS }
      );
    });
  }

  // Merge all chunks
  private async mergeChunks(): Promise<void> {
    this.status = UploadSessionStatus.MERGING;
    this.updateProgress();

    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('sessionUuid', this.session!.uuid);
      formData.append('spaceUuid', this.spaceUuid);

      HttpUtil.httpPost(
        ChunkUploader.URL_MERGE_CHUNKS,
        formData,
        (response: any) => {
          this.status = UploadSessionStatus.COMPLETED;
          this.removeSessionFromStorage();
          this.updateProgress();
          this.onComplete?.(response.data.data);
          resolve();
        },
        (error: any) => {
          this.status = UploadSessionStatus.ERROR;
          const msg = error.response?.data?.msg || 'Failed to merge chunks';
          this.onError?.(msg);
          reject(new Error(msg));
        }
      );
    });
  }

  // Update progress with precise chunk-level tracking
  private updateProgress(): void {
    // Calculate precise uploaded size including in-progress chunks
    let uploadedSize = 0;

    // Add completed chunks (use actual size for last chunk)
    Array.from(this.uploadedChunks).forEach((chunkIndex) => {
      const start = chunkIndex * this.chunkSize;
      const end = Math.min(start + this.chunkSize, this.file.size);
      uploadedSize += end - start;
    });

    // Add in-progress chunk bytes
    this.chunkProgress.forEach((bytes, chunkIndex) => {
      if (!this.uploadedChunks.has(chunkIndex)) {
        uploadedSize += bytes;
      }
    });

    const actualUploadedSize = Math.min(uploadedSize, this.file.size);

    // Calculate speed
    const now = Date.now();
    const timeDelta = now - this.lastUpdateTime;
    if (timeDelta > 500) {
      const sizeDelta = actualUploadedSize - this.lastUploadedSize;
      this.currentSpeed = Math.round(sizeDelta / (timeDelta / 1000));
      this.lastUpdateTime = now;
      this.lastUploadedSize = actualUploadedSize;
    }

    const progress: ChunkUploadProgress = {
      sessionUuid: this.session?.uuid || '',
      filename: this.file.name,
      totalSize: this.file.size,
      uploadedSize: actualUploadedSize,
      progress: actualUploadedSize / this.file.size,
      speed: this.currentSpeed,
      uploadedChunks: this.uploadedChunks.size,
      totalChunks: this.totalChunks,
      status: this.status,
    };

    this.onProgress?.(progress);

    // Update React component if provided
    if (this.reactComponent) {
      this.reactComponent.setState({});
    }
  }

  // Pause upload
  pause(): void {
    this.status = UploadSessionStatus.PAUSED;
    // Cancel ongoing chunk uploads
    this.cancelSources.forEach((source) => {
      source.cancel('Paused');
    });
    this.uploadingChunks.clear();
    this.cancelSources.clear();
    // Don't clear chunkProgress or call updateProgress() here
    // to avoid progress bar jumping back. The progress will be
    // recalculated when upload resumes.
  }

  // Resume upload
  async resume(): Promise<void> {
    if (this.status !== UploadSessionStatus.PAUSED) {
      return;
    }

    this.status = UploadSessionStatus.UPLOADING;
    // Clear stale progress data from cancelled chunks
    this.chunkProgress.clear();

    // Get missing chunks
    const missingChunks: number[] = [];
    for (let i = 0; i < this.totalChunks; i++) {
      if (!this.uploadedChunks.has(i)) {
        missingChunks.push(i);
      }
    }

    try {
      await this.uploadMissingChunks(missingChunks);
    } catch (error: any) {
      // Don't change status if paused during resume (status may change during async operation)
      const currentStatus = this.status as UploadSessionStatus;
      if (currentStatus === UploadSessionStatus.PAUSED) {
        return;
      }
      if (!axios.isCancel(error)) {
        this.status = UploadSessionStatus.ERROR;
        this.onError?.(error.message || 'Upload failed');
      }
      this.updateProgress();
    }
  }

  // Cancel upload
  cancel(): void {
    this.status = UploadSessionStatus.CANCELLED;
    this.cancelSources.forEach((source) => {
      source.cancel('Cancelled');
    });

    // Cancel session on server
    if (this.session) {
      const formData = new FormData();
      formData.append('sessionUuid', this.session.uuid);
      formData.append('spaceUuid', this.spaceUuid);
      HttpUtil.httpPost(ChunkUploader.URL_CANCEL_SESSION, formData);
    }

    this.removeSessionFromStorage();
    this.updateProgress();
  }

  // Save session to local storage for resume capability
  private saveSessionToStorage(): void {
    if (!this.session) return;

    const storageKey = this.getStorageKey();
    const sessions = this.getAllSessionsFromStorage();

    sessions[storageKey] = {
      sessionUuid: this.session.uuid,
      filename: this.file.name,
      fileSize: this.file.size,
      puuid: this.puuid,
      spaceUuid: this.spaceUuid,
      privacy: this.privacy,
      lastModified: this.file.lastModified,
      fingerprint: this.fileFingerprint, // Store fingerprint for better matching
      savedAt: Date.now(),
    };

    try {
      localStorage.setItem(UPLOAD_SESSION_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to save upload session to localStorage', e);
    }
  }

  // Load session from local storage with improved file matching
  private async loadSessionFromStorage(): Promise<{ uuid: string } | null> {
    const storageKey = this.getStorageKey();
    const sessions = this.getAllSessionsFromStorage();
    const saved = sessions[storageKey];

    if (!saved) {
      return null;
    }

    // Basic checks: size and lastModified must match
    if (saved.fileSize !== this.file.size || saved.lastModified !== this.file.lastModified) {
      return null;
    }

    // Enhanced check: if fingerprint exists in saved session, verify it matches
    if (saved.fingerprint && this.fileFingerprint && saved.fingerprint !== this.fileFingerprint) {
      console.warn('File fingerprint mismatch, file content may have changed');
      // Remove stale session
      delete sessions[storageKey];
      localStorage.setItem(UPLOAD_SESSION_STORAGE_KEY, JSON.stringify(sessions));
      return null;
    }

    return { uuid: saved.sessionUuid };
  }

  // Remove session from local storage
  private removeSessionFromStorage(): void {
    const storageKey = this.getStorageKey();
    const sessions = this.getAllSessionsFromStorage();
    delete sessions[storageKey];

    try {
      localStorage.setItem(UPLOAD_SESSION_STORAGE_KEY, JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to remove upload session from localStorage', e);
    }
  }

  // Get all sessions from storage with automatic cleanup of expired sessions
  private getAllSessionsFromStorage(): Record<string, any> {
    try {
      const data = localStorage.getItem(UPLOAD_SESSION_STORAGE_KEY);
      if (!data) return {};

      const sessions = JSON.parse(data);
      const now = Date.now();
      let hasExpired = false;

      // Clean up expired sessions
      for (const key of Object.keys(sessions)) {
        const session = sessions[key];
        if (session.savedAt && now - session.savedAt > SESSION_MAX_AGE_MS) {
          delete sessions[key];
          hasExpired = true;
          console.info(`Cleaned up expired upload session: ${key}`);
        }
      }

      // Save back if any sessions were removed
      if (hasExpired) {
        localStorage.setItem(UPLOAD_SESSION_STORAGE_KEY, JSON.stringify(sessions));
      }

      return sessions;
    } catch (e) {
      return {};
    }
  }

  // Generate storage key based on file properties
  private getStorageKey(): string {
    return `${this.spaceUuid}_${this.puuid}_${this.file.name}_${this.file.size}_${this.file.lastModified}`;
  }

  // Get current progress value (0-1)
  getProgress(): number {
    return this.uploadedChunks.size / this.totalChunks;
  }

  // Get current speed in bytes per second
  getSpeed(): number {
    return this.currentSpeed;
  }

  // Get uploaded size with precise calculation
  getUploadedSize(): number {
    let uploadedSize = 0;

    // Add completed chunks
    Array.from(this.uploadedChunks).forEach((chunkIndex) => {
      const start = chunkIndex * this.chunkSize;
      const end = Math.min(start + this.chunkSize, this.file.size);
      uploadedSize += end - start;
    });

    // Add in-progress chunk bytes
    this.chunkProgress.forEach((bytes, chunkIndex) => {
      if (!this.uploadedChunks.has(chunkIndex)) {
        uploadedSize += bytes;
      }
    });

    return Math.min(uploadedSize, this.file.size);
  }

  // Check if upload is complete
  isComplete(): boolean {
    return this.status === UploadSessionStatus.COMPLETED;
  }

  // Check if upload is in progress
  isUploading(): boolean {
    return this.status === UploadSessionStatus.UPLOADING || this.status === UploadSessionStatus.MERGING;
  }

  // Check if upload is paused
  isPaused(): boolean {
    return this.status === UploadSessionStatus.PAUSED;
  }

  // Check if upload failed
  isFailed(): boolean {
    return this.status === UploadSessionStatus.ERROR;
  }

  // Check if upload is cancelled
  isCancelled(): boolean {
    return this.status === UploadSessionStatus.CANCELLED;
  }

  // Calculate a quick fingerprint from file's first and last bytes
  // This provides better uniqueness than just size+lastModified without reading the whole file
  private async calculateFileFingerprint(): Promise<string> {
    const SAMPLE_SIZE = 64 * 1024; // 64KB sample from start and end

    try {
      // Read first 64KB
      const firstChunk = this.file.slice(0, Math.min(SAMPLE_SIZE, this.file.size));
      const firstBuffer = await firstChunk.arrayBuffer();
      const firstView = new Uint8Array(firstBuffer);

      // Read last 64KB (if file is large enough)
      let lastView = new Uint8Array(0);
      if (this.file.size > SAMPLE_SIZE * 2) {
        const lastChunk = this.file.slice(this.file.size - SAMPLE_SIZE);
        const lastBuffer = await lastChunk.arrayBuffer();
        lastView = new Uint8Array(lastBuffer);
      }

      // Simple hash: combine samples into a fingerprint string
      // Using a simple checksum approach for speed
      let hash = 0;
      for (let i = 0; i < firstView.length; i++) {
        hash = ((hash << 5) - hash + firstView[i]) | 0;
      }
      for (let i = 0; i < lastView.length; i++) {
        hash = ((hash << 5) - hash + lastView[i]) | 0;
      }

      // Convert to hex string
      return (hash >>> 0).toString(16).padStart(8, '0');
    } catch (e) {
      console.warn('Failed to calculate file fingerprint:', e);
      return '';
    }
  }
}
