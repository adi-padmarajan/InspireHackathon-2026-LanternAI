import { useState } from 'react';
import { Home, Settings, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ColorsTab } from './ColorsTab';

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'colors', label: 'Colors', icon: Palette },
];

export const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="home">
          <div className="text-center text-muted-foreground">
            Home settings coming soon
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <div className="text-center text-muted-foreground">
            General settings coming soon
          </div>
        </TabsContent>
        
        <TabsContent value="colors">
          <ColorsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
