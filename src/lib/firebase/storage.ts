import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from './services';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png'];

export async function uploadUserFile(
  userId: string,
  file: File,
  type: 'profile_image' | 'cover_image' | 'id_card_image' | 'payment_slip',
  onProgress?: (progress: number) => void
): Promise<string> {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File size must not exceed 10MB. Please choose a smaller file.');
  }

  // Validate file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error('Only JPG and PNG images are allowed. Please select a valid image file.');
  }

  try {
    // Create storage reference with timestamp to avoid name conflicts
    const timestamp = Date.now();
    const filename = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `${type}/${userId}/${filename}`);
    
    // Start upload
    const uploadTask = uploadBytesResumable(storageRef, file);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          onProgress?.(progress);
        },
        (error) => {
          console.error('Upload error:', error);
          let errorMessage = 'Failed to upload file. Please try again.';
          
          if (error.code === 'storage/unauthorized') {
            errorMessage = 'You do not have permission to upload this file.';
          } else if (error.code === 'storage/canceled') {
            errorMessage = 'Upload was canceled. Please try again.';
          } else if (error.code === 'storage/retry-limit-exceeded') {
            errorMessage = 'Poor network connection. Please check your internet and try again.';
          }
          
          reject(new Error(errorMessage));
        },
        async () => {
          try {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          } catch (error) {
            console.error('Error getting download URL:', error);
            reject(new Error('Failed to get download URL. Please try again.'));
          }
        }
      );
    });
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Failed to upload file. Please try again.');
  }
}