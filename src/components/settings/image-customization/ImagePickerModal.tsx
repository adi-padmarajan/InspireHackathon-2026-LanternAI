/**
 * ImagePickerModal Component
 * Full-featured modal for selecting and customizing background images
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Upload, Images, Check, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UseImagePickerReturn, PickerTab } from './useImagePicker';
import { UnsplashSearch } from './UnsplashSearch';
import { ImageUploader } from './ImageUploader';
import { CuratedGallery } from './CuratedGallery';
import { ImagePositioner } from './ImagePositioner';
import { OverlayControls } from './OverlayControls';
import { cn } from '@/lib/utils';

interface ImagePickerModalProps {
  picker: UseImagePickerReturn;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring' as const,
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 10,
    transition: { duration: 0.2 },
  },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const tabIcons: Record<PickerTab, React.ComponentType<{ className?: string }>> = {
  search: Search,
  upload: Upload,
  gallery: Images,
};

export function ImagePickerModal({ picker }: ImagePickerModalProps) {
  const {
    isOpen,
    closeModal,
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
    uploadImage,
    userUploads,
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
    // Actions
    applySettings,
    removeBackground,
    resetToDefaults,
    previewSettings,
  } = picker;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={closeModal}
          />

          {/* Modal */}
          <motion.div
            className={cn(
              'relative w-full max-w-5xl max-h-[90vh]',
              'bg-background rounded-2xl shadow-2xl',
              'flex flex-col overflow-hidden'
            )}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-lg font-semibold">Choose Background</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeModal}
                className="h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex flex-1 overflow-hidden">
              {/* Left: Image selection */}
              <div className="flex-1 flex flex-col min-w-0 border-r border-border">
                <Tabs
                  value={activeTab}
                  onValueChange={(v) => setActiveTab(v as PickerTab)}
                  className="flex flex-col h-full"
                >
                  <TabsList className="mx-4 mt-4 mb-2 w-fit">
                    {(['search', 'upload', 'gallery'] as PickerTab[]).map((tab) => {
                      const Icon = tabIcons[tab];
                      return (
                        <TabsTrigger
                          key={tab}
                          value={tab}
                          className="gap-2"
                        >
                          <Icon className="w-4 h-4" />
                          {tab === 'search' && 'Search'}
                          {tab === 'upload' && 'Upload'}
                          {tab === 'gallery' && 'Gallery'}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>

                  <div className="flex-1 overflow-hidden px-4 pb-4">
                    <TabsContent value="search" className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                      <UnsplashSearch
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        searchResults={searchResults}
                        isSearching={isSearching}
                        searchError={searchError}
                        selectedImage={selectedImage}
                        onSelectImage={selectImage}
                        onLoadMore={loadMoreSearch}
                        hasMore={searchPage < totalPages}
                      />
                    </TabsContent>

                    <TabsContent value="upload" className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                      <ImageUploader
                        onUpload={uploadImage}
                        isUploading={isUploading}
                        uploadProgress={uploadProgress}
                        uploadError={uploadError}
                        userUploads={userUploads}
                        selectedImage={selectedImage}
                        onSelectImage={selectImage}
                        onDeleteImage={deleteUpload}
                      />
                    </TabsContent>

                    <TabsContent value="gallery" className="h-full mt-0 data-[state=active]:flex data-[state=active]:flex-col">
                      <CuratedGallery
                        images={curatedImages}
                        isLoading={isLoadingCurated}
                        selectedCategory={selectedCategory}
                        onSelectCategory={setSelectedCategory}
                        selectedImage={selectedImage}
                        onSelectImage={selectImage}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>

              {/* Right: Preview and controls */}
              <div className="w-80 flex flex-col p-4 overflow-y-auto">
                {selectedImage ? (
                  <>
                    {/* Position control */}
                    <ImagePositioner
                      image={selectedImage}
                      position={position}
                      onPositionChange={setPosition}
                      overlayOpacity={overlayOpacity}
                    />

                    <div className="h-px bg-border my-4" />

                    {/* Overlay controls */}
                    <OverlayControls
                      overlayOpacity={overlayOpacity}
                      setOverlayOpacity={setOverlayOpacity}
                      overlayColor={overlayColor}
                      setOverlayColor={setOverlayColor}
                      blur={blur}
                      setBlur={setBlur}
                      brightness={brightness}
                      setBrightness={setBrightness}
                    />

                    {/* Attribution */}
                    {selectedImage.attribution && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <a
                          href={selectedImage.attribution.unsplashUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <span>
                            Photo by{' '}
                            <span className="font-medium">
                              {selectedImage.attribution.photographerName}
                            </span>
                          </span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-center">
                    <div className="text-muted-foreground">
                      <Images className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p className="text-sm font-medium mb-1">No image selected</p>
                      <p className="text-xs">
                        Search, upload, or choose from the gallery
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
              <div className="flex items-center gap-2">
                {previewSettings.enabled && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={removeBackground}
                    className="text-destructive hover:text-destructive gap-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetToDefaults}
                >
                  Reset
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={closeModal}
                >
                  Cancel
                </Button>
                <Button
                  onClick={applySettings}
                  disabled={!selectedImage}
                  className="gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  Apply Background
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default ImagePickerModal;
