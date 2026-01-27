import React from 'react';
import { RotateCcw, Lamp } from 'lucide-react';
import { useColorSettingsStore } from '../../store/colorSettingsStore';
import { ColorPicker } from '../ui/ColorPicker';

export const ColorSettings: React.FC = () => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Color Customization</h3>
        <button
          type="button"
          onClick={resetToDefaults}
          className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-md hover:bg-muted transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Reset to Defaults
        </button>
      </div>

      <div className="space-y-6">
        <div className="p-4 rounded-lg border border-border bg-card">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Text Colors</h4>
          <div className="space-y-4">
            <ColorPicker
              label="Username Color"
              value={usernameColor}
              onChange={setUsernameColor}
            />
            <ColorPicker
              label="Highlight Color"
              value={highlightColor}
              onChange={setHighlightColor}
            />
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Logo Colors</h4>
          <div className="space-y-4">
            <ColorPicker
              label="Logo Background"
              value={logoBgColor}
              onChange={setLogoBgColor}
            />
            <ColorPicker
              label="Icon Color"
              value={logoIconColor}
              onChange={setLogoIconColor}
            />
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2">Preview</p>
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: logoBgColor }}
            >
              <Lamp className="w-8 h-8" style={{ color: logoIconColor }} />
            </div>
          </div>
        </div>

        <div className="p-4 rounded-lg border border-border bg-card">
          <h4 className="text-sm font-medium text-muted-foreground mb-4">Text Preview</h4>
          <div className="space-y-2">
            <p className="text-foreground">
              Hello, <span style={{ color: usernameColor, fontWeight: 600 }}>Username</span>!
            </p>
            <p className="text-foreground">
              This is <span style={{ color: highlightColor, fontWeight: 600 }}>highlighted text</span> example.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
