export interface FilecoinUploadResponse {
  success: boolean;
  pieceCid: {
    "/": string;
  };
  fileName: string;
  fileSize: number;
  cdnUrl: string;
  userId: string;
  timestamp: string;
}

export interface GalleryItem {
  id: string;
  image_url: string;
  name: string;
  size: number;
  description: string;
  created_at: string;
  likes: number;
  comments: number;
  location: string;
}

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export class UploadService {
  private static apiUrl = process.env.NEXT_PUBLIC_FILECOIN_UPLOAD_API_URL || process.env.FILECOIN_UPLOAD_API_URL;

  static async uploadFile(
    file: File,
    userId: string,
    onProgress?: (progress: UploadProgress) => void
  ): Promise<FilecoinUploadResponse> {
    if (!this.apiUrl) {
      throw new Error('FILECOIN_UPLOAD_API_URL is not configured');
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
      xhr.open('POST', this.apiUrl);
      xhr.setRequestHeader('x-file-name', file.name);
      xhr.setRequestHeader('user-id', userId);
      xhr.setRequestHeader('x-file-size', file.size.toString());
      xhr.setRequestHeader('x-upload-method', 'stream');
      xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');

      // Send the file
      xhr.send(file);
    });
  }

  static async uploadMultipleFiles(
    files: File[],
    userId: string,
    onProgress?: (fileIndex: number, progress: UploadProgress) => void,
    onFileComplete?: (fileIndex: number, response: FilecoinUploadResponse) => void
  ): Promise<FilecoinUploadResponse[]> {
    const results: FilecoinUploadResponse[] = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.uploadFile(
          files[i],
          userId,
          onProgress ? (progress) => onProgress(i, progress) : undefined
        );
        results.push(result);

        if (onFileComplete) {
          onFileComplete(i, result);
        }

        // Store in localStorage
        this.storeUploadResponse(result);

      } catch (error) {
        console.error(`Failed to upload file ${files[i].name}:`, error);
        throw error;
      }
    }

    return results;
  }

  static transformToGalleryItem(response: FilecoinUploadResponse): GalleryItem {
    // Generate a meaningful description based on file name
    const fileName = response.fileName.replace(/^piece-/, '').replace(/\.[^/.]+$/, '');
    const fileExtension = response.fileName.split('.').pop()?.toUpperCase() || 'IMAGE';

    // Generate some sample metadata (you can customize this logic)
    const descriptions = [
      'Beautiful moment captured ✨',
      'Amazing shot! 📸',
      'Love this composition 🎨',
      'Perfect lighting ☀️',
      'Stunning colors 🌈',
      'Great perspective 👁️',
      'Incredible detail 🔍',
      'Artistic vision 🎭'
    ];

    const locations = [
      'San Francisco, CA',
      'New York, NY',
      'Los Angeles, CA',
      'Miami, FL',
      'Austin, TX',
      'Seattle, WA',
      'Chicago, IL',
      'Boston, MA'
    ];

    const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];

    return {
      id: response.pieceCid['/'],
      image_url: response.cdnUrl,
      name: response.fileName,
      size: response.fileSize,
      description: randomDescription,
      created_at: response.timestamp,
      likes: Math.floor(Math.random() * 2000) + 100, // Random likes between 100-2100
      comments: Math.floor(Math.random() * 50) + 5, // Random comments between 5-55
      location: randomLocation
    };
  }

  static storeUploadResponse(response: FilecoinUploadResponse): void {
    try {
      // Store the raw upload response
      const existingUploads = this.getStoredUploads();
      const updatedUploads = [response, ...existingUploads];
      const trimmedUploads = updatedUploads.slice(0, 50);
      localStorage.setItem('echoo_uploads', JSON.stringify(trimmedUploads));

      // Transform and store as gallery item
      const galleryItem = this.transformToGalleryItem(response);
      this.storeGalleryItem(galleryItem);
    } catch (error) {
      console.error('Failed to store upload response:', error);
    }
  }

  static storeGalleryItem(galleryItem: GalleryItem): void {
    try {
      const existingGallery = this.getGalleryItems();
      const updatedGallery = [galleryItem, ...existingGallery];

      // Keep only the last 100 gallery items
      const trimmedGallery = updatedGallery.slice(0, 100);

      localStorage.setItem('echoo_gallery', JSON.stringify(trimmedGallery));
    } catch (error) {
      console.error('Failed to store gallery item:', error);
    }
  }

  static getStoredUploads(): FilecoinUploadResponse[] {
    try {
      const storedUploads = localStorage.getItem('echoo_uploads');
      return storedUploads ? JSON.parse(storedUploads) : [];
    } catch (error) {
      console.error('Failed to retrieve stored uploads:', error);
      return [];
    }
  }

  static getGalleryItems(): GalleryItem[] {
    try {
      const storedGallery = localStorage.getItem('echoo_gallery');
      return storedGallery ? JSON.parse(storedGallery) : [];
    } catch (error) {
      console.error('Failed to retrieve gallery items:', error);
      return [];
    }
  }

  static clearStoredUploads(): void {
    try {
      localStorage.removeItem('echoo_uploads');
    } catch (error) {
      console.error('Failed to clear stored uploads:', error);
    }
  }

  static clearGalleryItems(): void {
    try {
      localStorage.removeItem('echoo_gallery');
    } catch (error) {
      console.error('Failed to clear gallery items:', error);
    }
  }

  static getAllUserContent(): GalleryItem[] {
    // This method returns all content combining mock data with uploaded items
    const uploadedItems = this.getGalleryItems();
    return uploadedItems;
  }
}