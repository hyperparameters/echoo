export interface FilecoinUploadResponse {
  name: string;
  size: number;
  cid: string;
  filecoin_url: string;
  user_id: string;
}


export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class UploadService {
  private static apiUrl = process.env.NEXT_PUBLIC_FILECOIN_UPLOAD_API_URL || process.env.FILECOIN_UPLOAD_API_URL;

  private static async getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        resolve({ width: img.naturalWidth, height: img.naturalHeight });
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load image for dimension extraction'));
      };

      img.src = url;
    });
  }

  static async uploadFile(
    file: File,
    userId: string,
    onProgress?: (progress: UploadProgress) => void,
    imageType: string = 'image'
  ): Promise<FilecoinUploadResponse> {
    if (!this.apiUrl) {
      throw new Error('FILECOIN_UPLOAD_API_URL is not configured');
    }

    // Extract image dimensions before upload
    let imageDimensions: { width: number; height: number } | null = null;
    try {
      if (file.type.startsWith('image/')) {
        imageDimensions = await this.getImageDimensions(file);
      }
    } catch (error) {
      console.warn('Failed to extract image dimensions:', error);
    }

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      // Set up progress tracking
      if (onProgress) {
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progress: UploadProgress = {
              loaded: event.loaded,
              total: event.total,
              percentage: Math.round((event.loaded / event.total) * 100)
            };
            onProgress(progress);
          }
        };
      }

      // Set up response handlers
      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response: FilecoinUploadResponse = JSON.parse(xhr.responseText);
            resolve(response);
          } catch (error) {
            reject(new Error('Failed to parse response'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error during upload'));
      };

      // Prepare the request
      xhr.open('POST', this.apiUrl!);
      xhr.setRequestHeader('x-file-name', encodeURIComponent(file.name));
      xhr.setRequestHeader('user-id', userId);
      xhr.setRequestHeader('x-file-size', file.size.toString());
      xhr.setRequestHeader('x-upload-method', 'stream');
      xhr.setRequestHeader('x-image-type', imageType);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

      // Add image dimension headers if available
      if (imageDimensions) {
        xhr.setRequestHeader('x-image-width', imageDimensions.width.toString());
        xhr.setRequestHeader('x-image-height', imageDimensions.height.toString());
      }

      // Send the file
      xhr.send(file);
    });
  }

  static async uploadMultipleFiles(
    files: File[],
    userId: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void,
    onFileComplete?: (fileIndex: number, response: FilecoinUploadResponse) => void,
    imageType: string = 'image'
  ): Promise<FilecoinUploadResponse[]> {
    const results: FilecoinUploadResponse[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadFile(
          files[i],
          userId,
          onProgress ? (progress) => onProgress(i, progress) : undefined,
          imageType
        );
        results.push(result);

        if (onFileComplete) {
          onFileComplete(i, result);
        }

        // Note: localStorage storage is handled by the calling component
        // to allow for better upload progress tracking and error handling

      } catch (error) {
        console.error(`Failed to upload file ${files[i].name}:`, error);
        throw error;
      }
    }

    return results;
  }








}