import { GoogleGenerativeAI, SchemaType } from '@google/generative-ai';

// --- CONFIG ---
let API_KEY = '';
let client = null;
let chatSession = null;

// --- STATE MANAGEMENT ---
const state = {
    mode: 'code', // 'code' or 'quiz'
    quiz: {
        active: false,
        data: [],
        currentIndex: 0,
        score: 0,
        selectedOption: null
    }
};

// --- DOM ELEMENTS ---
const dom = {
    tabs: {
        code: document.getElementById('tab-code'),
        quiz: document.getElementById('tab-quiz')
    },
    views: {
        code: document.getElementById('view-code'),
        quiz: document.getElementById('view-quiz')
    },
    chat: {
        input: document.getElementById('chat-input'),
        history: document.getElementById('chat-history'),
        sendBtn: document.getElementById('send-btn'),
        status: document.getElementById('status-indicator')
    },
    editor: {
        textarea: document.getElementById('code-editor'),
        console: document.getElementById('console-output')
    },
    quiz: {
        placeholder: document.getElementById('quiz-placeholder'),
        container: document.getElementById('quiz-container'),
        results: document.getElementById('quiz-results'),
        questionText: document.getElementById('question-text'),
        optionsGrid: document.getElementById('options-grid'),
        score: document.getElementById('quiz-score'),
        progress: document.getElementById('quiz-progress'),
        number: document.getElementById('question-number'),
        explanation: document.getElementById('explanation-box'),
        feedbackTitle: document.getElementById('feedback-title'),
        feedbackText: document.getElementById('feedback-text'),
        feedbackIcon: document.getElementById('feedback-icon'),
        nextBtn: document.getElementById('next-question-btn'),
        topic: document.getElementById('quiz-topic')
    },
    auth: {
        modal: document.getElementById('auth-modal'),
        input: document.getElementById('api-key-input'),
        btn: document.getElementById('save-key-btn')
    }
};

// --- APP LOGIC ---
const app = {
    init: async () => {
        // Check for stored key
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            API_KEY = storedKey;
            app.initGemini();
        } else if (!API_KEY) {
            dom.auth.modal.classList.remove('hidden');
        } else {
            app.initGemini();
        }

        // Event Listeners
        dom.chat.sendBtn.addEventListener('click', app.sendMessage);
        dom.chat.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                app.sendMessage();
            }
        });

        dom.auth.btn.addEventListener('click', () => {
            const key = dom.auth.input.value.trim();
            if (key) {
                API_KEY = key;
                localStorage.setItem('gemini_api_key', key);
                dom.auth.modal.classList.add('hidden');
                app.initGemini();
            }
        });

        // Expose specific functions globally for HTML onclick attributes
        window.app = app;
    },

    initGemini: async () => {
        try {
            const genAI = new GoogleGenerativeAI(API_KEY);
            client = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash', // Using latest Flash model
                systemInstruction: 'You are OmniTutor, an AI coding assistant and teacher. Your goal is to help the user learn programming or general knowledge. If the user asks for code, provide JavaScript examples. Keep responses concise and helpful.'
            });

            chatSession = client.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{ text: 'Hello' }]
                    },
                    {
                        role: 'model',
                        parts: [{ text: "Hi! I'm OmniTutor. How can I help you learn today?" }]
                    }
                ]
            });

            dom.chat.status.innerText = 'Connected';
            dom.chat.status.classList.add('text-green-400');
        } catch (error) {
            console.error('Init Error:', error);
            dom.chat.status.innerText = 'Error';
            dom.chat.status.classList.add('text-red-400');
        }
    },

    // --- UI SWITCHING ---
    switchTab: (mode) => {
        state.mode = mode;

        // Update Buttons
        dom.tabs.code.className = mode === 'code'
            ? 'px-4 py-1.5 rounded text-sm font-medium transition bg-blue-600 text-white shadow'
            : 'px-4 py-1.5 rounded text-sm font-medium transition hover:bg-slate-800 text-slate-400';

        dom.tabs.quiz.className = mode === 'quiz'
            ? 'px-4 py-1.5 rounded text-sm font-medium transition bg-blue-600 text-white shadow'
            : 'px-4 py-1.5 rounded text-sm font-medium transition hover:bg-slate-800 text-slate-400';

        // Update Views
        if (mode === 'code') {
            dom.views.code.classList.remove('hidden');
            dom.views.quiz.classList.add('hidden');
            dom.views.quiz.classList.remove('flex');
        } else {
            dom.views.code.classList.add('hidden');
            dom.views.quiz.classList.remove('hidden');
            dom.views.quiz.classList.add('flex');
        }
    },

    // --- CHAT & INTENT ---
    sendMessage: async () => {
        if (!chatSession) return;
        const text = dom.chat.input.value.trim();
        if (!text) return;

        // 1. Add User Message
        app.appendMessage('user', text);
        dom.chat.input.value = '';
        app.setLoading(true);

        // 2. Intent Detection
        const lowerText = text.toLowerCase();
        const isQuizRequest = lowerText.includes('quiz') || lowerText.includes('test me');
        const isCodeRequest = lowerText.includes('write code') || lowerText.includes('function') || lowerText.includes('script') || lowerText.includes('create a program');

        try {
            // 3. Handle Intents
            if (isQuizRequest) {
                await app.handleQuizGeneration(text);
            } else if (isCodeRequest) {
                app.switchTab('code');
                await app.handleCodeGeneration(text);
            } else {
                // Standard Chat
                const result = await chatSession.sendMessage(text);
                const response = result.response.text();
                app.appendMessage('model', response);
            }
        } catch (error) {
            app.appendMessage('model', `Sorry, I encountered an error: ${error.message}`);
        } finally {
            app.setLoading(false);
        }
    },

    appendMessage: (role, text) => {
        const div = document.createElement('div');
        div.className = `flex flex-col gap-1 items-${role === 'user' ? 'end' : 'start'} animate-fade-in`;

        const bubble = document.createElement('div');
        const baseClasses = 'p-3 rounded-lg max-w-[90%] shadow-sm text-sm whitespace-pre-wrap';

        if (role === 'user') {
            bubble.className = `${baseClasses} bg-blue-600 text-white rounded-tr-none`;
        } else {
            bubble.className = `${baseClasses} bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none`;
        }

        bubble.innerText = text;
        div.appendChild(bubble);
        dom.chat.history.appendChild(div);
        dom.chat.history.scrollTop = dom.chat.history.scrollHeight;
    },

    setLoading: (isLoading) => {
        const btn = dom.chat.sendBtn;
        if (isLoading) {
            btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;
        } else {
            btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i>';
            btn.disabled = false;
        }
    },

    // --- CODE FUNCTIONS ---
    handleCodeGeneration: async (prompt) => {
        app.appendMessage('model', 'Working on that code for you...');

        // Specific Prompt for Code
        const codeResult = await chatSession.sendMessage(`
            The user wants code: "${prompt}".
            Provide ONLY raw JavaScript code.
            Do not use markdown backticks.
            Do not add explanations outside the code (use comments).
        `);

        let code = codeResult.response.text();
        // Strip markdown if AI adds it despite instructions
        code = code.replace(/```javascript/g, '').replace(/```/g, '').trim();

        dom.editor.textarea.value = code;
        app.appendMessage('model', "I've updated the Code Editor with the requested solution. Click 'Run' to test it.");
    },

    improveCode: async () => {
        if (!chatSession) return;
        const currentCode = dom.editor.textarea.value;
        if (!currentCode) return;

        const btn = document.querySelector('button[onclick="app.improveCode()"]');
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Improving...';

        try {
            const result = await chatSession.sendMessage(`
                Review and improve the following JavaScript code.
                Fix bugs, add comments, and optimize.
                Return ONLY the raw code (no markdown).
                CODE:
                ${currentCode}
            `);

            let code = result.response.text();
            code = code.replace(/```javascript/g, '').replace(/```/g, '').trim();
            dom.editor.textarea.value = code;
        } catch (e) {
            console.error(e);
        } finally {
            btn.innerHTML = originalContent;
        }
    },

    runCode: () => {
        const code = dom.editor.textarea.value;
        const consoleDiv = dom.editor.console;

        // Clear previous output marker
        consoleDiv.innerHTML = '<div class="text-xs text-slate-500 mb-2 border-b border-slate-800 pb-1">Execution started...</div>';

        // Mock Console
        const log = (...args) => {
            const line = document.createElement('div');
            line.className = 'text-green-400 font-mono break-all border-l-2 border-slate-700 pl-2 mb-1';
            line.innerText = args.map(arg =>
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            consoleDiv.appendChild(line);
            consoleDiv.scrollTop = consoleDiv.scrollHeight;
        };

        const error = (...args) => {
            const line = document.createElement('div');
            line.className = 'text-red-400 font-mono break-all border-l-2 border-red-900 pl-2 mb-1';
            line.innerText = `Error: ${args.join(' ')}`;
            consoleDiv.appendChild(line);
        };

        try {
            // Create a safe-ish scope
            // Note: We use 'console' argument to shadow global console
            const safeRun = new Function('console', code);
            safeRun({ log, error, warn: log, info: log });
        } catch (e) {
            error(e.message);
        }
    },

    // --- QUIZ FUNCTIONS ---
    handleQuizGeneration: async (prompt) => {
        app.switchTab('quiz');
        dom.quiz.placeholder.classList.remove('hidden');
        dom.quiz.container.classList.add('hidden');
        dom.quiz.results.classList.add('hidden');

        app.appendMessage('model', 'Generating a custom quiz for you...');

        // JSON Schema for Quiz
        const schema = {
            type: SchemaType.OBJECT,
            properties: {
                topic: { type: SchemaType.STRING },
                questions: {
                    type: SchemaType.ARRAY,
                    items: {
                        type: SchemaType.OBJECT,
                        properties: {
                            question: { type: SchemaType.STRING },
                            options: {
                                type: SchemaType.ARRAY,
                                items: { type: SchemaType.STRING }
                            },
                            correctIndex: { type: SchemaType.INTEGER },
                            explanation: { type: SchemaType.STRING }
                        },
                        required: ['question', 'options', 'correctIndex', 'explanation']
                    }
                }
            },
            required: ['topic', 'questions']
        };

        try {
            const result = await client.getGenerativeModel({
                model: 'gemini-2.0-flash',
                generationConfig: {
                    responseMimeType: 'application/json',
                    responseSchema: schema
                }
            }).generateContent(`Generate a quiz based on this request: "${prompt}". Create 5 multiple choice questions.`);

            const quizData = JSON.parse(result.response.text());
            app.startQuiz(quizData);
            app.appendMessage('model', `Quiz on "${quizData.topic}" is ready! Check the Quiz tab.`);
        } catch (e) {
            app.appendMessage('model', 'Failed to generate quiz format. Try again.');
            console.error(e);
        }
    },

    startQuiz: (data) => {
        state.quiz.active = true;
        state.quiz.data = data.questions;
        state.quiz.currentIndex = 0;
        state.quiz.score = 0;

        dom.quiz.topic.innerText = data.topic;
        dom.quiz.placeholder.classList.add('hidden');
        dom.quiz.results.classList.add('hidden');
        dom.quiz.container.classList.remove('hidden');

        app.renderQuestion();
    },

    renderQuestion: () => {
        const qData = state.quiz.data[state.quiz.currentIndex];
        const total = state.quiz.data.length;

        // Reset UI
        dom.quiz.nextBtn.classList.add('hidden');
        dom.quiz.explanation.classList.add('hidden');
        dom.quiz.score.innerText = state.quiz.score;
        dom.quiz.number.innerText = `Question ${state.quiz.currentIndex + 1}/${total}`;
        dom.quiz.progress.style.width = `${((state.quiz.currentIndex) / total) * 100}%`;

        dom.quiz.questionText.innerText = qData.question;
        dom.quiz.optionsGrid.innerHTML = '';

        qData.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'w-full text-left p-4 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:border-blue-500 transition group flex items-center justify-between';
            btn.innerHTML = `<span class="font-medium text-slate-300 group-hover:text-white">${opt}</span>`;
            btn.onclick = () => app.handleAnswer(idx, btn);
            dom.quiz.optionsGrid.appendChild(btn);
        });
    },

    handleAnswer: (selectedIndex, btnElement) => {
        // Prevent multiple clicks
        const buttons = dom.quiz.optionsGrid.querySelectorAll('button');
        buttons.forEach(b => (b.disabled = true));

        const currentQ = state.quiz.data[state.quiz.currentIndex];
        const isCorrect = selectedIndex === currentQ.correctIndex;

        // Visual Feedback
        if (isCorrect) {
            btnElement.className = 'w-full text-left p-4 rounded-lg bg-green-900/30 border border-green-500 transition flex items-center justify-between';
            btnElement.innerHTML += '<i class="fa-solid fa-check text-green-500"></i>';
            state.quiz.score++;
            dom.quiz.feedbackTitle.innerText = 'Correct!';
            dom.quiz.feedbackTitle.className = 'font-bold text-sm mb-1 text-green-400';
            dom.quiz.feedbackIcon.className = 'fa-solid fa-circle-check mt-1 text-green-400';
        } else {
            btnElement.className = 'w-full text-left p-4 rounded-lg bg-red-900/30 border border-red-500 transition flex items-center justify-between';
            btnElement.innerHTML += '<i class="fa-solid fa-xmark text-red-500"></i>';

            // Highlight correct answer
            const correctBtn = buttons[currentQ.correctIndex];
            correctBtn.className = 'w-full text-left p-4 rounded-lg bg-green-900/20 border border-green-500/50 transition flex items-center justify-between opacity-70';
            correctBtn.innerHTML += '<span class="text-xs text-green-400 font-bold">Correct Answer</span>';

            dom.quiz.feedbackTitle.innerText = 'Incorrect';
            dom.quiz.feedbackTitle.className = 'font-bold text-sm mb-1 text-red-400';
            dom.quiz.feedbackIcon.className = 'fa-solid fa-circle-xmark mt-1 text-red-400';
        }

        // Show Explanation
        dom.quiz.feedbackText.innerText = currentQ.explanation;
        dom.quiz.explanation.classList.remove('hidden');
        dom.quiz.score.innerText = state.quiz.score;

        // Show Next Button
        dom.quiz.nextBtn.classList.remove('hidden');
        dom.quiz.nextBtn.onclick = app.nextQuestion;
    },

    nextQuestion: () => {
        state.quiz.currentIndex++;
        if (state.quiz.currentIndex < state.quiz.data.length) {
            app.renderQuestion();
        } else {
            app.showResults();
        }
    },

    showResults: () => {
        dom.quiz.container.classList.add('hidden');
        dom.quiz.results.classList.remove('hidden');
        document.getElementById('final-score').innerText = `${state.quiz.score}/${state.quiz.data.length}`;
        dom.quiz.progress.style.width = '100%';
    }
};

// Start App
window.addEventListener('load', app.init);

// Export for use in HTML
window.app = app;