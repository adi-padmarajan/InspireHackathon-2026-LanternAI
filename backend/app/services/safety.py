from __future__ import annotations

import re
from typing import Optional

# Crisis detection phrases (avoid overly broad terms to reduce false positives)
_CRISIS_PATTERNS = [
    r"\bsuicide\b",
    r"\bsuicidal\b",
    r"\bkill myself\b",
    r"\bend my life\b",
    r"\bwant to die\b",
    r"\bdon't want to live\b",
    r"\bdo not want to live\b",
    r"\bdont want to live\b",
    r"\bself[- ]?harm\b",
    r"\bhurt myself\b",
    r"\bcut myself\b",
    r"\boverdose\b",
    r"\bend it all\b",
    r"\bending it all\b",
    r"\btake my life\b",
    r"\bwish i was dead\b",
    r"\bcan't go on\b",
    r"\bcant go on\b",
    r"\bno reason to live\b",
]

_CRISIS_RESOURCE_LINES = [
    "Call or text 988 (Suicide Crisis Helpline, Canada, 24/7)",
    "BC Crisis Line: 1-800-784-2433 (24/7)",
    "If you're outside Canada: findahelpline.com",
]

_CRISIS_ACTION_STEPS = [
    "If you can, move to a safer place or be with someone you trust.",
]

_EMERGENCY_LINE = "If you're in immediate danger, call 911."


def detect_crisis(text: Optional[str]) -> bool:
    if not text:
        return False
    lower = text.lower()
    return any(re.search(pattern, lower) for pattern in _CRISIS_PATTERNS)


def get_crisis_resource_lines(include_emergency: bool = True) -> list[str]:
    lines = []
    if include_emergency:
        lines.append(_EMERGENCY_LINE)
    lines.extend(_CRISIS_RESOURCE_LINES)
    return lines


def get_crisis_action_steps() -> list[str]:
    return list(_CRISIS_ACTION_STEPS)


def build_crisis_resources_block(include_emergency: bool = True) -> str:
    lines = get_crisis_resource_lines(include_emergency=include_emergency)
    return "\n".join([f"• {line}" for line in lines])


def build_crisis_response(preferred_name: Optional[str] = None) -> str:
    name_prefix = f"{preferred_name}, " if preferred_name else ""
    resources_block = build_crisis_resources_block()
    return (
        f"{name_prefix}I can hear how much pain you're in, and I want to make sure you're safe. "
        "I'm an AI, and I can't provide the level of care you deserve right now.\n\n"
        f"{resources_block}\n\n"
        "I'm still here with you. Would you like to stay here while you reach out?"
    )


def build_crisis_follow_up_question() -> str:
    return "Would you like me to stay here while you reach out?"


def build_crisis_checkin_message() -> str:
    resources_block = build_crisis_resources_block()
    return (
        "I'm still here with you. If things feel unsafe right now, please reach out for support.\n\n"
        f"{resources_block}"
    )
