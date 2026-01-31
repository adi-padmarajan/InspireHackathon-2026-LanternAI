from __future__ import annotations

import random
from dataclasses import dataclass, field
from typing import Optional

import re

from ..models.schemas import PlaybookStage, PlaybookState, PlaybookRunResponse, ResourceCardOut, ChatMode
from .chat_service import ChatService, CASUAL_SYSTEM_PROMPT
from .resource_service import get_resource_service, build_resource_id
from .safety import detect_crisis, build_crisis_response, get_crisis_action_steps, get_crisis_resource_lines


MAX_ACTIONS = 6
MAX_RESOURCES = 5


@dataclass
class PlaybookDefinition:
    playbook_id: str
    keywords: list[str]
    validation_lines: list[str]
    triage_questions: list[str]
    follow_up_questions: list[str]
    action_title: str
    base_actions: list[str]
    resource_queries: list[str]
    action_overrides: dict[str, list[str]] = field(default_factory=dict)

    def pick_validation(self) -> str:
        return random.choice(self.validation_lines)

    def pick_triage_question(self) -> str:
        return random.choice(self.triage_questions)

    def pick_follow_up(self) -> str:
        return random.choice(self.follow_up_questions)

    def build_actions(self, message: str) -> list[str]:
        actions = list(self.base_actions)
        lower = message.lower()
        for keyword, additions in self.action_overrides.items():
            if keyword in lower:
                actions.extend(additions)
        return actions[:MAX_ACTIONS]


PLAYBOOKS: dict[str, PlaybookDefinition] = {
    "overwhelmed": PlaybookDefinition(
        playbook_id="overwhelmed",
        keywords=[
            "overwhelmed",
            "too much",
            "behind",
            "stressed",
            "stress",
            "deadline",
            "deadlines",
            "exam",
            "midterm",
            "assignment",
            "paper",
            "failing",
        ],
        validation_lines=[
            "That sounds really heavy. You are carrying a lot right now.",
            "That is a lot to hold at once. I am here with you.",
            "I can see why this feels overwhelming. We can take it one step at a time.",
        ],
        triage_questions=[
            "Is this mostly academics, personal stuff, or everything at once?",
            "What feels most urgent right now: grades, time, or energy?",
        ],
        follow_up_questions=[
            "Do you want a mini plan for today or for the week?",
            "Want a quick plan, or just help choosing the first step?",
        ],
        action_title="Mini plan to lower the load",
        base_actions=[
            "Write down the three tasks that feel heaviest.",
            "Pick one small task to finish in a 25-minute focus block.",
            "Schedule a 10-minute reset break right after.",
        ],
        resource_queries=[
            "Academic Skills Centre",
            "Academic advising",
            "UVic Counselling",
            "Student Wellness Centre",
        ],
        action_overrides={
            "exam": ["Draft a 2-hour exam sprint: 45-15-45-15."],
            "midterm": ["Make a 2-hour review sprint: 45-15-45-15."],
            "assignment": ["Outline the next smallest section you can finish today."],
            "paper": ["Write a rough outline with headings you can fill in later."],
        },
    ),
    "anxious": PlaybookDefinition(
        playbook_id="anxious",
        keywords=[
            "anxious",
            "anxiety",
            "panic",
            "panicking",
            "nervous",
            "worried",
            "on edge",
            "racing",
        ],
        validation_lines=[
            "Anxiety can feel intense. I am glad you told me.",
            "That sounds really uncomfortable. We can steady things together.",
            "I hear you. Anxiety can make everything feel bigger than it is.",
        ],
        triage_questions=[
            "Is this about a specific situation, or a general sense of worry?",
            "Is your anxiety more body-based (racing heart) or thought-based right now?",
        ],
        follow_up_questions=[
            "Do you want a quick grounding plan or a longer reset?",
            "Want a short plan for right now or a longer plan for today?",
        ],
        action_title="Anxiety grounding plan",
        base_actions=[
            "Box breathing for 2 minutes: 4 in, 4 hold, 4 out, 4 hold.",
            "5-4-3-2-1 grounding: list what you see, touch, hear, smell, taste.",
            "Write the one worry you want to shrink.",
        ],
        resource_queries=[
            "UVic Counselling",
            "Student Wellness Centre",
            "Multifaith Centre",
        ],
        action_overrides={
            "presentation": ["Rehearse out loud for 5 minutes, then stop."],
            "interview": ["Do a 5-minute practice answer to one common question."],
        },
    ),
    "lonely": PlaybookDefinition(
        playbook_id="lonely",
        keywords=[
            "lonely",
            "alone",
            "isolated",
            "no friends",
            "homesick",
            "friendless",
        ],
        validation_lines=[
            "Feeling lonely at university is more common than most people admit.",
            "That sounds really isolating. You do not have to carry it alone here.",
            "I hear you. Loneliness can feel heavy, especially during busy weeks.",
        ],
        triage_questions=[
            "Do you want low-pressure connection ideas or just company right now?",
            "Would you prefer something quiet and low-key or a social space?",
        ],
        follow_up_questions=[
            "Want one gentle action for today or a small plan for this week?",
            "Should we try one tiny step or a short plan for the week?",
        ],
        action_title="Small connection plan",
        base_actions=[
            "Send one low-pressure message to someone you trust.",
            "Pick a campus space to spend 20 minutes around people.",
            "Browse one club or event you might try later.",
        ],
        resource_queries=[
            "UVic Global Community",
            "UVSS",
            "clubs",
            "CARSA",
        ],
        action_overrides={
            "international": ["Check a Global Community drop-in this week."],
            "new": ["Try a low-pressure drop-in space on campus for 20 minutes."],
        },
    ),
    "burnout": PlaybookDefinition(
        playbook_id="burnout",
        keywords=[
            "burnout",
            "burned out",
            "exhausted",
            "drained",
            "empty",
            "tired",
            "can't cope",
            "cant cope",
        ],
        validation_lines=[
            "Burnout can make everything feel flat and heavy. I am here with you.",
            "That sounds like real exhaustion. We can find a small reset first.",
            "I hear you. Burnout is real, and you deserve a gentler pace.",
        ],
        triage_questions=[
            "Is this more physical exhaustion, emotional exhaustion, or both?",
            "What feels more depleted right now: energy, motivation, or focus?",
        ],
        follow_up_questions=[
            "Want a gentle reset plan for today?",
            "Do you want a small reset plan for the next few hours?",
        ],
        action_title="Burnout reset plan",
        base_actions=[
            "Take a 10-minute no-screen reset.",
            "Choose one non-negotiable task and defer the rest.",
            "Pick a shutdown time tonight to protect sleep.",
        ],
        resource_queries=[
            "Student Wellness Centre",
            "UVic Counselling",
            "Multifaith Centre",
            "CARSA",
        ],
        action_overrides={
            "sleep": ["Aim for a consistent bedtime within 30 minutes."],
            "tired": ["Take a 20-minute rest without alarms or screens."],
        },
    ),
    "general": PlaybookDefinition(
        playbook_id="general",
        keywords=[],
        validation_lines=[
            "Thanks for sharing. We can take this one step at a time.",
            "I am here with you. Let us find a small next step.",
        ],
        triage_questions=[
            "What would help most right now: a plan, resources, or just a check-in?",
        ],
        follow_up_questions=[
            "Want a small plan for today or just one tiny next step?",
        ],
        action_title="Small next step",
        base_actions=[
            "Name the one thing that feels heaviest right now.",
            "Pick one small action you can finish in 15 minutes.",
            "Take a short break after you complete it.",
        ],
        resource_queries=[
            "Student Wellness Centre",
            "UVic Counselling",
        ],
    ),
}

CASUAL_PATTERNS = [
    r"^(hi|hello|hey|heyy|yo|sup|hiya|howdy|morning|afternoon|evening|night)\b",
    r"^(thanks|thank you|thx|ty)\b",
    r"^(ok|okay|k|cool|nice|lol|lmao|haha|hmm|hm|yep|yeah|nah|nope)\b",
]

CASUAL_WORDS = {
    "hi",
    "hello",
    "hey",
    "heyy",
    "yo",
    "sup",
    "hiya",
    "howdy",
    "morning",
    "afternoon",
    "evening",
    "night",
    "thanks",
    "thank",
    "you",
    "thx",
    "ty",
    "ok",
    "okay",
    "k",
    "cool",
    "nice",
    "lol",
    "lmao",
    "haha",
    "hmm",
    "hm",
    "yep",
    "yeah",
    "nah",
    "nope",
}


def _normalize_message(text: str) -> str:
    return re.sub(r"\s+", " ", text.strip().lower())


def _is_casual_message(text: str) -> bool:
    if not text:
        return True
    normalized = _normalize_message(text)
    if len(normalized) <= 3:
        return True
    if all(char in ".!?" for char in normalized):
        return True
    for pattern in CASUAL_PATTERNS:
        if re.match(pattern, normalized):
            return True
    tokens = [token for token in re.split(r"[^a-z]+", normalized) if token]
    if tokens and all(token in CASUAL_WORDS for token in tokens):
        return True
    return False


class PlaybookService:
    """Deterministic playbook engine for structured wellness flows."""

    def __init__(self):
        self.resource_service = get_resource_service()

    def _detect_playbook(self, message: str) -> tuple[str, int]:
        lower = message.lower()
        best_id = "general"
        best_score = 0

        for playbook_id, definition in PLAYBOOKS.items():
            if playbook_id == "general":
                continue
            score = sum(1 for keyword in definition.keywords if keyword in lower)
            if score > best_score:
                best_score = score
                best_id = playbook_id

        return best_id, best_score

    def _collect_resources(self, playbook_id: str, message: str) -> list[ResourceCardOut]:
        if not self.resource_service.is_loaded:
            return []

        definition = PLAYBOOKS.get(playbook_id, PLAYBOOKS["general"])
        queries = list(definition.resource_queries)
        lower = message.lower()
        if "exam" in lower or "midterm" in lower:
            queries.append("Academic Skills Centre")

        results = []
        seen_ids = set()
        for query in queries:
            for item in self.resource_service.search(query, limit=2):
                resource_id = item.get("id") or build_resource_id(item.get("name", ""))
                if resource_id in seen_ids:
                    continue
                seen_ids.add(resource_id)
                results.append(ResourceCardOut(**{**item, "id": resource_id}))
                if len(results) >= MAX_RESOURCES:
                    return results
        return results

    def _collect_crisis_resources(self) -> list[ResourceCardOut]:
        if not self.resource_service.is_loaded:
            return []

        # Tight, safety-focused resource set (avoid unrelated clinics).
        queries = [
            "UVic Counselling",
            "Student Wellness Centre",
            "Student Wellness",
        ]
        results: list[ResourceCardOut] = []
        seen_ids: set[str] = set()
        for query in queries:
            for item in self.resource_service.search(query, limit=3):
                name = item.get("name", "").lower()
                # Exclude unrelated clinics/services (e.g., sexual health).
                if "sexual health" in name:
                    continue
                resource_id = item.get("id") or build_resource_id(item.get("name", ""))
                if resource_id in seen_ids:
                    continue
                seen_ids.add(resource_id)
                results.append(ResourceCardOut(**{**item, "id": resource_id}))
                if len(results) >= MAX_RESOURCES:
                    return results
        return results

    def run(self, message: str, state: Optional[PlaybookState] = None) -> PlaybookRunResponse:
        if detect_crisis(message):
            crisis_actions = get_crisis_action_steps() + get_crisis_resource_lines()
            resources = self._collect_crisis_resources()
            resource_ids = [resource.id for resource in resources]
            return PlaybookRunResponse(
                playbook_id="crisis",
                stage=PlaybookStage.PLAN,
                validation=build_crisis_response(),
                triage_question=None,
                action_title="Immediate support steps",
                actions=crisis_actions[:MAX_ACTIONS],
                resource_ids=resource_ids,
                resources=resources,
                next_state=PlaybookState(playbook_id="crisis", stage=PlaybookStage.PLAN),
            )

        state = state or PlaybookState()
        playbook_id, score = self._detect_playbook(message)
        if _is_casual_message(message) or score == 0:
            response = ChatService.get_contextual_response(
                message=message,
                mode=ChatMode.WELLNESS,
                system_prompt_override=CASUAL_SYSTEM_PROMPT,
            )
            return PlaybookRunResponse(
                playbook_id="gemini",
                stage=PlaybookStage.PLAN,
                validation=response.message,
                triage_question=None,
                action_title="",
                actions=[],
                resource_ids=[],
                resources=[],
                next_state=PlaybookState(playbook_id=None, stage=PlaybookStage.VENT),
            )
        if state.playbook_id:
            playbook_id = state.playbook_id
        definition = PLAYBOOKS.get(playbook_id, PLAYBOOKS["general"])
        stage = state.stage or PlaybookStage.VENT

        resources = self._collect_resources(playbook_id, message)
        resource_ids = [resource.id for resource in resources]

        if stage == PlaybookStage.VENT:
            validation = definition.pick_validation()
            triage_question = definition.pick_triage_question()
            actions = definition.build_actions(message)
            action_title = "Quick reset"
            context = dict(state.context or {})
            context["initial_message"] = message
            next_state = PlaybookState(
                playbook_id=playbook_id,
                stage=PlaybookStage.TRIAGE,
                context=context,
            )
        elif stage == PlaybookStage.TRIAGE:
            validation = definition.pick_validation()
            triage_question = definition.pick_follow_up()
            actions = definition.build_actions(message)
            action_title = definition.action_title
            context = dict(state.context or {})
            context["triage_message"] = message
            next_state = PlaybookState(
                playbook_id=playbook_id,
                stage=PlaybookStage.PLAN,
                context=context,
            )
        else:
            validation = "Here is a mini plan you can try."
            triage_question = None
            actions = definition.build_actions(message)
            action_title = definition.action_title
            next_state = PlaybookState(
                playbook_id=playbook_id,
                stage=PlaybookStage.PLAN,
                context=state.context,
            )

        return PlaybookRunResponse(
            playbook_id=playbook_id,
            stage=stage,
            validation=validation,
            triage_question=triage_question,
            action_title=action_title,
            actions=actions,
            resource_ids=resource_ids,
            resources=resources,
            next_state=next_state,
        )


_playbook_service: Optional[PlaybookService] = None


def get_playbook_service() -> PlaybookService:
    global _playbook_service
    if _playbook_service is None:
        _playbook_service = PlaybookService()
    return _playbook_service
