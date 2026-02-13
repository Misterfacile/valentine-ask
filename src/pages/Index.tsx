import React, { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import confetti from "canvas-confetti";

const FloatingHearts = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {Array.from({ length: 15 }).map((_, i) => (
      <span
        key={i}
        className="absolute text-2xl md:text-4xl"
        style={{
          left: `${Math.random() * 100}%`,
          animation: `float-heart ${4 + Math.random() * 4}s ease-in infinite`,
          animationDelay: `${Math.random() * 5}s`,
        }}
      >
        {["❤️", "💕", "💗", "💖", "🩷"][i % 5]}
      </span>
    ))}
  </div>
);

const HeartFrame = ({ src, label }: { src: string; label?: string }) => (
  <div className="flex flex-col items-center gap-2">
    <div className="relative w-36 h-36 md:w-48 md:h-48">
      <div
        className="w-full h-full overflow-hidden bg-secondary flex items-center justify-center"
        style={{
          clipPath:
            "path('M 120 220 C 120 220 20 170 20 100 C 20 50 60 20 100 20 C 120 20 120 40 120 40 C 120 40 120 20 140 20 C 180 20 220 50 220 100 C 220 170 120 220 120 220 Z')",
          transform: "scale(0.95)",
        }}
      >
        {src ? (
          <img src={src} alt="Photo" className="w-full h-full object-cover" />
        ) : (
          <span className="text-4xl">📷</span>
        )}
      </div>
    </div>
    {label && <p className="text-sm text-muted-foreground font-medium">{label}</p>}
  </div>
);

const ALLOWED_NAMES = ["bubu", "celia"];
const PRESET_IMAGE = `${import.meta.env.BASE_URL}dudu.webp`;

const NameEntry = ({
  onContinue,
}: {
  onContinue: (name: string, image: string) => void;
}) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [nameError, setNameError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => setImage(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = () => {
    const trimmed = name.trim();
    if (!ALLOWED_NAMES.includes(trimmed.toLowerCase())) {
      setNameError("WHO ARE YOU WTF ??? 😤 This is reserved for someone special! 💕");
      return;
    }
    setNameError("");
    onContinue(trimmed, image);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (nameError) setNameError("");
  };

  return (
    <div className="relative z-10 flex flex-col items-center gap-8 p-6 max-w-lg mx-auto animate-fade-in">
      <h1 className="font-script text-5xl md:text-7xl text-primary drop-shadow-sm">
        14th February
      </h1>
      <p className="text-lg text-muted-foreground">💌 Valentine's Day</p>
      <div className="flex items-center gap-2 md:gap-4">
        <HeartFrame src={PRESET_IMAGE} label="Me - Dudu 💖" />
        <span className="text-4xl md:text-6xl animate-pulse">❤️</span>
        <div
          className="cursor-pointer group"
          onClick={() => fileRef.current?.click()}
        >
          <HeartFrame src={image} label={image ? "My Love 💕" : "Tap to add 💕"} />
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFile}
          />
        </div>
      </div>

      <div className="w-full space-y-2">
        <label className="text-sm font-medium text-foreground">What's your name? 💝</label>
        <Input
          placeholder="Enter your name..."
          value={name}
          onChange={handleNameChange}
          className={`text-center text-lg bg-card border-primary/30 focus:border-primary ${
            nameError ? "border-destructive" : ""
          }`}
        />
        {nameError && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 text-center animate-fade-in">
            <p className="text-destructive font-bold text-lg">{nameError}</p>
          </div>
        )}
      </div>

      <Button
        size="lg"
        disabled={!name.trim()}
        onClick={handleContinue}
        className="text-lg px-10 rounded-full shadow-lg"
        style={{ animation: name.trim() ? "pulse-glow 2s infinite" : "none" }}
      >
        Continue 💕
      </Button>
    </div>
  );
};

// Step 2: The Question
const TheQuestion = ({
  name,
  image,
  onYes,
}: {
  name: string;
  image: string;
  onYes: () => void;
}) => {
  const [yesScale, setYesScale] = useState(1);
  const [noScale, setNoScale] = useState(1);
  const [noPos, setNoPos] = useState<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const moveNo = useCallback(() => {
    const maxX = window.innerWidth - 120;
    const maxY = window.innerHeight - 60;
    setNoPos({
      x: Math.random() * maxX,
      y: Math.random() * maxY,
    });
    setYesScale((s) => Math.min(s + 0.25, 3));
    setNoScale((s) => Math.max(s - 0.08, 0.4));
  }, []);

  return (
    <div ref={containerRef} className="relative z-10 flex flex-col items-center gap-6 p-6 min-h-screen justify-center animate-fade-in">
      <h1 className="font-script text-4xl md:text-6xl text-primary text-center leading-tight">
        {name}, Will You Be My Valentine?
      </h1>

      {/* Dual photos */}
      <div className="flex items-center gap-2 md:gap-4">
        <HeartFrame src={PRESET_IMAGE} />
        <span className="text-4xl md:text-5xl animate-pulse">❤️</span>
        <HeartFrame src={image} />
      </div>

      <div className="flex gap-6 mt-4 items-center">
        <Button
          size="lg"
          onClick={onYes}
          className="rounded-full text-xl shadow-xl transition-all duration-300"
          style={{
            transform: `scale(${yesScale})`,
            animation: "pulse-glow 2s infinite",
          }}
        >
          Yes ! ❤️
        </Button>

        {!noPos && (
          <Button
            variant="destructive"
            size="lg"
            className="rounded-full text-xl transition-all duration-300"
            style={{ transform: `scale(${noScale})` }}
            onMouseEnter={moveNo}
            onClick={moveNo}
          >
            No ❌
          </Button>
        )}
      </div>

      {noPos && (
        <Button
          variant="destructive"
          className="fixed rounded-full transition-all duration-200 z-50"
          style={{
            left: noPos.x,
            top: noPos.y,
            transform: `scale(${noScale})`,
          }}
          onMouseEnter={moveNo}
          onClick={moveNo}
        >
          No ❌
        </Button>
      )}
    </div>
  );
};

// Step 3: Celebration
const Celebration = ({ name, image }: { name: string; image: string }) => {
  useEffect(() => {
    const end = Date.now() + 4000;
    const colors = ["#e91e63", "#ff4081", "#f48fb1", "#ff80ab", "#ffd54f"];
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  }, []);

  return (
    <div className="relative z-10 flex flex-col items-center gap-8 p-6 min-h-screen justify-center animate-fade-in">
      <h1 className="font-script text-5xl md:text-7xl text-primary text-center" style={{ animation: "wiggle 1s ease-in-out infinite" }}>
        Yay ! 🎉 Dudu is happy
      </h1>
      <p className="text-2xl md:text-3xl text-foreground font-semibold text-center">
        {name} said <span className="text-primary">YES !</span> 💕
      </p>

      <div className="flex items-center gap-2 md:gap-6">
        <div className="rounded-3xl overflow-hidden border-4 border-primary/40 shadow-2xl w-40 h-40 md:w-56 md:h-56">
          <img src={PRESET_IMAGE} alt="Me" className="w-full h-full object-cover" />
        </div>
        <span 
          className="text-5xl md:text-7xl" 
          style={{ 
            animation: "pulse-glow 2s infinite, wiggle 1s ease-in-out infinite",
            display: "inline-block",
            backgroundColor: "transparent"  // Remove any background
          }}
        >
          ❤️
        </span>
        {image ? (
          <div className="rounded-3xl overflow-hidden border-4 border-primary/40 shadow-2xl w-40 h-40 md:w-56 md:h-56">
            <img src={image} alt="My Valentine" className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="rounded-3xl border-4 border-primary/40 shadow-2xl w-40 h-40 md:w-56 md:h-56 bg-secondary flex items-center justify-center">
            <span className="text-5xl">💕</span>
          </div>
        )}
      </div>

      <p className="font-script text-3xl md:text-4xl text-primary/80 mt-4">
        See you in 14th February for the Valentine's Day! 💝
      </p>
    </div>
  );
};

const Index = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <FloatingHearts />
      {step === 1 && (
        <div className="min-h-screen flex items-center justify-center">
          <NameEntry
            onContinue={(n, img) => {
              setName(n);
              setImage(img);
              setStep(2);
            }}
          />
        </div>
      )}
      {step === 2 && (
        <TheQuestion name={name} image={image} onYes={() => setStep(3)} />
      )}
      {step === 3 && <Celebration name={name} image={image} />}
    </div>
  );
};

export default Index;
