/**
 * Lantern AI Companion - Unified Support System
 * Handles all student challenges: mental health, accessibility, international support,
 * social anxiety, seasonal depression, and more.
 */

import type { ChatMode } from "@/lib/chatModes";

export interface SupportCategory {
  keywords: string[];
  priority: number;
  handler: (input: string, mode: ChatMode) => string;
}

// Crisis detection - highest priority
const crisisKeywords = ["suicide", "kill myself", "end my life", "want to die", "hurt myself", "self-harm"];

function detectCrisis(input: string): boolean {
  const lower = input.toLowerCase();
  return crisisKeywords.some(keyword => lower.includes(keyword));
}

function getCrisisResponse(): string {
  return `💚 I'm really glad you reached out. What you're feeling matters, and you don't have to face this alone.

**Please reach out to one of these resources right now:**

🆘 **Crisis Line BC**: 1-800-784-2433 (24/7)
📱 **Text**: HOME to 686868 (Canada)
🏥 **UVic Counselling Emergency**: 250-721-8341

**If you're on campus:**
Walk to Student Wellness Centre (SUB) - they have same-day crisis support.

I'm here to chat, but a trained counselor can provide the immediate support you deserve. Would you like me to stay with you while you consider reaching out?`;
}

// Support category handlers
const supportCategories: SupportCategory[] = [
  // Mental Health & Stress
  {
    keywords: ["stress", "stressed", "overwhelmed", "too much", "can't cope", "pressure", "burnout", "exhausted"],
    priority: 1,
    handler: (input, mode) => `I hear you—feeling overwhelmed is really common, and it takes courage to acknowledge it. 💚

**Immediate Relief:**
1. **4-7-8 Breathing**: Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 3x.
2. **Ground yourself**: Name 5 things you can see, 4 you can touch, 3 you can hear.
3. **Take a 10-minute break** - step outside if you can.

**Break It Down:**
What's the ONE most important thing you need to do today? Let's focus there first.

**UVic Support:**
• Counselling Services: 250-721-8341 (same-day crisis appointments available)
• Peer Support Centre (SUB)
• Therapy dogs: Check @uvicpaws on Instagram for schedules

Would you like help prioritizing your tasks, or would you prefer to talk through what's causing the stress?`
  },

  // Anxiety
  {
    keywords: ["anxious", "anxiety", "panic", "nervous", "worried", "fear", "scared", "terrified"],
    priority: 1,
    handler: (input, mode) => `Anxiety can feel so overwhelming, but you're not alone in this. 🌿

**Quick Grounding Techniques:**
1. **5-4-3-2-1 Method**: Identify 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste
2. **Box Breathing**: 4 counts in, 4 hold, 4 out, 4 hold
3. **Cold water**: Splash cold water on your face or hold ice cubes

**On-Campus Support:**
• Student Wellness has anxiety-specific group programs
• Meditation Room at Interfaith Chapel (quiet, safe space)
• SupportConnect: 24/7 phone/chat support

**Helpful Apps:**
• Calm and Headspace (free for students)
• MindShift CBT (anxiety-specific)

What's triggering the anxiety right now? Sometimes naming it helps reduce its power.`
  },

  // Seasonal Depression
  {
    keywords: ["seasonal", "sad", "winter", "dark", "grey", "gray", "weather", "rain", "gloomy", "depressed", "depression"],
    priority: 1,
    handler: (input, mode) => `Victoria's dark, rainy winters are genuinely hard on mental health. You're definitely not alone in this. 🌧️

**What Actually Helps:**
1. **Light therapy lamps** - 10,000 lux for 20-30 min each morning. UVic Health Services has info on getting one.
2. **Vitamin D3** - Many Victorians are deficient. Consider asking a doctor about supplements.
3. **Morning daylight** - Even 10 minutes outside before 10am helps reset your circadian rhythm.
4. **Movement** - Doesn't have to be intense. A walk to campus counts.

**UVic-Specific Tips:**
• The Phoenix Theatre and other indoor campus spots have great lighting
• CARSA gym has large windows and energizing atmosphere
• Consider joining a morning class to force yourself into daylight

**Professional Support:**
• UVic Counselling: 250-721-8341 (mention seasonal symptoms)
• Your doctor can discuss light therapy, vitamin D, and other options

Would you like suggestions for indoor activities that help during the dark months?`
  },

  // Social Isolation & Loneliness
  {
    keywords: ["lonely", "alone", "isolated", "no friends", "nobody", "friendless", "isolation", "miss home", "homesick"],
    priority: 1,
    handler: (input, mode) => `Feeling lonely at university is more common than you might think—and it doesn't mean anything is wrong with you. 💛

**Low-Pressure Ways to Connect:**
1. **Study Together** - Library study groups don't require small talk
2. **Discord/Online First** - Many clubs have Discord servers you can join before attending in person
3. **Peer Support Centre** (SUB) - Just drop in for a chat with someone who understands
4. **Volunteer** - Helping others naturally creates connection

**UVic Events:**
• Global Community drop-in (free coffee, casual conversation)
• Board game nights at the SUB
• Outdoor Recreation programs (hiking, kayaking)

**Remember:**
• It takes time—3-6 months to form genuine friendships
• Quality over quantity—one good friend is enough
• Shared activities create bonds more naturally than forced socializing

What interests or hobbies do you have? I can suggest specific groups that might be a good fit.`
  },

  // Social Anxiety & Clubs
  {
    keywords: ["club", "clubs", "join", "social anxiety", "shy", "introvert", "awkward", "meeting people", "talk to people"],
    priority: 1,
    handler: (input, mode) => `Walking into a room of strangers is genuinely intimidating—your feelings are completely valid. 🌱

**Gentle First Steps:**
1. **Browse online first** - uvss.ca/clubs (no commitment)
2. **Lurk before you leap** - Many clubs have Instagram/Discord to observe first
3. **Go with someone** - UVSS hosts "club crawls" for exactly this
4. **Pick activity-focused clubs** - Less pressure to make small talk

**Anxiety-Friendly Club Types:**
• **Board game clubs** - Structured activity, built-in conversation topics
• **Outdoor clubs** - Focus on hiking/biking, natural silence is okay
• **Craft/hobby clubs** - Hands busy, less eye contact required
• **Academic clubs** - Shared knowledge makes talking easier

**Low-Pressure Options:**
• Photography walks (you're focused on taking photos)
• Gardening club (therapeutic and quiet)
• Book clubs (talk about the book, not yourself)

There's no pressure to join anything—exploring is completely valid. What are your interests? I can suggest specific clubs.`
  },

  // Making Friends
  {
    keywords: ["friends", "friendship", "make friends", "find friends", "meet people", "connection", "connect"],
    priority: 1,
    handler: (input, mode) => `Making friends as an adult is genuinely hard—it's not you, it's the structure of university life. 🤝

**The Science of Friendship:**
Research shows friendship requires:
• **Proximity** - Be in the same place regularly
• **Repeated exposure** - Same people, same time each week
• **Vulnerability** - Share something real about yourself

**Practical Strategies:**
1. **Pick one recurring activity** - Same fitness class, same club meeting, same study spot
2. **Be the inviter** - "Want to grab coffee after this?"
3. **Find your people** - Interests > proximity
4. **Lower the bar** - Acquaintances first, friends later

**UVic-Specific Tips:**
• Residence events (if in res)
• Intramural sports (low commitment)
• Study groups for your major
• Discord servers for your program

**Remember:** Everyone feels like they're the only one struggling to make friends. They're not—most students feel this way.

What are you studying or interested in? I can suggest specific ways to find your people.`
  },

  // Accessibility & Mobility
  {
    keywords: ["accessible", "accessibility", "wheelchair", "elevator", "ramp", "disability", "mobility", "walking", "stairs", "hills", "uneven", "terrain"],
    priority: 1,
    handler: (input, mode) => `UVic's hilly terrain can be challenging, but there are accessible routes! 🦽

**Key Elevator Locations:**
• **Clearihue**: East entrance, ground floor
• **MacLaurin**: Main entrance, south side
• **Engineering Lab Wing**: Near main doors
• **University Centre**: Multiple elevators
• **McPherson Library**: North side

**Flattest Routes:**
• **Ring Road** - The most accessible path around campus
• **Bus Loop to University Centre** - Step-free access
• **SUB to Clearihue** - Relatively flat via Ring Road

**Resources:**
• **Centre for Accessible Learning (CAL)**: 250-472-4947
• **Accessibility Map**: uvic.ca/accessibility
• **Accessibility Services**: Can arrange accommodations

**Practical Tips:**
• HandyDART serves campus
• Motorized scooter rentals available
• Most building entrances have automatic doors

Which building are you trying to reach? I can give you specific route guidance!`
  },

  // International Students - General
  {
    keywords: ["international", "foreign", "country", "culture", "cultural", "adjust", "different", "back home", "my country"],
    priority: 1,
    handler: (input, mode) => `Adjusting to a new culture while managing academics is genuinely challenging—you're doing something brave! 🌍

**Common Adjustments:**
• **Direct communication** - Canadians may seem more blunt than you're used to
• **Personal space** - Usually larger than in many countries
• **Time culture** - Punctuality is expected
• **Classroom participation** - Expected to speak up and question professors

**UVic Resources:**
• **International Student Services**: 250-721-6361
• **Global Community** - Drop-in events, free food, casual conversation
• **Peer Mentorship** - Get paired with an experienced international student
• **Cultural clubs** - Find others from your region

**Practical Help:**
• English conversation groups (free)
• Cultural adjustment workshops
• Tax filing help for international students

What specific aspect of Canadian culture or university life would you like to understand better?`
  },

  // Office Hours & Academic Culture
  {
    keywords: ["office hours", "professor", "instructor", "email", "academic", "assignment", "class", "lecture", "expect"],
    priority: 2,
    handler: (input, mode) => `Canadian academic culture can be confusing at first! Let me explain. 📚

**Office Hours:**
• **What they are**: Dedicated time when professors wait in their office for students
• **Who uses them**: ANYONE—not just struggling students!
• **How to go**: Just show up (check syllabus for times/location)
• **What to say**: "I wanted to clarify..." or "I'm not sure I understand..."

**Email Etiquette:**
• Use your UVic email
• Subject line: Course code + reason
• "Dear Professor [Last Name],"
• Be specific and concise
• Sign with your name and student number

**Classroom Expectations:**
• Participation is valued and sometimes graded
• It's okay to disagree respectfully with professors
• Asking questions shows engagement, not ignorance
• Arriving late is noticed—try to be on time

Would you like me to help you draft an email to a professor or prepare for office hours?`
  },

  // Visa & Immigration
  {
    keywords: ["visa", "permit", "study permit", "work permit", "immigration", "ircc", "extend", "expire"],
    priority: 1,
    handler: (input, mode) => `Immigration matters are stressful—let me point you to the right resources. 📋

**UVic International Student Services:**
• **Location**: University Centre
• **Phone**: 250-721-6361
• **What they help with**: Study permit renewals, work permits, immigration questions

**Important Reminders:**
• Apply to renew your study permit **at least 30 days** before expiry
• Keep your passport valid
• Maintain full-time status (or get authorization for part-time)
• Know your work limits (20 hrs/week during term)

**Work Permits:**
• Co-op work permits for work terms
• Post-graduation work permit (PGWP) info sessions offered

**I recommend:**
Book an appointment with International Student Services—they're the experts and can review your specific situation.

Is there a specific immigration question I can help clarify?`
  },

  // Food & Practical Needs
  {
    keywords: ["food", "eat", "hungry", "meal", "restaurant", "cafeteria", "cheap", "budget"],
    priority: 3,
    handler: (input, mode) => `Here are the food options on campus! 🍽️

**Main Locations:**
• **University Centre** - Food court with multiple options
• **Mystic Market** (SUB) - Popular, varied options
• **Engineering Café** - Quick bites
• **Library Café** - Coffee and snacks

**Budget-Friendly:**
• UVSS Food Bank (confidential, no questions asked)
• Student Union Building often has free food events
• Bulk Barn near campus for cheap groceries

**Dietary Needs:**
Most locations have vegetarian, vegan, and halal options. The SUB and UC food courts are most diverse.

Would you like recommendations for specific dietary requirements or the cheapest options?`
  },
];

// Main response generator
export function generateLanternResponse(input: string, mode: ChatMode): string {
  const lowerInput = input.toLowerCase();

  // Check for crisis first
  if (detectCrisis(lowerInput)) {
    return getCrisisResponse();
  }

  // Find matching category
  let bestMatch: { category: SupportCategory; matchCount: number } | null = null;

  for (const category of supportCategories) {
    const matchCount = category.keywords.filter(keyword => 
      lowerInput.includes(keyword)
    ).length;

    if (matchCount > 0) {
      if (!bestMatch || matchCount > bestMatch.matchCount || 
          (matchCount === bestMatch.matchCount && category.priority < bestMatch.category.priority)) {
        bestMatch = { category, matchCount };
      }
    }
  }

  // Mode-specific enhancements for social wellness (replaces old international mode)
  if (mode === "social" && (lowerInput.includes("confused") || lowerInput.includes("don't understand"))) {
    const socialCategory = supportCategories.find(c => 
      c.keywords.includes("lonely") || c.keywords.includes("friends")
    );
    if (socialCategory) {
      return socialCategory.handler(input, mode);
    }
  }

  if (bestMatch) {
    return bestMatch.category.handler(input, mode);
  }

  // Default response - aligned with 6 wellness dimensions
  return `Thank you for sharing that with me. 🌿

I'm here to support your holistic wellness:
• **Physical** - Sleep, movement, nutrition, energy
• **Emotional** - Stress, anxiety, processing feelings
• **Intellectual** - Study strategies, focus, academic balance
• **Spiritual** - Purpose, mindfulness, gratitude
• **Environmental** - Study spaces, nature connection
• **Social** - Making friends, clubs, social confidence
• **Seasonal** - SAD support, light therapy, winter wellness

Could you tell me more about what you're experiencing? I want to give you the most helpful response.

**Quick options:**
• "I'm feeling stressed about..."
• "I want to improve my sleep..."
• "I'm struggling to make friends..."
• "The dark weather is affecting me..."`;
}

// Export for mood-based greetings
export function getMoodBasedGreeting(hour: number): string {
  if (hour < 6) {
    return "You're up late—or early! Either way, I'm here. 🌙";
  } else if (hour < 12) {
    return "Good morning! How can I brighten your day? ☀️";
  } else if (hour < 17) {
    return "Good afternoon! What's on your mind? 🌿";
  } else if (hour < 21) {
    return "Good evening! How was your day? 🌅";
  } else {
    return "It's getting late—remember to rest soon! How can I help? 🌙";
  }
}
