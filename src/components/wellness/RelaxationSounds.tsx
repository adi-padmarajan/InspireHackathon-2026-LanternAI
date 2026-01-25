import { useState, useRef, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Volume2, 
  CloudRain, 
  Waves, 
  TreePine,
  Radio,
  Music,
  Wind
} from "lucide-react";

interface SoundOption {
  id: string;
  name: string;
  icon: React.ElementType;
  type: "noise" | "nature" | "ambient";
  color: string;
}

const soundOptions: SoundOption[] = [
  // Nature sounds
  { id: "rain", name: "Rain", icon: CloudRain, type: "nature", color: "text-blue-400" },
  { id: "ocean", name: "Ocean Waves", icon: Waves, type: "nature", color: "text-cyan-400" },
  { id: "forest", name: "Forest", icon: TreePine, type: "nature", color: "text-green-400" },
  // Noise
  { id: "white", name: "White Noise", icon: Radio, type: "noise", color: "text-gray-400" },
  { id: "pink", name: "Pink Noise", icon: Radio, type: "noise", color: "text-pink-400" },
  { id: "brown", name: "Brown Noise", icon: Radio, type: "noise", color: "text-amber-600" },
  // Ambient
  { id: "wind", name: "Gentle Wind", icon: Wind, type: "ambient", color: "text-sky-400" },
  { id: "ambient", name: "Ambient Pad", icon: Music, type: "ambient", color: "text-purple-400" },
];

const RelaxationSounds = () => {
  const [activeSound, setActiveSound] = useState<string | null>(null);
  const [volume, setVolume] = useState(50);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const noiseBufferRef = useRef<{ [key: string]: AudioBuffer }>({});

  // Create noise buffer
  const createNoiseBuffer = useCallback((type: "white" | "pink" | "brown") => {
    if (!audioContextRef.current) return null;
    
    const bufferSize = 2 * audioContextRef.current.sampleRate;
    const buffer = audioContextRef.current.createBuffer(1, bufferSize, audioContextRef.current.sampleRate);
    const output = buffer.getChannelData(0);
    
    if (type === "white") {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (type === "pink") {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === "brown") {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        output[i] = (lastOut + (0.02 * white)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    }
    
    return buffer;
  }, []);

  // Create nature/ambient sound simulation using oscillators
  const createNatureSound = useCallback((type: string) => {
    if (!audioContextRef.current || !gainNodeRef.current) return;
    
    const ctx = audioContextRef.current;
    
    // Create a complex sound using multiple oscillators and filters
    if (type === "rain" || type === "ocean" || type === "forest" || type === "wind") {
      // Use filtered noise for natural sounds
      const noiseBuffer = createNoiseBuffer("white");
      if (!noiseBuffer) return;
      
      const source = ctx.createBufferSource();
      source.buffer = noiseBuffer;
      source.loop = true;
      
      const filter = ctx.createBiquadFilter();
      
      if (type === "rain") {
        filter.type = "bandpass";
        filter.frequency.value = 3000;
        filter.Q.value = 0.5;
      } else if (type === "ocean") {
        filter.type = "lowpass";
        filter.frequency.value = 400;
        // Create LFO for wave effect
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.1;
        lfoGain.gain.value = 200;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
      } else if (type === "forest") {
        filter.type = "bandpass";
        filter.frequency.value = 2000;
        filter.Q.value = 2;
      } else if (type === "wind") {
        filter.type = "lowpass";
        filter.frequency.value = 800;
        // Add slow modulation
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.05;
        lfoGain.gain.value = 400;
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        lfo.start();
      }
      
      source.connect(filter);
      filter.connect(gainNodeRef.current);
      source.start();
      sourceNodeRef.current = source;
      
    } else if (type === "ambient") {
      // Create ambient pad with multiple oscillators
      const oscillators: OscillatorNode[] = [];
      const frequencies = [130.81, 164.81, 196.00, 261.63]; // C major chord
      
      frequencies.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        
        const oscGain = ctx.createGain();
        oscGain.gain.value = 0.1;
        
        // Add slight detune for richness
        osc.detune.value = Math.random() * 10 - 5;
        
        osc.connect(oscGain);
        oscGain.connect(gainNodeRef.current!);
        osc.start();
        oscillators.push(osc);
      });
      
      // Store first oscillator as reference
      sourceNodeRef.current = oscillators[0];
    }
  }, [createNoiseBuffer]);

  const stopSound = useCallback(() => {
    if (sourceNodeRef.current) {
      try {
        sourceNodeRef.current.stop();
      } catch (e) {
        // Already stopped
      }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playSound = useCallback((soundId: string) => {
    // Initialize audio context if needed
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
    
    // Resume context if suspended
    if (audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume();
    }
    
    // Stop current sound
    stopSound();
    
    const sound = soundOptions.find(s => s.id === soundId);
    if (!sound) return;
    
    if (sound.type === "noise") {
      const noiseType = soundId as "white" | "pink" | "brown";
      
      // Create or get cached buffer
      if (!noiseBufferRef.current[noiseType]) {
        const buffer = createNoiseBuffer(noiseType);
        if (buffer) noiseBufferRef.current[noiseType] = buffer;
      }
      
      const buffer = noiseBufferRef.current[noiseType];
      if (buffer && audioContextRef.current && gainNodeRef.current) {
        const source = audioContextRef.current.createBufferSource();
        source.buffer = buffer;
        source.loop = true;
        source.connect(gainNodeRef.current);
        source.start();
        sourceNodeRef.current = source;
      }
    } else {
      createNatureSound(soundId);
    }
    
    setActiveSound(soundId);
    setIsPlaying(true);
  }, [createNoiseBuffer, createNatureSound, stopSound]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      stopSound();
      setActiveSound(null);
    } else if (activeSound) {
      playSound(activeSound);
    }
  }, [isPlaying, activeSound, playSound, stopSound]);

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume / 100;
    }
  }, [volume]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSound();
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [stopSound]);

  const handleSoundSelect = (soundId: string) => {
    if (activeSound === soundId && isPlaying) {
      stopSound();
      setActiveSound(null);
    } else {
      playSound(soundId);
    }
  };

  const renderSoundButtons = (type: "nature" | "noise" | "ambient") => {
    const sounds = soundOptions.filter(s => s.type === type);
    
    return (
      <div className="grid grid-cols-3 gap-3">
        {sounds.map((sound) => {
          const Icon = sound.icon;
          const isActive = activeSound === sound.id && isPlaying;
          
          return (
            <button
              key={sound.id}
              onClick={() => handleSoundSelect(sound.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                isActive
                  ? "bg-primary/20 ring-2 ring-primary scale-105"
                  : "bg-accent/30 hover:bg-accent/50"
              }`}
            >
              <div className={`p-3 rounded-full ${isActive ? "bg-primary/30" : "bg-background/50"}`}>
                <Icon className={`h-6 w-6 ${isActive ? "text-primary" : sound.color}`} />
              </div>
              <span className="text-sm font-medium text-foreground">{sound.name}</span>
              {isActive && (
                <span className="text-xs text-primary animate-pulse">Playing</span>
              )}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="forest-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <Music className="h-5 w-5 text-primary" />
          Relaxation Sounds
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Choose a sound to help you relax, focus, or unwind. These sounds are generated in your browser for a seamless experience.
        </p>
        
        <Tabs defaultValue="nature" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="nature" className="text-xs sm:text-sm">
              <TreePine className="h-4 w-4 mr-1 hidden sm:inline" />
              Nature
            </TabsTrigger>
            <TabsTrigger value="noise" className="text-xs sm:text-sm">
              <Radio className="h-4 w-4 mr-1 hidden sm:inline" />
              Noise
            </TabsTrigger>
            <TabsTrigger value="ambient" className="text-xs sm:text-sm">
              <Music className="h-4 w-4 mr-1 hidden sm:inline" />
              Ambient
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="nature" className="mt-4">
            {renderSoundButtons("nature")}
          </TabsContent>
          
          <TabsContent value="noise" className="mt-4">
            {renderSoundButtons("noise")}
          </TabsContent>
          
          <TabsContent value="ambient" className="mt-4">
            {renderSoundButtons("ambient")}
          </TabsContent>
        </Tabs>

        {/* Playback Controls */}
        <div className="flex items-center gap-4 pt-4 border-t border-border/50">
          <Button
            variant={isPlaying ? "default" : "outline"}
            size="icon"
            onClick={togglePlay}
            disabled={!activeSound}
            className="shrink-0"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          
          <div className="flex items-center gap-3 flex-1">
            <Volume2 className="h-4 w-4 text-muted-foreground shrink-0" />
            <Slider
              value={[volume]}
              onValueChange={(value) => setVolume(value[0])}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-sm text-muted-foreground w-8 text-right">{volume}%</span>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          💡 Tip: Combine with headphones for the best experience. These sounds can help with focus, sleep, or meditation.
        </p>
      </CardContent>
    </Card>
  );
};

export default RelaxationSounds;
