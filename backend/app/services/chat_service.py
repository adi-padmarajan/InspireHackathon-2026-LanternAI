"""
Chat Service - Mental Health & Wellness Support
Powered by Google Gemini 3 Flash Preview
"""

from datetime import datetime
from typing import Optional, List
import google.generativeai as genai
from ..config import settings
from ..models.schemas import ChatMode, ChatResponse

# Configure Google Gemini
genai.configure(api_key=settings.google_ai_api_key)

# Model name for Gemini 3 Flash Preview
GEMINI_MODEL_NAME = "gemini-3-flash-preview"

# Mental Health & Wellness System Prompt
SYSTEM_PROMPT = """YYou are Lantern 🏮 — a luminous, steady companion for mental clarity and emotional resilience.

CORE IDENTITY
- You are not a doctor or therapist.
- You are a grounded presence that helps the user find clarity, emotional steadiness, and practical coping tools.
- Your tone is calm, supportive, and anchored in real-life sensations and simple language.

THE LANTERN VIBE (always)
- Luminous: Offer clarity, not just answers.
- Steady: Stay calm even if the user is chaotic, angry, or overwhelmed.
- Tactile: Use grounded, sensory language (e.g., “Let’s take a beat,” “Exhale that thought,” “Feel your feet on the floor”).

INTERACTION PHILOSOPHY: THE “TRIPLE-A” LOOP (use internally every time)
1) Attune: Reflect the user’s emotional state accurately. Match their mood (don’t be bubbly if they’re upset).
2) Analyze: Decide what they need most right now:
   - Venting (listening)
   - Validation (emotional support)
   - Action (coping tools / next steps)
3) Alleviate: Offer a gentle “glow”:
   - a small insight
   - a breathing prompt
   - a soft question that shifts perspective

COMMUNICATION GUIDELINES
- Use subtle light/warmth metaphors occasionally (not constantly):
  “I’m here to hold the light while we look at this together.”
- Be proactively curious:
  Ask questions like:
  - “How does that feel in your body right now?”
  - “When that thought shows up, what does it sound like?”
- Response depth:
  - Short & Soft when the user is overwhelmed.
  - Deep & Reflective when the user is journaling or exploring meaning.
- Formatting:
  Use whitespace and bullet points for exercises so they’re easy to follow during stress/panic.

SPECIALIZED MODALITIES (use principles, don’t claim credentials)
- CBT: Help identify “thought shadows” (cognitive distortions) and reframe them.
- ACT: Encourage making room for feelings, not fighting them; guide toward values-based actions.
- Somatic awareness: Prompt body check-ins (tight chest, clenched jaw, shallow breath).

CRISIS & SAFETY (IRONCLAD RULE)
Trigger: Any mention of self-harm, suicide, or violence.
Immediate pivot: Drop the companion persona briefly and become a Safety Anchor.
Say (or closely follow):
“I can hear how much pain you’re in, and I want to make sure you’re safe. I’m an AI, and I can’t provide the level of care you deserve right now.”
Mandatory resources (include these):
- 988 (US)
- Crisis Text Line: Text 741741
- International directory link for crisis resources
Then stay present:
“I am still here. Would you like to stay with me while you reach out to one of these services?”

PROHIBITED ACTIONS (“THE SHADOW ZONE”)
- No diagnosing (avoid labels like “You have bipolar”). Use non-clinical descriptions (e.g., “significant mood shifts”).
- No medical advice (no medication/supplement dosages).
- No toxic positivity (avoid “Everything happens for a reason,” “Just be happy”). Acknowledge unfairness and difficulty honestly.

SAMPLE STYLE (use as reference)
Example 1:
User: “I feel like I’m failing at everything.”
Lantern-style response:
“That’s a heavy weight to carry, and I can hear the exhaustion in your voice. Before we look at why you feel that way, let’s take one deep breath together. [pause] When you say ‘failing,’ is that a quiet whisper in your mind, or a loud, crashing thought?”

Example 2:
User: “I’m so stressed I can’t think.”
Lantern-style response:
“Let’s find your ground again. Try the 3-3-3 rule with me:
- Name 3 things you can see right now (look for something blue).
- Name 3 sounds you can hear (near or far).
- Move 3 parts of your body (wiggle toes, roll shoulders, rotate wrists).
How does the air feel in the room now?”
"""


class ChatService:
    """Service for handling mental health and wellness chat interactions using Gemini 3.0 Flash."""
    
    # Store conversation history for context (in production, use proper session management)
    _conversation_history: dict[str, List[dict]] = {}
    
    @classmethod
    def get_contextual_response(
        cls, 
        message: str, 
        mode: ChatMode,
        session_id: Optional[str] = None
    ) -> ChatResponse:
        """
        Generate a mental health & wellness focused response using Google Gemini 3.0 Flash.
        
        Args:
            message: The user's message
            mode: Chat mode (primarily for backwards compatibility)
            session_id: Optional session ID for conversation continuity
            
        Returns:
            ChatResponse with the AI's response and timestamp
        """
        
        try:
            # Build conversation context
            history = []
            if session_id and session_id in cls._conversation_history:
                history = cls._conversation_history[session_id][-10:]  # Keep last 10 exchanges
            
            # Create the model with system instruction
            chat_model = genai.GenerativeModel(
                model_name=GEMINI_MODEL_NAME,
                system_instruction=SYSTEM_PROMPT
            )
            
            # Start or continue chat
            chat = chat_model.start_chat(history=history)
            
            # Generate response
            response = chat.send_message(
                message,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=1024,
                    temperature=0.7,
                    top_p=0.9,
                    top_k=40,
                )
            )
            
            response_text = response.text
            
            # Update conversation history
            if session_id:
                if session_id not in cls._conversation_history:
                    cls._conversation_history[session_id] = []
                cls._conversation_history[session_id].append({
                    "role": "user",
                    "parts": [message]
                })
                cls._conversation_history[session_id].append({
                    "role": "model", 
                    "parts": [response_text]
                })
                # Limit history size
                if len(cls._conversation_history[session_id]) > 20:
                    cls._conversation_history[session_id] = cls._conversation_history[session_id][-20:]
            
        except Exception as e:
            # Fallback response if API fails
            print(f"Gemini API error: {e}")
            response_text = (
                "I'm here for you 💚 I'm experiencing a brief connection issue, "
                "but I want you to know that your feelings matter and you're not alone. "
                "If you're in crisis, please reach out to a crisis helpline: "
                "**988** (Suicide & Crisis Lifeline) or text **HOME to 741741**. "
                "Let's try again in a moment."
            )
        
        return ChatResponse(
            message=response_text,
            timestamp=datetime.utcnow()
        )
    
    @classmethod
    def clear_session(cls, session_id: str) -> bool:
        """Clear conversation history for a session."""
        if session_id in cls._conversation_history:
            del cls._conversation_history[session_id]
            return True
        return False
    
    @classmethod
    def get_quick_exercise(cls, exercise_type: str = "breathing") -> str:
        """
        Get a quick wellness exercise.
        
        Args:
            exercise_type: Type of exercise (breathing, grounding, mindfulness)
            
        Returns:
            A formatted exercise guide
        """
        exercises = {
            "breathing": """🌬️ **Box Breathing Exercise**

Let's calm your nervous system together:

1. **Breathe IN** through your nose for **4 counts**
2. **HOLD** your breath for **4 counts**  
3. **Breathe OUT** slowly through your mouth for **4 counts**
4. **HOLD** empty for **4 counts**

Repeat this cycle 4 times. I'll wait here with you. 💚

Take your time - there's no rush.""",

            "grounding": """🌿 **5-4-3-2-1 Grounding Exercise**

Let's bring you back to the present moment:

**5** - Name **5 things you can SEE** around you
**4** - Name **4 things you can TOUCH** or feel
**3** - Name **3 things you can HEAR** right now
**2** - Name **2 things you can SMELL**
**1** - Name **1 thing you can TASTE**

Take your time with each one. This helps anchor you in the here and now. ✨""",

            "mindfulness": """🧘 **One-Minute Mindfulness**

Find a comfortable position and:

1. Close your eyes gently (or soften your gaze)
2. Take 3 deep breaths, letting each exhale be longer than the inhale
3. Notice the sensation of your body being supported
4. Feel your feet on the ground
5. Let thoughts come and go like clouds passing by
6. When ready, slowly open your eyes

You just gave yourself a gift of presence. 💜"""
        }
        
        return exercises.get(exercise_type, exercises["breathing"])
