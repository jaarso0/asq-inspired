// Domain configuration with descriptions and philosophical micro-copy

export const DOMAINS = {
    mind: {
        id: 'mind',
        name: 'Mind',
        icon: '🧠',
        color: 'domain-mind',
        description: 'Cognitive development, learning, and critical thinking'
    },
    body: {
        id: 'body',
        name: 'Body',
        icon: '💪',
        color: 'domain-body',
        description: 'Physical health, energy, and embodiment'
    },
    spirit: {
        id: 'spirit',
        name: 'Spirit',
        icon: '✨',
        color: 'domain-spirit',
        description: 'Meaning, values, and connection'
    },
    vocation: {
        id: 'vocation',
        name: 'Vocation',
        icon: '🎯',
        color: 'domain-vocation',
        description: 'Work, contribution, and mastery'
    }
};

export const LEVELS = {
    1.0: {
        value: 1.0,
        name: 'Conformist',
        subtitle: 'Reactive',
        description: 'Following external rules and reacting to circumstances',
        philosophy: 'You are learning the rules of the game. This is where we all begin—absorbing what others have built before us.'
    },
    2.0: {
        value: 2.0,
        name: 'Individualist',
        subtitle: 'Self-directed',
        description: 'Creating your own rules and making proactive choices',
        philosophy: 'You are writing your own playbook. You question inherited beliefs and design systems that work for you.'
    },
    3.0: {
        value: 3.0,
        name: 'Synthesist',
        subtitle: 'Systems-thinking',
        description: 'Integrating perspectives and seeing interconnections',
        philosophy: 'You see the whole game. You understand how different domains influence each other and create emergent possibilities.'
    }
};

export const PHASES = {
    dissonance: {
        id: 'dissonance',
        name: 'Dissonance',
        color: 'phase-dissonance',
        description: 'Recognizing your current approach isn\'t working',
        guidance: 'Discomfort is data. What you\'re feeling is the gap between who you are and who you\'re becoming.'
    },
    uncertainty: {
        id: 'uncertainty',
        name: 'Uncertainty',
        color: 'phase-uncertainty',
        description: 'Exploring new approaches, feeling unstable',
        guidance: 'You\'re in the messy middle. This is where growth actually happens—not in the comfort zones on either side.'
    },
    discovery: {
        id: 'discovery',
        name: 'Discovery',
        color: 'phase-discovery',
        description: 'Integrating new patterns, gaining confidence',
        guidance: 'You\'re finding your rhythm. The new way is becoming natural. Soon it will be time to grow again.'
    }
};

// Micro-copy for different contexts
export const MICRO_COPY = {
    dashboard: {
        welcome: 'Track your development across four life domains',
        noFocus: 'Consider setting a 90-day focus domain',
        withFocus: 'Your current focus is helping you build depth'
    },
    habits: {
        empty: 'No habits yet. Complete your self-assessment to get started.',
        encouragement: 'Consistency over perfection. Every check-in matters.',
        streakFree: 'No streaks here—just honest tracking of what serves you.'
    },
    reflection: {
        prompt: 'What did you learn this week? What patterns are you noticing?',
        integration: 'How are your different domains influencing each other?',
        saved: 'Reflection saved. This is how you build self-knowledge.'
    },
    progression: {
        eligible: 'You\'re ready to advance. Take a moment to reflect before moving forward.',
        notReady: 'Keep going. Growth takes time.',
        advanced: 'Level advanced. Notice how your perspective has shifted.'
    }
};

export const WEEKLY_INTEGRATION_QUESTIONS = [
    'What did you integrate this week across different domains?',
    'Where did you notice unexpected connections?',
    'What pattern showed up in multiple areas of your life?',
    'How did growth in one domain affect another?',
    'What synthesis emerged from your practice this week?'
];
