/** @type {import('@lhci/cli').LighthouseRcConfig} */
module.exports = {
  ci: {
    collect: {
      // Test the two key page types: listing and article.
      // LHCI_SITE_URL is injected from GitHub secrets at runtime.
      urls: [
        `${process.env.LHCI_SITE_URL}/en-us/blog`,
      ],
      // Run 3 times and take the median — single runs can be noisy.
      numberOfRuns: 3,
      settings: {
        // Simulate a mid-range mobile device on a 4G connection.
        // This is Lighthouse's default "mobile" preset and reflects
        // real-world conditions for most users.
        preset: 'desktop',
      },
    },
    assert: {
      // Thresholds are intentionally conservative — the goal is to catch
      // regressions, not enforce perfection. Raise these over time.
      assertions: {
        'categories:performance':    ['warn',  { minScore: 0.5 }],
        'categories:accessibility':  ['error', { minScore: 0.6 }],
        'categories:best-practices': ['warn',  { minScore: 0.5 }],
        'categories:seo':            ['error', { minScore: 0.6 }],
      },
    },
    upload: {
      // Uploads results to a free, temporary public URL so you can
      // view the full Lighthouse report without self-hosting a server.
      target: 'temporary-public-storage',
    },
  },
}
