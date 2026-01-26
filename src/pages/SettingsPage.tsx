/**
 * SettingsPage
 * Comprehensive theme customization with stunning visual previews
 * Award-winning user personalization experience
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Settings, Palette, Sliders, Accessibility, ChevronLeft } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { themeCategories, ThemeCategory } from '@/lib/themes';
import { ThemeTransitionOverlay } from '@/components/AmbientBackground';
import { ThemePreviewCard } from '@/components/settings/ThemePreviewCard';
import { CustomizationPanel } from '@/components/settings/CustomizationPanel';
import { SettingsBackground } from '@/components/settings/SettingsBackground';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { pageVariants, staggerContainer, fadeInUp } from '@/lib/animations';
import { Navigation } from '@/components/Navigation';

// ============================================================================
// THEME ICON HELPER
// ============================================================================

const CategoryIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Sparkles;
  return <IconComponent className={className} />;
};

// ============================================================================
// SETTINGS HERO
// ============================================================================

const SettingsHero = () => {
  const { currentTheme } = useTheme();

  return (
    <motion.div
      className="text-center mb-12"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {/* Animated icon */}
      <motion.div
        className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-6 relative"
        style={{ background: currentTheme.preview.gradient }}
        animate={{
          boxShadow: [
            `0 0 30px ${currentTheme.particles.baseColor}40`,
            `0 0 60px ${currentTheme.particles.baseColor}60`,
            `0 0 30px ${currentTheme.particles.baseColor}40`,
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Settings className="h-10 w-10 text-white drop-shadow-lg" />
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            background: `conic-gradient(from 0deg, transparent, ${currentTheme.particles.baseColor}20, transparent)`,
          }}
        />
      </motion.div>

      <h1 className="text-4xl font-serif font-bold text-foreground mb-3">
        Make Lantern Yours
      </h1>
      <p className="text-lg text-muted-foreground max-w-md mx-auto">
        Choose from {15} beautiful themes and customize every detail to match your style
      </p>
    </motion.div>
  );
};

// ============================================================================
// THEME CATEGORY SELECTOR
// ============================================================================

const ThemeCategorySelector = ({
  selected,
  onSelect,
}: {
  selected: ThemeCategory | 'all';
  onSelect: (category: ThemeCategory | 'all') => void;
}) => {
  const categories = [
    { id: 'all' as const, name: 'All Themes', icon: 'Grid3X3' },
    ...themeCategories,
  ];

  return (
    <motion.div
      className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {categories.map((category) => {
        const isActive = selected === category.id;
        return (
          <motion.button
            key={category.id}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full border whitespace-nowrap transition-colors",
              isActive
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card hover:border-primary/50 text-foreground"
            )}
            onClick={() => onSelect(category.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <CategoryIcon name={category.icon} className="h-4 w-4" />
            <span className="text-sm font-medium">{category.name}</span>
          </motion.button>
        );
      })}
    </motion.div>
  );
};

// ============================================================================
// THEME GRID
// ============================================================================

const ThemeGrid = ({ categoryFilter }: { categoryFilter: ThemeCategory | 'all' }) => {
  const { allThemes, currentTheme, setTheme } = useTheme();

  const filteredThemes = categoryFilter === 'all'
    ? allThemes
    : allThemes.filter(t => t.category === categoryFilter);

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <AnimatePresence mode="popLayout">
        {filteredThemes.map((theme, index) => (
          <ThemePreviewCard
            key={theme.id}
            theme={theme}
            isActive={currentTheme.id === theme.id}
            onSelect={() => setTheme(theme.id)}
            index={index}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// ACCESSIBILITY SETTINGS
// ============================================================================

const AccessibilitySettings = () => {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
          <Accessibility className="h-5 w-5 text-primary" />
          Accessibility
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Reduce Motion</p>
              <p className="text-xs text-muted-foreground">
                Respects your system preference for reduced motion
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              System Controlled
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">High Contrast</p>
              <p className="text-xs text-muted-foreground">
                Increase color contrast for better visibility
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              Coming Soon
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">Focus Indicators</p>
              <p className="text-xs text-muted-foreground">
                Enhanced keyboard navigation indicators
              </p>
            </div>
            <div className="text-sm text-primary">
              Enabled
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 rounded-2xl bg-card border border-border">
        <h3 className="text-lg font-semibold text-foreground mb-2">
          About Accessibility
        </h3>
        <p className="text-sm text-muted-foreground">
          Lantern is built with accessibility in mind. All themes maintain WCAG color contrast
          ratios, and the interface is fully keyboard navigable. If you have specific
          accessibility needs, please let us know.
        </p>
      </div>
    </motion.div>
  );
};

// ============================================================================
// MAIN SETTINGS PAGE
// ============================================================================

const SettingsPage = () => {
  const [categoryFilter, setCategoryFilter] = useState<ThemeCategory | 'all'>('all');

  return (
    <motion.div
      className="min-h-screen relative"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {/* Enhanced Settings background */}
      <SettingsBackground />

      {/* Theme transition overlay */}
      <ThemeTransitionOverlay />

      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main className="container max-w-5xl mx-auto px-4 pt-24 pb-16 relative z-10">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        {/* Hero */}
        <SettingsHero />

        {/* Tabs */}
        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="themes" className="gap-2">
              <Palette className="h-4 w-4" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="customize" className="gap-2">
              <Sliders className="h-4 w-4" />
              Customize
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="gap-2">
              <Accessibility className="h-4 w-4" />
              Access
            </TabsTrigger>
          </TabsList>

          <TabsContent value="themes" className="mt-0">
            <ThemeCategorySelector
              selected={categoryFilter}
              onSelect={setCategoryFilter}
            />
            <ThemeGrid categoryFilter={categoryFilter} />
          </TabsContent>

          <TabsContent value="customize" className="mt-0">
            <div className="max-w-md mx-auto">
              <motion.div
                className="p-6 rounded-2xl bg-card border border-border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CustomizationPanel />
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="accessibility" className="mt-0">
            <div className="max-w-md mx-auto">
              <AccessibilitySettings />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </motion.div>
  );
};

export default SettingsPage;
