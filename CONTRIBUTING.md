# Contributing to Portfolio

Thank you for considering contributing to this portfolio project! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and encourage diverse perspectives
- Focus on what is best for the community
- Show empathy towards other community members

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the bug
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Your environment (OS, browser, Node version)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please create an issue with:
- Clear description of the enhancement
- Why this enhancement would be useful
- Examples of how it would work

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting:
   ```bash
   npm run type-check
   npm run lint
   ```
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Pull Request Guidelines

- Keep changes focused and atomic
- Write clear commit messages
- Update documentation if needed
- Add tests for new features
- Ensure all tests pass
- Follow the existing code style
- Keep PRs small and focused

## Development Setup

1. Clone your fork:
   ```bash
   git clone https://github.com/your-username/portfolio.git
   cd portfolio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   # Add your GitHub token and username
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Code Style

- Use TypeScript for type safety
- Follow the existing code structure
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Use Prettier for formatting (runs on save)
- Use ESLint rules (runs with `npm run lint`)

## Project Structure

```
portfolio/
├── app/              # Next.js app router
├── components/       # React components
│   ├── ui/          # Reusable UI components
│   └── *.tsx        # Feature components
├── lib/             # Utility functions
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
├── public/          # Static assets
└── config/          # Configuration files
```

## Testing

Currently, this project doesn't have automated tests. Contributions to add testing would be welcome!

When adding new features:
- Manually test in multiple browsers
- Test responsive design on different screen sizes
- Test dark mode
- Verify accessibility

## Documentation

When adding new features or making significant changes:
- Update README.md if needed
- Update QUICKSTART.md for setup changes
- Add comments to complex code
- Update type definitions

## Questions?

Feel free to create an issue with your question!

Thank you for contributing! 🎉
