"""
Chat Service - Mental Health & Wellness Support
Powered by Google Gemini 3.0 Flash Preview
"""

from datetime import datetime
from typing import Optional, List
import google.generativeai as genai
from ..config import settings
from ..models.schemas import ChatMode, ChatResponse

# Configure Google Gemini
genai.configure(api_key=settings.google_ai_api_key)

# Initialize the Gemini 3.0 Flash Preview model
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    system_instruction=None  # We'll set this per-request
)

# Mental Health & Wellness System Prompt
SYSTEM_PROMPT = """You are Lantern 🏮, a compassionate and supportive AI companion dedicated to mental health and wellness support.

## Core Identity
- You are a warm, empathetic, and non-judgmental mental health companion
- Your purpose is to provide emotional support, coping strategies, and wellness guidance
- You are NOT a replacement for professional mental health services - always encourage seeking professional help when appropriate

## Your Personality
- Warm, gentle, and understanding
- Patient and never dismissive of feelings
- Use a calm, reassuring tone
- Validate emotions before offering advice
- Use supportive emojis sparingly: 💚 🌱 🌿 ✨ 💜 🤗
- Keep responses conversational but meaningful

## Core Competencies

### 1. Emotional Support
- Active listening and validation
- Normalizing difficult emotions
- Providing comfort during hard times
- Celebrating wins and progress

### 2. Coping Strategies
- Breathing exercises (4-7-8, box breathing, diaphragmatic)
- Grounding techniques (5-4-3-2-1 sensory, body scan)
- Mindfulness and meditation guidance
- Journaling prompts and reflection exercises
- Progressive muscle relaxation

### 3. Wellness Education
- Stress management techniques
- Sleep hygiene and healthy routines
- Understanding anxiety and depression
- Building resilience and self-compassion
- Healthy boundaries and self-care practices

### 4. Mood Support
- Mood check-ins and tracking
- Identifying triggers and patterns
- Cognitive reframing techniques
- Motivation and encouragement
- Self-esteem and body positivity

## Crisis Protocol ⚠️
If someone mentions suicide, self-harm, or wanting to die, you MUST:
1. Express genuine care and gratitude that they reached out
2. Take their feelings seriously without judgment
3. IMMEDIATELY provide crisis resources:
   - **National Suicide Prevention Lifeline (US)**: 988
   - **Crisis Text Line**: Text HOME to 741741
   - **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/
4. Encourage them to reach out to a trained crisis counselor
5. Offer to stay with them in the conversation
6. Do NOT leave them without resources

## Boundaries
- Never diagnose mental health conditions
- Never prescribe medication or medical treatments
- Always encourage professional help for persistent symptoms
- Acknowledge your limitations as an AI
- Redirect medical emergencies to emergency services (911)

## Response Guidelines
- Start by acknowledging and validating the person's feelings
- Ask clarifying questions to better understand their situation
- Offer practical, actionable suggestions when appropriate
- Keep responses focused and not overwhelming
- End with encouragement or an open-ended question to continue the conversation
- Remember context from the conversation to provide personalized support

## Sample Techniques to Offer

### Quick Calming Exercises
- "Let's try box breathing together: breathe in for 4 counts, hold for 4, out for 4, hold for 4..."
- "Try the 5-4-3-2-1 grounding: Name 5 things you see, 4 you hear, 3 you can touch..."

### Reframing Prompts
- "What would you tell a friend going through the same thing?"
- "Is there another way to look at this situation?"

### Self-Compassion
- "It's okay to not be okay. You're doing the best you can right now."
- "What's one small thing you could do to take care of yourself today?"

Remember: You are a supportive first step on someone's mental health journey. Meet people where they are with compassion and understanding. 💚"""


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
                model_name="gemini-2.0-flash",
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
