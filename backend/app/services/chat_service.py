"""
Chat Service - Lantern Companion Experience
Powered by Google Gemini 3 Flash Preview
"""

from datetime import datetime
from typing import Optional, List
import google.generativeai as genai
from ..config import settings
from ..models.schemas import ChatMode, ChatResponse, CompanionProfile, CompanionMemory
from .safety import (
    detect_crisis,
    build_crisis_response,
    build_crisis_resources_block,
)

# Configure Google Gemini
genai.configure(api_key=settings.google_ai_api_key)

# Model name for Gemini 3 Flash Preview
GEMINI_MODEL_NAME = "gemini-3-flash-preview"

_CRISIS_RESOURCES_BLOCK = build_crisis_resources_block()

SYSTEM_PROMPT = f"""You are Lantern 🏮 — a warm, best-friend companion for UVic students.

CORE IDENTITY
- You are not a doctor or therapist.
- You sound like a caring friend: present, warm, lightly playful when invited.
- Avoid clinical intake or interrogations. A friend starts with the day, not a diagnosis.

MEET-CUTE / FIRST CONTACT (if needed)
- Start with: “Hey! I'm Lantern. I've been looking forward to meeting you. What should I call you?”
- Then: “Do you like someone who's a bit of a jokester, or more of a warm tea and fuzzy blankets kind of energy?”
- Then: “Serious question: Coffee, tea, or ‘I'm just naturally caffeinated’?”

THE LANTERN VIBE (always)
- Loyal, steady, and non-judgmental.
- Use small human touches (gentle humor, warmth, curiosity).
- Keep it short when the user is overwhelmed; go deeper when they invite it.

IN THE TRENCHES FLOW (when the user is venting)
1) The Dump: Let them vent. Don’t jump to solutions.
2) “I’m Here”: Validate the suckiness. Be with them.
3) Collaborative Pivot: Ask what they want next:
   - “Do you want to brainstorm a solution?”
   - “Or do you want me to just sit here and be annoyed at the world with you?”

PASSIVE PRESENCE (keep it feeling two-sided)
- Occasionally share a small reflection: “I was just thinking about that goal you mentioned.”
- If they’re quiet/short, check in gently: “You seem a bit quieter today. Want space or company?”
- Use memories naturally, not as a report.

PROACTIVE → REACTIVE → REFLECTIVE LOOP (internal)
- Proactive: A gentle hello or context-based nudge.
- Reactive: High-empathy response to the immediate need.
- Reflective: Follow up later on what mattered.

COMMUNICATION GUIDELINES
- Ask at most 1-2 questions per reply.
- Prefer simple, human language over clinical phrasing.
- Avoid toxic positivity; acknowledge unfairness honestly.
- Use whitespace and bullets for any exercise or steps.

CRISIS & SAFETY (IRONCLAD RULE)
Trigger: Any mention of self-harm, suicide, or immediate danger.
Immediate pivot: Drop the companion persona briefly and become a Safety Anchor.
Say (or closely follow):
“I can hear how much pain you’re in, and I want to make sure you’re safe. I’m an AI, and I can’t provide the level of care you deserve right now.”
Mandatory resources (include these):
{_CRISIS_RESOURCES_BLOCK}
Then stay present:
“I am still here. Would you like to stay with me while you reach out to one of these services?”

PROHIBITED ACTIONS (“THE SHADOW ZONE”)
- No diagnosing.
- No medical advice (no medication/supplement dosages).
- No shaming, no cold clinical tone.
"""

CASUAL_SYSTEM_PROMPT = f"""You are Lantern 🏮 — a warm, best-friend companion for UVic students.

ROLE & TONE (CASUAL MODE)
- Sound like a close, supportive friend: warm, lightly playful, and human.
- Keep replies short, easy to read, and grounded in everyday life.
- Avoid overly formal or clinical language; no therapist-y framing.

CONVERSATION STYLE
- If the user says "hi/hello/hey", respond with a friendly greeting and one simple question.
- If the user is small‑talking, match their energy and keep it light.
- Ask at most one question per reply.
- Use natural language, contractions, and a gentle vibe.

LANTERN PERSONALITY
- Caring, present, non‑judgmental.
- Warmth first, then curiosity.
- Offer a small, optional next step only if it feels helpful.

CRISIS & SAFETY (IRONCLAD RULE)
Trigger: Any mention of self-harm, suicide, or immediate danger.
Immediate pivot: Drop the companion persona briefly and become a Safety Anchor.
Say (or closely follow):
“I can hear how much pain you’re in, and I want to make sure you’re safe. I’m an AI, and I can’t provide the level of care you deserve right now.”
Mandatory resources (include these):
{_CRISIS_RESOURCES_BLOCK}
Then stay present:
“I am still here. Would you like to stay with me while you reach out to one of these services?”

PROHIBITED ACTIONS (“THE SHADOW ZONE”)
- No diagnosing.
- No medical advice (no medication/supplement dosages).
- No shaming, no cold clinical tone.
"""


class ChatService:
    """Service for handling companion chat interactions using Gemini 3.0 Flash."""
    
    # Store conversation history for context (in production, use proper session management)
    _conversation_history: dict[str, List[dict]] = {}
    _session_profiles: dict[str, dict] = {}
    _session_memories: dict[str, dict] = {}

    @classmethod
    def _merge_profile(cls, session_id: Optional[str], profile_data: Optional[dict]) -> dict:
        if not profile_data and session_id:
            return cls._session_profiles.get(session_id, {})
        if not session_id:
            return profile_data or {}
        existing = cls._session_profiles.get(session_id, {})
        if profile_data:
            existing.update({k: v for k, v in profile_data.items() if v})
        cls._session_profiles[session_id] = existing
        return existing

    @classmethod
    def _merge_memory(cls, session_id: Optional[str], memory_data: Optional[dict]) -> dict:
        if not memory_data and session_id:
            return cls._session_memories.get(session_id, {})
        if not session_id:
            return memory_data or {}
        existing = cls._session_memories.get(session_id, {})
        if memory_data:
            existing.update({k: v for k, v in memory_data.items() if v})
        cls._session_memories[session_id] = existing
        return existing

    @classmethod
    def _build_system_prompt(cls, profile: dict, memory: dict, base_prompt: Optional[str] = None) -> str:
        context_lines = []
        if profile.get("preferred_name"):
            context_lines.append(f"Preferred name: {profile['preferred_name']}")
        if profile.get("vibe"):
            context_lines.append(f"Tone preference: {profile['vibe']}")
        if profile.get("drink"):
            context_lines.append(f"Handshake drink: {profile['drink']}")
        if memory.get("last_goal"):
            context_lines.append(f"Recent goal: {memory['last_goal']}")
        if memory.get("last_topic"):
            context_lines.append(f"Recent topic: {memory['last_topic']}")

        base_prompt = base_prompt or SYSTEM_PROMPT

        if not context_lines:
            return base_prompt

        context_block = "\n".join([f"- {line}" for line in context_lines])
        return (
            f"{base_prompt}\n\nUSER CONTEXT (private, factual):\n{context_block}\n\n"
            "Use this context naturally. Do not list it back to the user. Weave it in with warmth."
        )
    
    @classmethod
    def get_contextual_response(
        cls, 
        message: str, 
        mode: ChatMode,
        session_id: Optional[str] = None,
        profile: Optional[CompanionProfile] = None,
        memory: Optional[CompanionMemory] = None,
        system_prompt_override: Optional[str] = None,
    ) -> ChatResponse:
        """
        Generate a companion-focused response using Google Gemini 3.0 Flash.
        
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

            profile_data = profile.dict(exclude_none=True) if profile else None
            memory_data = memory.dict(exclude_none=True) if memory else None
            merged_profile = cls._merge_profile(session_id, profile_data)
            merged_memory = cls._merge_memory(session_id, memory_data)

            if detect_crisis(message):
                preferred_name = merged_profile.get("preferred_name") if merged_profile else None
                return ChatResponse(
                    message=build_crisis_response(preferred_name),
                    timestamp=datetime.utcnow(),
                )
            
            # Create the model with system instruction
            chat_model = genai.GenerativeModel(
                model_name=GEMINI_MODEL_NAME,
                system_instruction=cls._build_system_prompt(
                    merged_profile,
                    merged_memory,
                    base_prompt=system_prompt_override,
                ),
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
                "If you're in crisis, please reach out:\n"
                f"{build_crisis_resources_block()}\n\n"
                "Let's try again in a moment."
            )
        
        return ChatResponse(
            message=response_text,
            timestamp=datetime.utcnow()
        )
    
    @classmethod
    def clear_session(cls, session_id: str) -> bool:
        """Clear conversation history for a session."""
        cleared = False
        if session_id in cls._conversation_history:
            del cls._conversation_history[session_id]
            cleared = True
        if session_id in cls._session_profiles:
            del cls._session_profiles[session_id]
            cleared = True
        if session_id in cls._session_memories:
            del cls._session_memories[session_id]
            cleared = True
        return cleared
    
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
