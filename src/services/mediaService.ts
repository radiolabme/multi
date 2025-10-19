/**
 * Mock media upload service
 * Replace with actual media API implementation
 */

export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
}

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
}

/**
 * Simulates async image upload with progress tracking
 * TODO: Replace with actual media API endpoint
 */
export const uploadImage = async (
  file: File,
  onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size (max 5MB for demo)
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    throw new Error('Image must be less than 5MB');
  }

  // Simulate upload with progress
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress({
          loaded: event.loaded,
          total: event.total,
          percentage: Math.round((event.loaded / event.total) * 100),
        });
      }
    };

    reader.onload = () => {
      // Simulate network delay
      setTimeout(() => {
        const result = reader.result as string;
        resolve({
          url: result, // In production, this would be the uploaded URL
          filename: file.name,
          size: file.size,
        });
      }, 1000);
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsDataURL(file);
  });
};

/**
 * Validates YouTube URL and extracts video ID
 */
export const extractYoutubeId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
};
