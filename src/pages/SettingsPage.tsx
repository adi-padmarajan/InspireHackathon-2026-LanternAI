/**
 * SettingsPage
 * Award-winning theme customization with stunning visual previews
 * Cinematic, immersive personalization experience
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Settings, Palette, Sliders, Accessibility, ChevronLeft, Sparkles } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '@/contexts/ThemeContext';
import { themeCategories, ThemeCategory } from '@/lib/themes';
import { ThemeTransitionOverlay } from '@/components/AmbientBackground';
import { ThemePreviewCard } from '@/components/settings/ThemePreviewCard';
import { CustomizationStudio } from '@/components/settings/CustomizationStudio';
import { SettingsBackground } from '@/components/settings/SettingsBackground';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { pageVariants, staggerContainer, fadeInUp } from '@/lib/animations';
import { Navigation } from '@/components/Navigation';

// Check if custom background is active for conditional rendering
const useHasCustomBackground = () => {
  const { currentBackground } = useTheme();
  return currentBackground?.enabled && (currentBackground?.image || currentBackground?.wallpaper);
};

// ============================================================================
// THEME ICON HELPER
// ============================================================================

const CategoryIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name] || LucideIcons.Sparkles;
  return <IconComponent className={className} />;
};

// ============================================================================
// SETTINGS HERO - Enhanced with cinematic feel
// ============================================================================

const SettingsHero = () => {
  const { currentTheme } = useTheme();

  return (
    <motion.div
      className="text-center mb-16"
      variants={fadeInUp}
      initial="hidden"
      animate="visible"
    >
      {/* Animated icon with cinematic glow */}
      <motion.div
        className="inline-flex items-center justify-center w-24 h-24 rounded-3xl mb-8 relative overflow-hidden"
        style={{ background: currentTheme.preview.gradient }}
        animate={{
          boxShadow: [
            `0 0 40px ${currentTheme.particles.baseColor}50`,
            `0 0 80px ${currentTheme.particles.baseColor}70`,
            `0 0 40px ${currentTheme.particles.baseColor}50`,
          ],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Settings className="h-12 w-12 text-white drop-shadow-xl" />

        {/* Rotating glow ring */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          style={{
            background: `conic-gradient(from 0deg, transparent, ${currentTheme.particles.baseColor}30, transparent)`,
          }}
        />

        {/* Inner shine */}
        <motion.div
          className="absolute inset-0 rounded-3xl"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{
            background: `radial-gradient(circle at 30% 30%, white, transparent 60%)`,
          }}
        />
      </motion.div>

      <motion.h1
        className="text-5xl font-serif font-bold text-foreground mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        Craft Your Experience
      </motion.h1>
      <motion.p
        className="text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        25 award-winning themes. Cinematic visuals.
        <span className="text-primary font-medium"> Your story, your way.</span>
      </motion.p>
    </motion.div>
  );
};

// ============================================================================
// THEME CATEGORY SELECTOR - Stunning visual category pills
// ============================================================================

const ThemeCategorySelector = ({
  selected,
  onSelect,
}: {
  selected: ThemeCategory | 'all';
  onSelect: (category: ThemeCategory | 'all') => void;
}) => {
  const { currentTheme } = useTheme();

  const categories = [
    { id: 'all' as const, name: 'All Themes', icon: 'Grid3X3', description: 'Browse the complete collection' },
    ...themeCategories,
  ];

  return (
    <motion.div
      className="mb-10"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Category description */}
      <motion.div
        className="text-center mb-6"
        key={selected}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-2xl font-semibold text-foreground mb-1">
          {categories.find(c => c.id === selected)?.name || 'All Themes'}
        </h2>
        <p className="text-sm text-muted-foreground">
          {categories.find(c => c.id === selected)?.description || 'Browse the complete collection'}
        </p>
      </motion.div>

      {/* Category pills with enhanced styling */}
      <div className="flex flex-wrap justify-center gap-2">
        {categories.map((category, index) => {
          const isActive = selected === category.id;
          return (
            <motion.button
              key={category.id}
              className={cn(
                "flex items-center gap-2.5 px-5 py-2.5 rounded-full border-2 transition-all duration-300",
                "font-medium text-sm backdrop-blur-sm",
                isActive
                  ? "border-primary bg-primary/10 text-primary shadow-lg"
                  : "border-border/50 bg-card/50 hover:border-primary/50 hover:bg-card text-foreground/80 hover:text-foreground"
              )}
              onClick={() => onSelect(category.id)}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              style={isActive ? {
                boxShadow: `0 4px 20px ${currentTheme.particles.baseColor}30`,
              } : undefined}
            >
              <CategoryIcon name={category.icon} className={cn(
                "h-4 w-4 transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span>{category.name}</span>
              {isActive && (
                <motion.div
                  className="w-1.5 h-1.5 rounded-full bg-primary"
                  layoutId="activeDot"
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

// ============================================================================
// THEME GRID - Enhanced with category headers
// ============================================================================

const ThemeGrid = ({ categoryFilter }: { categoryFilter: ThemeCategory | 'all' }) => {
  const { allThemes, currentTheme, setTheme } = useTheme();

  const filteredThemes = categoryFilter === 'all'
    ? allThemes
    : allThemes.filter(t => t.category === categoryFilter);

  // Group themes by category when showing all
  const groupedThemes = categoryFilter === 'all'
    ? themeCategories.reduce((acc, cat) => {
        const categoryThemes = allThemes.filter(t => t.category === cat.id);
        if (categoryThemes.length > 0) {
          acc.push({ category: cat, themes: categoryThemes });
        }
        return acc;
      }, [] as { category: typeof themeCategories[0]; themes: typeof allThemes }[])
    : [{ category: themeCategories.find(c => c.id === categoryFilter)!, themes: filteredThemes }];

  return (
    <div className="space-y-12">
      {groupedThemes.map(({ category, themes }, groupIndex) => (
        <motion.div
          key={category.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: groupIndex * 0.1 }}
        >
          {/* Category header - only show when viewing all */}
          {categoryFilter === 'all' && (
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: groupIndex * 0.1 + 0.1 }}
            >
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 border border-primary/20">
                <CategoryIcon name={category.icon} className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{category.name}</h3>
                <p className="text-xs text-muted-foreground">{category.description}</p>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-4" />
            </motion.div>
          )}

          {/* Theme cards grid */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <AnimatePresence mode="popLayout">
              {themes.map((theme, index) => (
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
        </motion.div>
      ))}
    </div>
  );
};

// ============================================================================
// THEME STATS - Shows collection overview
// ============================================================================

const ThemeStats = () => {
  const { allThemes } = useTheme();

  return (
    <motion.div
      className="flex justify-center gap-8 mb-8 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
    >
      <div className="text-center">
        <div className="text-3xl font-bold text-primary">{allThemes.length}</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Themes</div>
      </div>
      <div className="w-px bg-border" />
      <div className="text-center">
        <div className="text-3xl font-bold text-primary">{themeCategories.length}</div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Categories</div>
      </div>
      <div className="w-px bg-border" />
      <div className="text-center">
        <div className="text-3xl font-bold text-primary flex items-center gap-1">
          <Sparkles className="h-5 w-5" />
        </div>
        <div className="text-xs text-muted-foreground uppercase tracking-wider">Award-Winning</div>
      </div>
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
  const hasCustomBackground = useHasCustomBackground();

  return (
    <motion.div
      className={cn(
        "min-h-screen relative",
        hasCustomBackground ? "bg-transparent" : ""
      )}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {/* Enhanced Settings background - hide when custom background is active */}
      {!hasCustomBackground && <SettingsBackground />}

      {/* Theme transition overlay */}
      <ThemeTransitionOverlay />

      {/* Navigation */}
      <Navigation />

      {/* Main content */}
      <main className="container max-w-6xl mx-auto px-4 pt-24 pb-16 relative z-10">
        {/* Back button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 hover:bg-primary/10">
              <ChevronLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </motion.div>

        {/* Hero */}
        <SettingsHero />

        {/* Tabs */}
        <Tabs defaultValue="themes" className="w-full">
          <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 mb-10 h-14 bg-card/50 backdrop-blur-sm border border-border/50">
            <TabsTrigger value="themes" className="gap-2 text-sm data-[state=active]:bg-primary/10">
              <Palette className="h-4 w-4" />
              Themes
            </TabsTrigger>
            <TabsTrigger value="customize" className="gap-2 text-sm data-[state=active]:bg-primary/10">
              <Sliders className="h-4 w-4" />
              Customize
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="gap-2 text-sm data-[state=active]:bg-primary/10">
              <Accessibility className="h-4 w-4" />
              Accessibility
            </TabsTrigger>
          </TabsList>

          <TabsContent value="themes" className="mt-0">
            <ThemeStats />
            <ThemeCategorySelector
              selected={categoryFilter}
              onSelect={setCategoryFilter}
            />
            <ThemeGrid categoryFilter={categoryFilter} />
          </TabsContent>

          <TabsContent value="customize" className="mt-0">
            <div className="max-w-2xl mx-auto">
              <motion.div
                className="p-6 rounded-2xl bg-card/80 backdrop-blur-sm border border-border shadow-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <CustomizationStudio />
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
