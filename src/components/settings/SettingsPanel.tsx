import { ColorSettings } from './ColorSettings';

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'colors', label: 'Colors', icon: Palette },
];

const renderTabContent = (activeTab) => {
  switch (activeTab) {
    case 'home':
      return <HomeScreen />;
    case 'settings':
      return <SettingsScreen />;
    case 'colors':
      return <ColorSettings />;
    default:
      return <HomeScreen />;
  }
};

export const SettingsPanel = () => {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
  };

  return (
    <div>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange}>
        {renderTabContent(activeTab)}
      </Tabs>
    </div>
  );
};