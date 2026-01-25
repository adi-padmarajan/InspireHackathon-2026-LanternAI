import json
import random
import re
from pathlib import Path
from typing import Optional


class IntentMatcher:
    """Pattern-based intent matcher using the mental health conversations dataset."""

    def __init__(self):
        self.intents = []
        self._load_dataset()

    def _load_dataset(self):
        """Load the mental health conversations dataset."""
        dataset_path = Path(__file__).parent.parent.parent.parent / "data" / "mental_health_conversations.json"

        try:
            with open(dataset_path, "r", encoding="utf-8") as f:
                data = json.load(f)
                self.intents = data.get("intents", [])
        except FileNotFoundError:
            print(f"Warning: Dataset not found at {dataset_path}")
            self.intents = []
        except json.JSONDecodeError as e:
            print(f"Warning: Failed to parse dataset: {e}")
            self.intents = []

    def _normalize_text(self, text: str) -> str:
        """Normalize text for better pattern matching."""
        # Convert to lowercase and strip whitespace
        text = text.lower().strip()
        # Remove punctuation except apostrophes
        text = re.sub(r"[^\w\s']", "", text)
        return text

    def _calculate_similarity(self, user_input: str, pattern: str) -> float:
        """Calculate similarity between user input and a pattern."""
        normalized_pattern = self._normalize_text(pattern)
        normalized_input = self._normalize_text(user_input)

        # Skip empty or whitespace-only patterns
        if not normalized_pattern or normalized_pattern.isspace():
            return 0.0

        user_words = set(normalized_input.split())
        pattern_words = set(normalized_pattern.split())

        if not pattern_words:
            return 0.0

        # Check for exact match first
        if normalized_input == normalized_pattern:
            return 1.0

        # Check if pattern is contained in user input (only for non-trivial patterns)
        if len(normalized_pattern) >= 3 and normalized_pattern in normalized_input:
            return 0.9

        # Calculate word overlap (Jaccard-like similarity)
        intersection = user_words & pattern_words
        union = user_words | pattern_words

        if not union:
            return 0.0

        return len(intersection) / len(union)

    def match_intent(self, user_message: str, threshold: float = 0.5) -> Optional[dict]:
        """
        Match user message to an intent from the dataset.

        Args:
            user_message: The user's input message
            threshold: Minimum similarity score to consider a match (0.0 to 1.0)

        Returns:
            Dictionary with 'tag', 'response', and 'confidence' if matched, None otherwise
        """
        best_match = None
        best_score = 0.0

        normalized_input = self._normalize_text(user_message)

        for intent in self.intents:
            tag = intent.get("tag", "")
            patterns = intent.get("patterns", [])
            responses = intent.get("responses", [])

            if not patterns or not responses:
                continue

            for pattern in patterns:
                score = self._calculate_similarity(user_message, pattern)

                # Boost score for keyword matches in important tags
                # Only boost if critical keywords from the tag itself are present
                critical_keywords = {
                    # Crisis & Safety
                    "suicide": ["kill", "suicide", "die", "death", "end my life", "want to die", "better off dead"],
                    "self-harm": ["hurt myself", "self harm", "cut myself", "cutting", "harming myself"],

                    # Core Mental Health
                    "depressed": ["depressed", "depression", "no interest", "feel dead inside"],
                    "sad": ["sad", "lonely", "empty", "down", "crying", "hopeless", "broken", "forgotten"],
                    "anxious": ["anxious", "anxiety", "worried", "panic", "nervous", "racing", "on edge"],
                    "stressed": ["stressed", "stress", "burned", "burnout", "overwhelmed", "pressure", "drowning"],
                    "worthless": ["worthless", "useless", "nothing", "failure", "not good enough", "pathetic", "loser"],
                    "scared": ["scared", "afraid", "fear", "terrified", "frightened", "unsafe"],

                    # Emotional States
                    "anger": ["angry", "furious", "rage", "pissed", "mad", "irritated", "frustrated", "hate everything"],
                    "overwhelmed": ["overwhelmed", "too much", "can't handle", "drowning", "breaking", "falling apart"],
                    "panic-attack": ["panic attack", "can't breathe", "heart racing", "panicking", "freaking out"],

                    # Life Challenges
                    "relationship-issues": ["relationship", "partner", "boyfriend", "girlfriend", "spouse", "fighting"],
                    "breakup": ["breakup", "broke up", "ex", "dumped", "heartbroken", "ended"],
                    "family-issues": ["family", "parents", "toxic", "controlling", "don't understand"],
                    "work-stress": ["job", "work", "boss", "coworkers", "overworked", "quit", "career"],
                    "school-stress": ["school", "exams", "grades", "failing", "academic", "college", "university"],

                    # Self-Image & Behavior
                    "body-image": ["body", "ugly", "fat", "skinny", "appearance", "looks", "attractive"],
                    "eating-issues": ["eating", "food", "binge", "restrict", "eating disorder", "skip meals"],
                    "confidence": ["confidence", "insecure", "self esteem", "inferior", "doubt myself"],
                    "motivation": ["motivation", "unmotivated", "no energy", "can't start", "pointless"],

                    # Trauma & Addiction
                    "trauma": ["trauma", "ptsd", "abused", "flashbacks", "haunted", "assaulted"],
                    "addiction": ["addiction", "addicted", "can't stop", "alcohol", "drugs", "relapsing"],

                    # Support Seeking
                    "coping-strategies": ["cope", "coping", "strategies", "manage", "deal with"],
                    "grounding": ["grounding", "disconnected", "dissociating", "not real", "floaty"],
                    "breathing": ["breathing", "breathe", "calm down"],
                    "affirmation": ["encouragement", "positive", "affirmation", "validation", "hope"],
                    "self-care": ["self care", "self-care", "take care", "relax", "destress"],

                    # Sleep
                    "sleep": ["sleep", "insomnia", "can't sleep", "nightmares", "exhausted"],

                    # Positive States
                    "happy": ["happy", "great", "good", "wonderful", "amazing", "joyful", "grateful"],
                    "achievement": ["accomplished", "proud", "achieved", "succeeded", "did it", "finished"],

                    # Social
                    "friends": ["friends", "friendless", "no friends", "lonely"],
                    "helping-others": ["help someone", "friend is struggling", "worried about"]
                }
                if tag in critical_keywords:
                    for keyword in critical_keywords[tag]:
                        if keyword in normalized_input:
                            # High boost for crisis/emotional keywords to override false containment matches
                            # Use 0.95 for crisis tags, 0.88 for other emotional tags
                            crisis_tags = {"suicide", "self-harm", "panic-attack"}
                            boost_score = 0.95 if tag in crisis_tags else 0.92
                            score = max(score, boost_score)
                            break

                if score > best_score:
                    best_score = score
                    best_match = {
                        "tag": tag,
                        "response": random.choice(responses),
                        "confidence": score,
                        "all_responses": responses
                    }

        if best_match and best_score >= threshold:
            return best_match

        return None

    def get_response_by_tag(self, tag: str) -> Optional[str]:
        """Get a random response for a specific intent tag."""
        for intent in self.intents:
            if intent.get("tag") == tag:
                responses = intent.get("responses", [])
                if responses:
                    return random.choice(responses)
        return None


# Singleton instance
_intent_matcher = None


def get_intent_matcher() -> IntentMatcher:
    """Get or create the singleton IntentMatcher instance."""
    global _intent_matcher
    if _intent_matcher is None:
        _intent_matcher = IntentMatcher()
    return _intent_matcher
