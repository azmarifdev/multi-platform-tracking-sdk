# Security Policy

## Supported Versions

We release patches for security vulnerabilities. The following table shows which
versions of our project are currently being supported with security updates.

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Multi-Platform Tracking SDK team takes security vulnerabilities seriously.
We appreciate your efforts to responsibly disclose your findings, and will make
every effort to acknowledge your contributions.

### How to Report a Security Vulnerability?

If you believe you have found a security vulnerability in our SDK, please report
it to us through coordinated disclosure.

**Please do not report security vulnerabilities through public GitHub issues,
discussions, or pull requests.**

Instead, please send an email to **security@azmarif.dev** with the following
information:

- Type of issue (e.g. buffer overflow, SQL injection, cross-site scripting,
  etc.)
- Full paths of source file(s) related to the manifestation of the issue
- The location of the affected source code (tag/branch/commit or direct URL)
- Any special configuration required to reproduce the issue
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the issue, including how an attacker might exploit the issue

This information will help us triage your report more quickly.

### What to Expect

You should receive a response from us within **48 hours**. If the issue is
confirmed, we will:

1. **Acknowledge** the vulnerability and confirm receipt of your report
2. **Investigate** the issue and determine its severity
3. **Develop** a fix for the vulnerability
4. **Test** the fix thoroughly
5. **Release** a security update
6. **Credit** you in our security advisory (if you wish)

### Security Update Process

When we receive a security bug report, we will:

- Confirm the problem and determine the affected versions
- Audit code to find any potential similar problems
- Prepare fixes for all releases still under maintenance
- Release new versions as soon as possible

### Disclosure Policy

- We follow a **90-day disclosure deadline**
- We will publish security advisories on GitHub
- We will credit reporters in our advisories (unless they prefer to remain
  anonymous)
- We may coordinate with other security teams if the vulnerability affects
  multiple projects

### Security Best Practices

When using our SDK, please follow these security best practices:

#### For Facebook/Meta Integration

- **Never expose** your Access Token in client-side code
- **Use HTTPS** for all server-side API calls
- **Validate and sanitize** all user input before sending to Conversion API
- **Implement rate limiting** for API calls
- **Regularly rotate** your Access Tokens

#### For Instagram Tracking

- **Respect user privacy** and obtain proper consent
- **Anonymize sensitive data** before tracking
- **Follow platform policies** and guidelines
- **Implement data retention policies**

#### For Google Tag Manager

- **Sanitize dataLayer data** to prevent XSS attacks
- **Use Content Security Policy** (CSP) headers
- **Validate GTM configurations** before deployment
- **Monitor for unauthorized tag modifications**

#### General Security

- **Keep dependencies updated** to latest versions
- **Use TypeScript** for better type safety
- **Implement proper error handling** to avoid information leakage
- **Use environment variables** for sensitive configuration
- **Enable debug mode only** in development environments

### Dependencies Security

We regularly monitor our dependencies for security vulnerabilities using:

- GitHub Security Advisories
- npm audit
- Automated dependency updates
- Security scanning tools

### Compliance

Our SDK is designed to help you comply with:

- **GDPR** (General Data Protection Regulation)
- **CCPA** (California Consumer Privacy Act)
- **PIPEDA** (Personal Information Protection and Electronic Documents Act)
- **Facebook Platform Policies**
- **Google Tag Manager Policies**

### Contact Information

For security-related inquiries:

- **Email**: security@azmarif.dev
- **Response Time**: Within 48 hours
- **Severity Classification**: We follow CVSS 3.1

For general inquiries:

- **Email**: hello@azmarif.dev
- **GitHub Issues**: For non-security related bugs
- **GitHub Discussions**: For questions and feature requests

---

## Security Hall of Fame

We would like to thank the following individuals for responsibly disclosing
security vulnerabilities:

_No vulnerabilities have been reported yet._

---

**Thank you for helping keep Multi-Platform Tracking SDK and our users safe!**
🔐
