import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Loader2, RefreshCw, Accessibility, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const suggestedPrompts = [
  "I'm feeling overwhelmed with coursework",
  "How do I find accessible routes to the library?",
  "I want to join a club but I'm anxious",
  "What mental health resources are available?",
  "I'm an international student and confused about office hours",
  "The dark winter days are affecting my mood",
];

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I'm Lantern, your UVic companion. 🌿✨\n\nI'm here to help you navigate university life—whether you're looking for accessible routes, dealing with stress, exploring clubs, or adjusting to a new culture.\n\nHow can I support you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"default" | "accessibility" | "international">("default");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (in production, this would call your AI backend)
    setTimeout(() => {
      const responses = getContextualResponse(userMessage.content, mode);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: responses,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: "Hello! I'm Lantern, your UVic companion. 🌿✨\n\nI'm here to help you navigate university life—whether you're looking for accessible routes, dealing with stress, exploring clubs, or adjusting to a new culture.\n\nHow can I support you today?",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-20 pb-8">
        <div className="container mx-auto px-4 h-full flex flex-col max-w-4xl">
          {/* Mode Toggles */}
          <div className="flex items-center justify-center gap-2 mb-4 py-4">
            <Button
              variant={mode === "accessibility" ? "lantern" : "outline"}
              size="sm"
              onClick={() => setMode(mode === "accessibility" ? "default" : "accessibility")}
              className="gap-2"
            >
              <Accessibility className="h-4 w-4" />
              Accessibility Mode
            </Button>
            <Button
              variant={mode === "international" ? "lantern" : "outline"}
              size="sm"
              onClick={() => setMode(mode === "international" ? "default" : "international")}
              className="gap-2"
            >
              <Globe className="h-4 w-4" />
              International Mode
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNewChat}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              New Chat
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto forest-card p-4 md:p-6 mb-4 min-h-[400px] max-h-[60vh]">
            <div className="space-y-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-accent text-accent-foreground rounded-bl-md"
                    }`}
                  >
                    <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                      {message.content}
                    </p>
                    <p className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-accent text-accent-foreground rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Lantern is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Suggested Prompts */}
          {messages.length <= 1 && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Try asking about:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-sm px-3 py-2 rounded-full bg-accent hover:bg-accent/80 text-accent-foreground transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="forest-card p-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type your message..."
                className="flex-1 bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                variant="lantern"
                size="lg"
                className="px-6"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Lantern is here to support you. For immediate crisis support, please contact{" "}
              <a href="tel:1-800-784-2433" className="text-primary hover:underline">
                1-800-784-2433
              </a>{" "}
              (Crisis Line BC).
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

// Helper function to generate contextual responses
function getContextualResponse(input: string, mode: string): string {
  const lowercaseInput = input.toLowerCase();
  
  if (lowercaseInput.includes("overwhelmed") || lowercaseInput.includes("stress")) {
    return "I hear you—feeling overwhelmed is really common, especially during busy times. 💚\n\nHere are some immediate things that might help:\n\n1. **Take a 5-minute breathing break** - Try the 4-7-8 technique: breathe in for 4, hold for 7, out for 8\n\n2. **Break tasks into smaller pieces** - What's the ONE most important thing you need to do today?\n\n3. **Consider reaching out** - UVic Counselling Services offers same-day crisis appointments: 250-721-8341\n\nWould you like me to help you prioritize your tasks, or would you prefer to talk about what's specifically causing the stress?";
  }
  
  if (lowercaseInput.includes("accessible") || lowercaseInput.includes("wheelchair") || lowercaseInput.includes("elevator")) {
    return "I'm happy to help with accessible routes! 🦽\n\nHere's what I know about accessibility at UVic:\n\n**Key Elevator Locations:**\n- Clearihue Building: East entrance, ground floor\n- MacLaurin Building: Main entrance, south side\n- Engineering Lab Wing: Near the main doors\n\n**Accessible Routes:**\n- Ring Road provides the flattest route around campus\n- The bus loop area is step-free to most nearby buildings\n\n**Resources:**\n- Centre for Accessible Learning (CAL): 250-472-4947\n- Accessibility Map: uvic.ca/accessibility\n\nWhich building are you trying to reach? I can give you specific route suggestions!";
  }
  
  if (lowercaseInput.includes("club") || lowercaseInput.includes("anxious") || lowercaseInput.includes("social")) {
    return "I totally understand—walking into a room of strangers can feel really intimidating. 🌱\n\nHere's a gentle approach to club exploration:\n\n**Low-Pressure First Steps:**\n1. Browse clubs online first at uvss.ca/clubs - no commitment required\n2. Many clubs have Discord/social media you can lurk in before attending\n3. Look for \"beginner-friendly\" or \"casual\" clubs\n\n**Anxiety-Friendly Club Types:**\n- Board game clubs (structured activity, less small talk)\n- Outdoor clubs (walking/hiking, natural conversation)\n- Craft/hobby clubs (focus on doing, not just talking)\n\nWould you like me to suggest some specific clubs based on your interests? There's no pressure to join anything—just exploring is totally valid!";
  }
  
  if (lowercaseInput.includes("international") || lowercaseInput.includes("office hours") || lowercaseInput.includes("confused")) {
    return "Welcome! Adjusting to a new academic culture is genuinely challenging. 🌍\n\n**About Office Hours:**\nOffice hours are dedicated times when professors are available in their office specifically to meet with students. It's not just for struggling students—going shows initiative!\n\n**How to Use Them:**\n1. Check the syllabus for times/location\n2. You can just show up—no appointment needed\n3. It's okay to say \"I wanted to clarify...\" or \"I'm not sure I understand...\"\n\n**International Student Resources:**\n- International Student Services: 250-721-6361\n- Global Community drop-in (free coffee and conversation!)\n- Peer mentorship programs\n\nWhat specific aspect of Canadian academic culture would you like me to explain more?";
  }
  
  if (lowercaseInput.includes("dark") || lowercaseInput.includes("winter") || lowercaseInput.includes("sad") || lowercaseInput.includes("seasonal")) {
    return "Victoria's dark winters can be really tough on mood and energy. 🌧️\n\nYou're definitely not alone in feeling this way—seasonal depression affects many students here.\n\n**Practical Tips:**\n1. **Light therapy** - UVic Health Services has info on light therapy lamps\n2. **Vitamin D** - Many people in Victoria are deficient (talk to a doctor)\n3. **Movement** - Even 10 minutes outside during daylight helps\n4. **Social connection** - The isolation can compound the darkness\n\n**UVic Resources:**\n- Counselling: 250-721-8341 (mention seasonal symptoms)\n- Student Wellness Centre\n- Peer Support (in the SUB)\n\nWould you like some suggestions for indoor activities that help during the dark months?";
  }
  
  if (lowercaseInput.includes("mental health") || lowercaseInput.includes("resource")) {
    return "I'm glad you're looking for support—that takes courage. 💚\n\n**Immediate Support:**\n- Crisis Line BC: 1-800-784-2433 (24/7)\n- UVic Counselling: 250-721-8341\n- Student Wellness Centre (SUB)\n\n**Ongoing Support:**\n- Individual counselling (free for students)\n- Group therapy programs\n- Peer support network\n- SupportConnect (24/7 online/phone)\n\n**Self-Help:**\n- Wellness workshops\n- Meditation room (Interfaith Chapel)\n- Therapy dogs (check @uvicpaws on Instagram)\n\nWould you like me to explain how to access any of these services? I can walk you through what to expect.";
  }
  
  return "Thank you for sharing that with me. 🌿\n\nI'm here to help you with:\n- **Campus navigation** (including accessible routes)\n- **Mental health and wellness** resources\n- **Social connections** and club exploration\n- **Academic support** and understanding norms\n- **International student** guidance\n\nCould you tell me a bit more about what you're looking for? I want to make sure I give you the most helpful response.";
}

export default ChatPage;
