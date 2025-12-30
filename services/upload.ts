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
    // Check URL first and log clearly
    console.log('🔍 Checking Filecoin upload configuration...', {
      apiUrl: this.apiUrl || 'NOT SET',
      envCheck: {
        NEXT_PUBLIC_FILECOIN_UPLOAD_API_URL: process.env.NEXT_PUBLIC_FILECOIN_UPLOAD_API_URL || 'NOT SET',
        FILECOIN_UPLOAD_API_URL: process.env.FILECOIN_UPLOAD_API_URL || 'NOT SET'
      }
    });

    if (!this.apiUrl) {
      const errorMsg = 'FILECOIN_UPLOAD_API_URL is not configured. Please set NEXT_PUBLIC_FILECOIN_UPLOAD_API_URL in your .env.local file and restart the dev server.';
      console.error('❌', errorMsg);
      throw new Error(errorMsg);
    }

    // Log the URL being used (without exposing full credentials)
    console.log('📤 Uploading to Filecoin:', {
      url: this.apiUrl,
      fileName: file.name,
      fileSize: file.size,
      userId,
      imageType
    });

    // Extract image dimensions before upload (non-blocking)
    let imageDimensions: { width: number; height: number } | null = null;
    try {
      if (file.type.startsWith('image/')) {
        imageDimensions = await this.getImageDimensions(file);
      }
    } catch (error) {
      // Dimension extraction is optional - continue without it
      console.warn('⚠️ Failed to extract image dimensions (continuing anyway):', error);
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
        console.log('📥 Upload response:', {
          status: xhr.status,
          statusText: xhr.statusText,
          responseLength: xhr.responseText?.length
        });
        
        if (xhr.status === 200) {
          try {
            const response: FilecoinUploadResponse = JSON.parse(xhr.responseText);
            console.log('✅ Upload successful:', response);
            resolve(response);
          } catch (error) {
            console.error('❌ Failed to parse response:', xhr.responseText);
            reject(new Error(`Failed to parse response: ${xhr.responseText.substring(0, 100)}`));
          }
        } else {
          console.error('❌ Upload failed:', {
            status: xhr.status,
            statusText: xhr.statusText,
            response: xhr.responseText?.substring(0, 200)
          });
          reject(new Error(`Upload failed with status ${xhr.status}: ${xhr.statusText || xhr.responseText?.substring(0, 100)}`));
        }
      };

      xhr.onerror = (event) => {
        const errorDetails = {
          status: xhr.status,
          statusText: xhr.statusText,
          readyState: xhr.readyState,
          url: this.apiUrl,
          urlSet: !!this.apiUrl,
          eventType: event.type,
          timestamp: new Date().toISOString()
        };
        console.error('❌ XMLHttpRequest network error:', errorDetails);
        
        // Provide more helpful error message
        let errorMessage = 'Network error during upload';
        if (!this.apiUrl) {
          errorMessage = 'FILECOIN_UPLOAD_API_URL is not configured. Please set NEXT_PUBLIC_FILECOIN_UPLOAD_API_URL in your .env.local file';
        } else if (xhr.readyState === 0) {
          errorMessage = `Failed to connect to ${this.apiUrl}. The Filecoin worker may be down or the URL is incorrect.`;
        } else {
          errorMessage = `Network error connecting to ${this.apiUrl}. Check: 1) Is the worker deployed? 2) Is the URL correct? 3) Are there CORS issues?`;
        }
        
        reject(new Error(errorMessage));
      };

      xhr.ontimeout = () => {
        console.error('❌ Upload timeout:', {
          url: this.apiUrl,
          timeout: xhr.timeout
        });
        reject(new Error(`Upload timeout after ${xhr.timeout}ms. The Filecoin worker may be slow or unresponsive.`));
      };

      // Prepare the request
      xhr.open('POST', this.apiUrl!);
      xhr.timeout = 60000; // 60 second timeout
      xhr.setRequestHeader('x-file-name', encodeURIComponent(file.name));
      xhr.setRequestHeader('user-id', userId);
      xhr.setRequestHeader('x-file-size', file.size.toString());
      xhr.setRequestHeader('x-upload-method', 'stream');
      xhr.setRequestHeader('x-image-type', imageType);
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
      
      console.log('🚀 Starting upload request:', {
        method: 'POST',
        url: this.apiUrl,
        fileName: file.name,
        fileSize: file.size,
        headers: {
          'x-file-name': file.name,
          'user-id': userId,
          'x-file-size': file.size.toString(),
          'x-upload-method': 'stream',
          'x-image-type': imageType,
          'Content-Type': file.type || 'application/octet-stream'
        }
      });

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