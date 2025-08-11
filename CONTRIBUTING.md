# Contributing to Multi-Platform Tracking SDK

Thank you for your interest in contributing to the Multi-Platform Tracking SDK!
This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm or yarn package manager
- Git

### Development Setup

1. **Fork and Clone**

    ```bash
    git clone https://github.com/azmarifdev/multi-platform-tracking-sdk.git
    cd multi-platform-tracking-sdk
    ```

2. **Install Dependencies**

    ```bash
    npm install
    ```

3. **Run Tests**

    ```bash
    npm test
    ```

4. **Build the Project**
    ```bash
    npm run build
    ```

## 📋 Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `refactor/description` - Code refactoring

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

feat(instagram): add Stories tracking support
fix(meta): resolve conversion API response parsing
docs(readme): update installation instructions
test(gtm): add enhanced ecommerce test cases
```

### Code Standards

#### TypeScript

- Use strict TypeScript configuration
- Provide comprehensive type definitions
- Avoid `any` types
- Use meaningful interface names

#### Testing

- Maintain 90%+ test coverage
- Write unit tests for all new features
- Include integration tests for critical paths
- Mock external API calls

#### Code Style

- Use Prettier for formatting
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for public APIs

## 🧪 Testing Guidelines

### Test Structure

```typescript
describe('FeatureName', () => {
    describe('specific functionality', () => {
        it('should behave in expected way', () => {
            // Test implementation
        });
    });
});
```

### Test Categories

- **Unit Tests**: Individual function/method testing
- **Integration Tests**: Component interaction testing
- **API Tests**: External service integration
- **Browser Tests**: Client-side functionality

### Running Tests

```bash
# All tests
npm test

# Specific test file
npm test src/__tests__/MetaPixelTracker.test.ts

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

## 🔧 Platform-Specific Guidelines

### Facebook/Meta Integration

- Follow [Meta Business SDK](https://developers.facebook.com/docs/business-sdk)
  patterns
- Implement proper error handling for API responses
- Include test event support
- Maintain GDPR/CCPA compliance

### Instagram Tracking

- Focus on engagement metrics
- Support Stories, Reels, and Feed content
- Include shopping event tracking
- Consider cultural context for Bangladesh market

### Google Tag Manager

- Use dataLayer best practices
- Support enhanced ecommerce specification
- Implement proper event tracking
- Include debug capabilities

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for all public methods
- Include usage examples in comments
- Document complex algorithms
- Explain platform-specific behaviors

### README Updates

- Keep feature list current
- Update installation instructions
- Add new usage examples
- Maintain version badges

### Changelog

- Follow [Keep a Changelog](https://keepachangelog.com/) format
- Document breaking changes
- Include migration guides
- Credit contributors

## 🐛 Bug Reports

### Before Reporting

1. Check existing issues
2. Test with latest version
3. Reproduce the issue
4. Gather relevant information

### Bug Report Template

````markdown
**Environment**

- SDK Version: x.x.x
- Platform: Facebook/Instagram/GTM
- Browser/Node.js version:
- Operating System:

**Description** Clear description of the bug

**Steps to Reproduce**

1. Step one
2. Step two
3. Step three

**Expected Behavior** What should happen

**Actual Behavior** What actually happens

**Code Sample**

```typescript
// Minimal code to reproduce issue
```
````

**Additional Context** Any other relevant information

````

## ✨ Feature Requests

### Feature Request Template
```markdown
**Platform**
Which platform (Facebook/Instagram/GTM/New Platform)

**Use Case**
Describe the business need

**Proposed Solution**
How you envision the feature working

**Alternatives**
Other approaches considered

**Additional Context**
Any other relevant information
````

## 🚀 Pull Request Process

### Before Submitting

1. ✅ Tests pass (`npm test`)
2. ✅ Build succeeds (`npm run build`)
3. ✅ Code follows style guidelines
4. ✅ Documentation updated
5. ✅ Changelog updated

### PR Template

```markdown
**Type of Change**

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

**Description** Brief description of changes

**Testing**

- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing completed

**Checklist**

- [ ] Code follows project standards
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Changelog updated
```

### Review Process

1. Automated checks must pass
2. At least one maintainer review
3. Address feedback promptly
4. Maintain clean commit history

## 🎯 Development Priorities

### Current Focus

1. **Platform Expansion**: TikTok, Snapchat, LinkedIn
2. **Performance**: Bundle size optimization
3. **Developer Experience**: Better debugging tools
4. **Documentation**: More examples and guides

### Long-term Goals

1. **Analytics Dashboard**: Real-time monitoring
2. **Advanced Features**: A/B testing integration
3. **Enterprise Features**: Advanced privacy controls
4. **Community**: Plugin architecture

## 🤝 Community

### Communication Channels

- **GitHub Issues**: Bug reports and feature requests
- **GitHub Discussions**: General questions and ideas
- **Email**: hello@azmarif.dev for sensitive issues

### Code of Conduct

We are committed to providing a welcoming and inclusive environment for all
contributors. Please be respectful and professional in all interactions.

## 📄 License

By contributing to this project, you agree that your contributions will be
licensed under the MIT License.

---

Thank you for contributing to the Multi-Platform Tracking SDK! 🎉
