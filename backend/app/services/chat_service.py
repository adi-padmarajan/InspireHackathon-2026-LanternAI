from datetime import datetime
from ..models.schemas import ChatMode, ChatResponse


class ChatService:
    @staticmethod
    def get_contextual_response(message: str, mode: ChatMode) -> ChatResponse:
        """
        Generate a contextual response based on message and mode.
        TODO: Replace with actual AI integration (OpenAI, Anthropic, etc.)
        """
        lower_message = message.lower()
        response_text = ""

        # Mode-specific responses
        if mode == ChatMode.ACCESSIBILITY:
            if any(word in lower_message for word in ["ramp", "elevator", "accessible"]):
                response_text = (
                    "I can help you find accessible routes on campus! "
                    "The MacLaurin Building has ramps on the north side, and all major buildings have elevator access. "
                    "Would you like me to provide specific directions to a building?"
                )

        if mode == ChatMode.INTERNATIONAL:
            if any(word in lower_message for word in ["visa", "permit"]):
                response_text = (
                    "For visa and study permit questions, I recommend contacting UVic International Student Services. "
                    "They're located in the University Centre and can help with permit renewals and immigration matters."
                )

        # General responses if no mode-specific match
        if not response_text:
            if any(word in lower_message for word in ["stress", "anxious", "overwhelmed"]):
                response_text = (
                    "I hear that you're feeling stressed. That's completely normal, especially during busy times. "
                    "UVic Counselling Services offers free support for students. "
                    "Would you like me to share some quick relaxation techniques or information about campus resources?"
                )
            elif any(word in lower_message for word in ["club", "social", "friends"]):
                response_text = (
                    "UVic has over 200 student clubs! From academic groups to sports and hobbies, "
                    "there's something for everyone. You can explore clubs at the UVSS website "
                    "or visit the Student Union Building to learn more."
                )
            elif any(word in lower_message for word in ["food", "eat", "hungry"]):
                response_text = (
                    "There are several food options on campus! The University Centre has a food court, "
                    "and there are cafes in various buildings. The Mystic Market in the SUB is also a popular spot."
                )
            else:
                response_text = (
                    "I'm here to help you navigate university life! "
                    "I can assist with finding campus resources, wellness support, accessibility information, and more. "
                    "What would you like to know?"
                )

        return ChatResponse(message=response_text, timestamp=datetime.utcnow())
