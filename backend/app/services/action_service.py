from typing import Dict, Any, List, Optional

class ActionService:
    """Service for generating actionable scripts and templates."""
    
    TEMPLATES = {
        "extension_request": {
            "gentle": {
                "title": "Extension Request Email (Gentle)",
                "script": """Subject: Request for Extension - {course}

Dear Professor,

I hope this email finds you well. I'm writing to respectfully request a brief extension for the upcoming assignment due {deadline}.

I've been dealing with some challenges recently that have affected my ability to complete the work to my usual standard. I want to ensure I can submit quality work that reflects my understanding of the material.

Would it be possible to have an additional [2-3 days] to complete this assignment? I'm happy to discuss this further during office hours if you'd prefer.

Thank you for your understanding and consideration.

Best regards,
[Your name]
[Student ID]""",
                "checklist": [
                    "Replace {course} with your course code",
                    "Replace {deadline} with the actual deadline",
                    "Specify how many extra days you need",
                    "Add your name and student ID",
                    "Send from your UVic email",
                ],
            },
            "direct": {
                "title": "Extension Request Email (Direct)",
                "script": """Subject: Extension Request - {course} Assignment

Professor [Name],

I'm requesting a [X]-day extension for the {course} assignment due {deadline}.

Due to [brief reason], I need additional time to complete this work properly.

Please let me know if this is possible.

Thank you,
[Your name]
[Student ID]""",
                "checklist": [
                    "Fill in professor's name",
                    "Specify course and deadline",
                    "Keep reason brief but honest",
                    "Send promptly before deadline",
                ],
            },
            "warm": {
                "title": "Extension Request Email (Warm)",
                "script": """Subject: Checking in + Extension Request for {course}

Hi Professor [Name],

I've really been enjoying {course} this semester, and I wanted to reach out about the assignment due {deadline}.

I've run into some unexpected challenges this week and I'm worried about being able to give this assignment the attention it deserves. Would you be open to granting a short extension?

I completely understand if that's not possible, and I appreciate you taking the time to read this.

Warmly,
[Your name]""",
                "checklist": [
                    "Personalize with professor's name",
                    "Be genuine about your interest in the course",
                    "Specify what extension length you need",
                    "Follow up if no response in 48 hours",
                ],
            },
        },
        "text_friend": {
            "gentle": {
                "title": "Reaching Out to a Friend (Gentle)",
                "script": """Hey [name], I've been thinking about you. No pressure to respond right now, but I just wanted you to know I'm here if you ever want to chat or hang out. 💙""",
                "checklist": [
                    "Send when you're in a calm headspace",
                    "Don't expect an immediate response",
                    "Keep it low-pressure",
                ],
            },
            "direct": {
                "title": "Reaching Out to a Friend (Direct)",
                "script": """Hey! Been a while - want to grab coffee this week? I'm free [days]. Let me know!""",
                "checklist": [
                    "Suggest specific times",
                    "Pick a convenient location",
                    "Follow up once if no response",
                ],
            },
            "warm": {
                "title": "Reaching Out to a Friend (Warm)",
                "script": """Hey [name]! I was just [thinking about something that reminded you of them] and it made me smile. How have you been? Would love to catch up when you have time. 🌟""",
                "checklist": [
                    "Include something personal/specific",
                    "Show genuine interest",
                    "Leave the timing open",
                ],
            },
        },
        "self_advocacy": {
            "gentle": {
                "title": "Self-Advocacy Script (Gentle)",
                "script": """I appreciate you taking the time to discuss this with me. I wanted to share that [describe situation/need]. 

I've found that [what helps you] really makes a difference for me, and I was wondering if we could explore some options together?

I'm open to suggestions and want to find something that works for everyone.""",
                "checklist": [
                    "Practice saying it out loud first",
                    "Prepare for questions",
                    "Know your boundaries",
                    "It's okay to ask for time to think",
                ],
            },
            "direct": {
                "title": "Self-Advocacy Script (Direct)",
                "script": """I need to discuss [topic]. 

My situation is [brief explanation]. What I need is [specific request].

Can we make this work?""",
                "checklist": [
                    "Be clear about your needs",
                    "Stay calm and confident",
                    "Have backup options ready",
                ],
            },
            "warm": {
                "title": "Self-Advocacy Script (Warm)",
                "script": """Thank you for meeting with me - I really appreciate it.

I've been reflecting on [situation] and I realized I need to advocate for myself a bit more. What would really help me is [specific need].

I know you're busy, and I'm grateful for any support you can offer. Even small adjustments can make a big difference for me.""",
                "checklist": [
                    "Express genuine gratitude",
                    "Be specific about your needs",
                    "Acknowledge their perspective",
                    "Follow up with thanks afterward",
                ],
            },
        },
    }
    
    SUGGESTED_NEXT_STEPS = {
        "extension_request": [
            "Set a reminder to follow up if no response in 48 hours",
            "Start working on what you can now",
            "Check if TAs can help with clarifying questions",
            "Visit the Centre for Accessible Learning if needed",
        ],
        "text_friend": [
            "Put your phone down after sending - don't watch for responses",
            "Plan a small activity you could do together",
            "Remember: reaching out is brave, regardless of response",
        ],
        "self_advocacy": [
            "Write down key points before the conversation",
            "Practice with a friend or mirror",
            "Know your walk-away point",
            "Celebrate yourself for advocating!",
        ],
    }
    
    def generate_script(
        self,
        scenario: str,
        tone: str = "gentle",
        context: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Generate an action script based on scenario and tone."""
        
        if scenario not in self.TEMPLATES:
            return {
                "title": "Script Not Found",
                "script": "Sorry, we don't have a template for that scenario yet.",
                "checklist": [],
                "suggested_next_steps": [],
            }
        
        scenario_templates = self.TEMPLATES[scenario]
        
        if tone not in scenario_templates:
            tone = "gentle"  # fallback
        
        template = scenario_templates[tone]
        script = template["script"]
        
        # Replace context variables
        if context:
            for key, value in context.items():
                script = script.replace("{" + key + "}", str(value))
        
        return {
            "title": template["title"],
            "script": script,
            "checklist": template["checklist"],
            "suggested_next_steps": self.SUGGESTED_NEXT_STEPS.get(scenario, []),
        }
    
    def get_available_scenarios(self) -> List[str]:
        """Get list of available script scenarios."""
        return list(self.TEMPLATES.keys())
    
    def get_available_tones(self) -> List[str]:
        """Get list of available tones."""
        return ["gentle", "direct", "warm"]


action_service = ActionService()
