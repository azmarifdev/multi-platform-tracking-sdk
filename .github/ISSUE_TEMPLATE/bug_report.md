---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: ['bug', 'needs-triage']
assignees: ''
---

**🐛 Bug Description** A clear and concise description of what the bug is.

**🔧 Environment**

- SDK Version: [e.g., 1.1.0]
- Platform: [Facebook/Instagram/GTM]
- Environment: [Browser/Node.js]
- Browser/Node.js Version: [e.g., Chrome 91, Node 16.x]
- Operating System: [e.g., Windows 10, macOS 12, Ubuntu 20.04]

**📋 Steps to Reproduce**

1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**✅ Expected Behavior** A clear and concise description of what you expected to
happen.

**❌ Actual Behavior** A clear and concise description of what actually
happened.

**💻 Code Sample**

```typescript
// Please provide a minimal code sample that reproduces the issue
import { MetaPixelTracker } from '@azmarifdev/multi-platform-tracking-sdk';

const tracker = new MetaPixelTracker({
    pixelId: 'YOUR_PIXEL_ID',
});

// Your code that triggers the bug
```

**📸 Screenshots** If applicable, add screenshots to help explain your problem.

**🔍 Additional Context**

- Console errors (if any)
- Network requests (if relevant)
- Any other context about the problem

**🔗 Related Issues**

- Link to any related issues or discussions

---

**Checklist before submitting:**

- [ ] I have searched for existing issues
- [ ] I have tested with the latest version
- [ ] I have provided a minimal code sample
- [ ] I have included environment information
