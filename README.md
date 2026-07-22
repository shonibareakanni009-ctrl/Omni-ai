# 🤖 OmniTutor AI

A powerful, multi-modal AI learning platform that combines code execution, quiz generation, and interactive tutoring in one sleek interface.

> **✨ v2 Update:** Omni AI v2 with enhanced features is now available at [omni-ai-tutor-v2.netlify.app](https://omni-ai-tutor-v2.netlify.app/)

## Features

### 💻 Code Editor
- Write and execute JavaScript code directly in the browser
- Real-time console output with error handling
- AI-powered code improvement suggestions
- Syntax highlighting and responsive design

### 🎯 Quiz Mode
- AI-generated custom quizzes on any topic
- Multiple choice questions with instant feedback
- Detailed explanations for each answer
- Score tracking and progress visualization

### 🧠 Conversational AI
- Chat-based interface powered by Google Generative AI (Gemini)
- Intent-based request handling
- Context-aware responses for learning and coding
- Support for code generation and concept explanations

### 🎨 Modern UI
- Dark theme optimized for extended study sessions
- Fully responsive design (works on desktop, tablet, mobile)
- Smooth animations and transitions
- Clean, intuitive layout

## Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- Google Generative AI API Key (free tier available)

### Setup

1. **Get your API Key**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Copy your key

2. **Access OmniTutor**
   - Visit the [OmniTutor application](https://omni-ai-ruby.vercel.app)
   - Paste your API key when prompted
   - Your key is stored locally in your browser (never sent to our servers)

3. **Start Learning**
   - Type messages in the chat
   - Ask for code examples: *"Write a function to reverse a string"*
   - Request quizzes: *"Quiz me on JavaScript arrays"*
   - Get explanations: *"Explain what closures are"*

## Usage Examples

### Code Generation
```
You: "Write a JavaScript function to check if a number is prime"
OmniTutor: [Generates code in the code editor]
```

### Quiz Generation
```
You: "Quiz me on React Hooks"
OmniTutor: [Switches to quiz mode and generates 5 questions]
```

### Concept Learning
```
You: "Explain what async/await is"
OmniTutor: [Provides detailed explanation with examples]
```

## How It Works

1. **Intent Detection** - OmniTutor analyzes your message to determine if you want:
   - Code generation (`"write code"`, `"function"`, `"script"`)
   - Quiz generation (`"quiz me"`, `"test me"`)
   - General conversation

2. **AI Processing** - Uses Google's Gemini 2.0 Flash model for fast, accurate responses

3. **Smart Display** - Automatically switches between:
   - Code Editor for programming tasks
   - Quiz Interface for assessments
   - Chat for explanations

## Technology Stack

- **Frontend**: HTML5, CSS3 (Tailwind CSS), JavaScript (ES6+)
- **AI Engine**: Google Generative AI (Gemini 2.0 Flash)
- **Icons**: FontAwesome 6.4.0
- **Styling**: Tailwind CSS with custom scrollbar styling
- **Runtime**: Browser-based (no server required for logic)

## Features Breakdown

### 📝 Code Editor
- Textarea with custom styling for JavaScript
- Console output with color-coded messages
- "Run" button to execute code safely
- "AI Improve" button to enhance your code
- Clear console option

### 🎓 Quiz Interface
- Responsive question cards
- Multiple choice options with visual feedback
- Score tracking with progress bar
- Detailed explanations after each answer
- Quiz completion summary

### 💬 Chat Interface
- Clean message bubbles (user vs. AI)
- Auto-scrolling chat history
- Typing indicators for AI responses
- Keyboard support (Enter to send, Shift+Enter for new line)

## Privacy & Security

✅ **Your API Key is Safe**
- Stored only in your browser's `localStorage`
- Never transmitted to OmniTutor servers
- Never shared with third parties
- You can clear it anytime by dismissing the auth modal

## Tips for Best Results

1. **Be Specific** - More detailed requests yield better responses
   - ❌ "Write code" → ✅ "Write a function to sort an array of objects by name"

2. **Use Context** - Reference previous messages in the chat
   - "Improve the code you just wrote"

3. **Combine Modes** - Ask for code, run it, then quiz yourself

4. **Explore Topics** - Start broad, then go deeper
   - "What is an API?" → "Explain REST API" → "Show me a REST API example"

## Limitations

- JavaScript execution only (for code mode)
- Code runs in browser sandbox (no file system access)
- Quiz generation depends on AI model accuracy
- Requires active internet connection
- API rate limits apply (per your Google API quota)

## Browser Compatibility

| Browser | Support |
|---------|---------|
| Chrome  | ✅ Full |
| Firefox | ✅ Full |
| Safari  | ✅ Full |
| Edge    | ✅ Full |
| IE 11   | ❌ Not supported |

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Changelog

### Version 1.0
- Initial release with code editor
- Quiz generation with JSON schema validation
- Chat-based interface
- Real-time code execution
- Dark theme UI

## Roadmap

- [ ] Support for multiple programming languages (Python, Java, etc.)
- [ ] Save/load code snippets
- [ ] Quiz history and analytics
- [ ] Collaborative learning features
- [ ] Mobile app
- [ ] Offline mode support
- [ ] Custom quiz difficulty levels

## Contributing

Found a bug? Have a feature idea? Feel free to:
- Open an issue on [GitHub](https://github.com/shonibareakanni009-ctrl/Omni-ai)
- Submit a pull request with improvements
- Share feedback and suggestions

## Support

Need help? Try these resources:
- Check the [GitHub Issues](https://github.com/shonibareakanni009-ctrl/Omni-ai/issues)
- Review the examples section above
- Verify your API key is valid at [Google AI Studio](https://makersuite.google.com/app/apikey)

## Troubleshooting

### "Enter Gemini API Key" modal won't go away
- Ensure your API key is valid
- Check that it's copied completely (no extra spaces)
- Clear browser cache and try again

### Code won't run / Console shows errors
- Check your JavaScript syntax
- Ensure you're using valid JavaScript (no Python, Java, etc.)
- Use `console.log()` to debug

### Quiz won't generate
- Try a different topic
- Be more specific (e.g., "Quiz me on JavaScript ES6 features")
- Check your API quota hasn't been exceeded

### Chat responses are slow
- This is normal for first requests (model initialization)
- Subsequent requests should be faster
- Check your internet connection

---

**Made with ❤️ by Shonibare Akanni**

🚀 **Ready to learn?** Visit [OmniTutor](https://omni-ai-ruby.vercel.app) now!
