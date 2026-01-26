/**
 * useImagePicker Hook
 * State management for the image picker modal
 */

import { useState, useCallback, useEffect } from 'react';
import { api, uploadFile } from '@/lib/api';
import {
  BackgroundImage,
  BackgroundSettings,
  ImagePosition,
  UnsplashPhoto,
  unsplashPhotoToBackgroundImage,
  defaultBackgroundSettings,
  validateImageFile,
  generateImageId,
} from '@/lib/imageSettings';

export type PickerTab = 'search' | 'upload' | 'gallery';

interface UseImagePickerOptions {
  onSelect?: (settings: BackgroundSettings) => void;
  initialSettings?: BackgroundSettings | null;
}

interface UseImagePickerReturn {
  // Modal state
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;

  // Tab state
  activeTab: PickerTab;
  setActiveTab: (tab: PickerTab) => void;

  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: BackgroundImage[];
  isSearching: boolean;
  searchError: string | null;
  searchPage: number;
  totalPages: number;
  loadMoreSearch: () => void;

  // Upload state
  uploadProgress: number;
  isUploading: boolean;
  uploadError: string | null;
  uploadImage: (file: File) => Promise<void>;
  userUploads: BackgroundImage[];
  loadUserUploads: () => Promise<void>;
  deleteUpload: (imageId: string) => Promise<void>;

  // Gallery state
  curatedImages: BackgroundImage[];
  selectedCategory: string | null;
  setSelectedCategory: (category: string | null) => void;
  isLoadingCurated: boolean;

  // Selection state
  selectedImage: BackgroundImage | null;
  selectImage: (image: BackgroundImage | null) => void;

  // Position state
  position: ImagePosition;
  setPosition: (pos: ImagePosition) => void;

  // Effects state
  overlayOpacity: number;
  setOverlayOpacity: (opacity: number) => void;
  overlayColor: 'theme' | 'dark' | 'light';
  setOverlayColor: (color: 'theme' | 'dark' | 'light') => void;
  blur: number;
  setBlur: (blur: number) => void;
  brightness: number;
  setBrightness: (brightness: number) => void;

  // Preview settings
  previewSettings: BackgroundSettings;

  // Actions
  applySettings: () => void;
  removeBackground: () => void;
  resetToDefaults: () => void;
}

export function useImagePicker(options: UseImagePickerOptions = {}): UseImagePickerReturn {
  const { onSelect, initialSettings } = options;

  // Modal state
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<PickerTab>('search');

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BackgroundImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [searchPage, setSearchPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Upload state
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [userUploads, setUserUploads] = useState<BackgroundImage[]>([]);

  // Gallery state
  const [curatedImages, setCuratedImages] = useState<BackgroundImage[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoadingCurated, setIsLoadingCurated] = useState(false);

  // Selection state
  const [selectedImage, setSelectedImage] = useState<BackgroundImage | null>(
    initialSettings?.image || null
  );

  // Effects state
  const [position, setPosition] = useState<ImagePosition>(
    initialSettings?.position || { x: 50, y: 50 }
  );
  const [overlayOpacity, setOverlayOpacity] = useState(
    initialSettings?.overlayOpacity ?? 40
  );
  const [overlayColor, setOverlayColor] = useState<'theme' | 'dark' | 'light'>(
    (initialSettings?.overlayColor as 'theme' | 'dark' | 'light') || 'theme'
  );
  const [blur, setBlur] = useState(initialSettings?.blur ?? 0);
  const [brightness, setBrightness] = useState(initialSettings?.brightness ?? 100);

  // Open/close modal
  const openModal = useCallback(() => {
    setIsOpen(true);
    // Reset state when opening
    if (initialSettings) {
      setSelectedImage(initialSettings.image);
      setPosition(initialSettings.position);
      setOverlayOpacity(initialSettings.overlayOpacity);
      setOverlayColor((initialSettings.overlayColor as 'theme' | 'dark' | 'light') || 'theme');
      setBlur(initialSettings.blur);
      setBrightness(initialSettings.brightness);
    }
  }, [initialSettings]);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setSearchError(null);
    setUploadError(null);
  }, []);

  // Search Unsplash
  const searchUnsplash = useCallback(async (query: string, page: number = 1) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    try {
      const response = await api.images.searchUnsplash(query, page, 20);
      const images = response.results.map((photo: UnsplashPhoto) =>
        unsplashPhotoToBackgroundImage(photo)
      );

      if (page === 1) {
        setSearchResults(images);
      } else {
        setSearchResults(prev => [...prev, ...images]);
      }

      setTotalPages(response.total_pages);
      setSearchPage(page);
    } catch (error) {
      setSearchError(error instanceof Error ? error.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        searchUnsplash(searchQuery, 1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, searchUnsplash]);

  const loadMoreSearch = useCallback(() => {
    if (searchPage < totalPages && !isSearching) {
      searchUnsplash(searchQuery, searchPage + 1);
    }
  }, [searchPage, totalPages, isSearching, searchQuery, searchUnsplash]);

  // Upload image
  const uploadImageFile = useCallback(async (file: File) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);
    setUploadError(null);

    try {
      setUploadProgress(30);

      const response = await uploadFile<{
        success: boolean;
        data: {
          id: string;
          url: string;
          thumbnail_url: string;
          width: number;
          height: number;
        };
      }>('/api/images/upload', file);

      setUploadProgress(90);

      if (response.success && response.data) {
        const newImage: BackgroundImage = {
          id: response.data.id,
          source: 'upload',
          url: response.data.url,
          thumbnailUrl: response.data.thumbnail_url,
          width: response.data.width,
          height: response.data.height,
        };

        setUserUploads(prev => [newImage, ...prev]);
        setSelectedImage(newImage);
        setUploadProgress(100);
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  }, []);

  // Load user uploads
  const loadUserUploads = useCallback(async () => {
    try {
      const response = await api.images.getUserUploads();
      if (response.success && response.data) {
        const images: BackgroundImage[] = response.data.map((img) => ({
          id: img.id,
          source: 'upload' as const,
          url: img.url,
          thumbnailUrl: img.thumbnail_url,
          width: img.width,
          height: img.height,
          uploadedAt: img.uploaded_at,
        }));
        setUserUploads(images);
      }
    } catch (error) {
      console.error('Failed to load user uploads:', error);
    }
  }, []);

  // Delete upload
  const deleteUpload = useCallback(async (imageId: string) => {
    try {
      await api.images.deleteUpload(imageId);
      setUserUploads(prev => prev.filter(img => img.id !== imageId));
      if (selectedImage?.id === imageId) {
        setSelectedImage(null);
      }
    } catch (error) {
      console.error('Failed to delete upload:', error);
    }
  }, [selectedImage]);

  // Load curated images
  const loadCuratedImages = useCallback(async (category: string | null) => {
    setIsLoadingCurated(true);
    try {
      const response = await api.images.getCurated(category || undefined);
      if (response.success && response.data) {
        const images: BackgroundImage[] = response.data.map((img) => ({
          id: img.id,
          source: 'curated' as const,
          url: img.url,
          thumbnailUrl: img.thumbnail_url,
          blurHash: img.blur_hash,
          attribution: img.attribution ? {
            photographerName: img.attribution.photographer_name,
            photographerUsername: img.attribution.photographer_username,
            photographerUrl: img.attribution.photographer_url,
            unsplashUrl: img.attribution.unsplash_url,
          } : undefined,
          width: img.width,
          height: img.height,
        }));
        setCuratedImages(images);
      }
    } catch (error) {
      console.error('Failed to load curated images:', error);
    } finally {
      setIsLoadingCurated(false);
    }
  }, []);

  // Load curated when category changes
  useEffect(() => {
    if (isOpen && activeTab === 'gallery') {
      loadCuratedImages(selectedCategory);
    }
  }, [isOpen, activeTab, selectedCategory, loadCuratedImages]);

  // Load user uploads when tab changes
  useEffect(() => {
    if (isOpen && activeTab === 'upload') {
      loadUserUploads();
    }
  }, [isOpen, activeTab, loadUserUploads]);

  // Select image
  const selectImage = useCallback((image: BackgroundImage | null) => {
    setSelectedImage(image);
    // Track Unsplash download if applicable
    if (image?.source === 'unsplash' || image?.source === 'curated') {
      api.images.trackUnsplashDownload(image.id).catch(() => {});
    }
  }, []);

  // Build preview settings
  const previewSettings: BackgroundSettings = {
    enabled: !!selectedImage,
    image: selectedImage,
    position,
    overlayOpacity,
    overlayColor,
    blur,
    brightness,
    saturation: 100,
  };

  // Apply settings
  const applySettings = useCallback(() => {
    if (onSelect) {
      onSelect(previewSettings);
    }
    closeModal();
  }, [onSelect, previewSettings, closeModal]);

  // Remove background
  const removeBackground = useCallback(() => {
    if (onSelect) {
      onSelect({
        ...defaultBackgroundSettings,
        enabled: false,
      });
    }
    closeModal();
  }, [onSelect, closeModal]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    setSelectedImage(null);
    setPosition({ x: 50, y: 50 });
    setOverlayOpacity(40);
    setOverlayColor('theme');
    setBlur(0);
    setBrightness(100);
  }, []);

  return {
    // Modal
    isOpen,
    openModal,
    closeModal,

    // Tabs
    activeTab,
    setActiveTab,

    // Search
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    searchError,
    searchPage,
    totalPages,
    loadMoreSearch,

    // Upload
    uploadProgress,
    isUploading,
    uploadError,
    uploadImage: uploadImageFile,
    userUploads,
    loadUserUploads,
    deleteUpload,

    // Gallery
    curatedImages,
    selectedCategory,
    setSelectedCategory,
    isLoadingCurated,

    // Selection
    selectedImage,
    selectImage,

    // Position
    position,
    setPosition,

    // Effects
    overlayOpacity,
    setOverlayOpacity,
    overlayColor,
    setOverlayColor,
    blur,
    setBlur,
    brightness,
    setBrightness,

    // Preview
    previewSettings,

    // Actions
    applySettings,
    removeBackground,
    resetToDefaults,
  };
}

export type { UseImagePickerReturn };
