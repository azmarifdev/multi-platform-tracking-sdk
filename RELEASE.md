# 🚀 Release Guide

This guide explains how to create releases for the Multi-Platform Tracking SDK.

## 📋 Prerequisites

1. **NPM Account**: You need access to publish
   `@azmarifdev/multi-platform-tracking-sdk`
2. **GitHub Access**: Push access to the repository
3. **NPM Token**: Set up in GitHub Secrets as `NPM_TOKEN`

## 🎯 Release Types

### Patch Release (Bug Fixes)

```bash
npm run release:patch
```

- Bug fixes
- Documentation updates
- Minor improvements
- Version: 1.1.0 → 1.1.1

### Minor Release (New Features)

```bash
npm run release:minor
```

- New features
- New platform support
- API additions (non-breaking)
- Version: 1.1.0 → 1.2.0

### Major Release (Breaking Changes)

```bash
npm run release:major
```

- Breaking API changes
- Major refactoring
- Platform API changes
- Version: 1.1.0 → 2.0.0

## 🔄 Automatic Release Process

### Step 1: Prepare Release

```bash
# 1. Ensure you're on main branch
git checkout main
git pull origin main

# 2. Run quality checks
npm run quality

# 3. Run all tests
npm run test:ci

# 4. Build package
npm run build
```

### Step 2: Update Changelog

Edit `CHANGELOG.md`:

```markdown
## [1.2.0] - 2025-08-11

### Added

- New Instagram Stories tracking
- Enhanced GTM integration

### Changed

- Improved error handling

### Fixed

- Bug in conversion tracking
```

### Step 3: Create Release

```bash
# For new features (most common)
npm run release:minor

# This will:
# ✅ Run tests and quality checks
# ✅ Update version in package.json
# ✅ Create git tag (e.g., v1.2.0)
# ✅ Push to GitHub
# ✅ Trigger CI/CD pipeline
# ✅ Create GitHub Release
# ✅ Publish to NPM
```

## 🤖 What Happens Automatically

When you push a version tag, GitHub Actions will:

1. **Testing**: Run all tests on Node 16, 18, 20
2. **Quality**: ESLint, Prettier, TypeScript checks
3. **Build**: Create distribution files
4. **Release**: Create GitHub release with changelog
5. **Publish**: Publish to NPM registry

## 🔧 Manual Release (If Needed)

### GitHub Release

```bash
# Create release on GitHub
gh release create v1.2.0 \
  --title "Multi-Platform Tracking SDK v1.2.0" \
  --notes "See CHANGELOG.md for details"
```

### NPM Publish

```bash
# Build and publish manually
npm run build
npm publish
```

## 📊 Release Checklist

### Before Release

- [ ] All tests passing
- [ ] Quality checks pass
- [ ] Documentation updated
- [ ] CHANGELOG.md updated
- [ ] Version number appropriate
- [ ] Breaking changes documented

### After Release

- [ ] GitHub release created
- [ ] NPM package published
- [ ] Documentation deployed
- [ ] Community notified
- [ ] Social media posts (optional)

## 🚨 Rollback Process

### NPM Rollback

```bash
# Deprecate a version (if urgent)
npm deprecate @azmarifdev/multi-platform-tracking-sdk@1.2.0 "Critical bug - use 1.1.9"

# Or unpublish (within 24 hours only)
npm unpublish @azmarifdev/multi-platform-tracking-sdk@1.2.0
```

### GitHub Rollback

```bash
# Delete a release
gh release delete v1.2.0

# Delete a tag
git tag -d v1.2.0
git push origin :refs/tags/v1.2.0
```

## 📈 Release Schedule

### Regular Schedule

- **Patch releases**: As needed for bugs
- **Minor releases**: Monthly with new features
- **Major releases**: Quarterly or for breaking changes

### Emergency Releases

- Security vulnerabilities: Immediate
- Critical bugs: Within 24 hours
- Platform API changes: Within 1 week

## 🔐 Security Releases

For security vulnerabilities:

1. **Private Fix**: Fix in private branch
2. **Security Advisory**: Create GitHub security advisory
3. **Coordinated Release**: Release fix and advisory together
4. **Immediate Notification**: Notify users immediately

## 📞 Support

### Release Issues

- **GitHub Issues**: Technical problems
- **Email**: security@azmarif.dev for security issues
- **Discussions**: General questions

### Monitoring

- **NPM Downloads**:
  https://npmjs.com/package/@azmarifdev/multi-platform-tracking-sdk
- **GitHub Actions**: Check CI/CD status
- **GitHub Releases**: Monitor release metrics

---

## 🎉 Example Release Commands

```bash
# Quick patch release
npm run release:patch

# Check what version would be next
npm run release:dry

# Full manual process
git checkout main
git pull origin main
npm run quality
npm run test:ci
npm version minor
git push origin main --tags
```

That's it! Your release will be automatically built and published. 🚀
