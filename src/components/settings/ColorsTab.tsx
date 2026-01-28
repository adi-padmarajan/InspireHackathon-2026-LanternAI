import { useColorSettingsStore } from '@/store/colorSettingsStore';

const accentColors = [
  '#000000', // Black
  '#ffffff', // White
  '#7c3aed', // Purple (existing)
  '#ec4899', // Pink
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#f472b6', // Light Pink
];

export const ColorsTab = () => {
  const {
    usernameColor,
    highlightColor,
    logoIconColor,
    logoBgColor,
    setUsernameColor,
    setHighlightColor,
    setLogoIconColor,
    setLogoBgColor,
    resetToDefaults,
  } = useColorSettingsStore();

  const handleAccentChange = (color: string, setter: (color: string) => void) => {
    setter(color);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Username Color</h3>
        <div className="flex flex-wrap gap-2">
          {accentColors.map((color) => (
            <button
              key={color}
              onClick={() => handleAccentChange(color, setUsernameColor)}
              className={`w-12 h-12 rounded-full transition-transform hover:scale-110 ${
                usernameColor === color ? 'ring-2 ring-offset-2 ring-foreground' : ''
              } ${color === '#ffffff' ? 'border border-muted-foreground/50' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Highlight Color</h3>
        <div className="flex flex-wrap gap-2">
          {accentColors.map((color) => (
            <button
              key={color}
              onClick={() => handleAccentChange(color, setHighlightColor)}
              className={`w-12 h-12 rounded-full transition-transform hover:scale-110 ${
                highlightColor === color ? 'ring-2 ring-offset-2 ring-foreground' : ''
              } ${color === '#ffffff' ? 'border border-muted-foreground/50' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Logo Icon Color</h3>
        <div className="flex flex-wrap gap-2">
          {accentColors.map((color) => (
            <button
              key={color}
              onClick={() => handleAccentChange(color, setLogoIconColor)}
              className={`w-12 h-12 rounded-full transition-transform hover:scale-110 ${
                logoIconColor === color ? 'ring-2 ring-offset-2 ring-foreground' : ''
              } ${color === '#ffffff' ? 'border border-muted-foreground/50' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Logo Background Color</h3>
        <div className="flex flex-wrap gap-2">
          {accentColors.map((color) => (
            <button
              key={color}
              onClick={() => handleAccentChange(color, setLogoBgColor)}
              className={`w-12 h-12 rounded-full transition-transform hover:scale-110 ${
                logoBgColor === color ? 'ring-2 ring-offset-2 ring-foreground' : ''
              } ${color === '#ffffff' ? 'border border-muted-foreground/50' : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={resetToDefaults}
        className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
      >
        Reset to Defaults
      </button>
    </div>
  );
};
