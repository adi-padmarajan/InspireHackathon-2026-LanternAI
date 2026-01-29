/**
 * SettingsPanel - Simple settings navigation
 */

import { useState } from 'react';
import { Home, Settings, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorsTab } from './ColorsTab';
import { cn } from '@/lib/utils';

export const SettingsPanel = () => {
  return (
    <div className="p-4">
      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="general" className="gap-2">
            <Home className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2">
            <Settings className="h-4 w-4" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="colors" className="gap-2">
            <Palette className="h-4 w-4" />
            Colors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-muted-foreground">General settings coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <div className="p-4 rounded-lg bg-card border border-border">
            <p className="text-muted-foreground">Appearance settings coming soon</p>
          </div>
        </TabsContent>

        <TabsContent value="colors">
          <ColorsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
