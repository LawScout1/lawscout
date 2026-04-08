# LawScout Premium Merge

This version keeps the premium LawScout navy-and-gold design while adding:

- working AI legal question flow
- free preview
- premium locked report
- PayPal unlock on the answer page
- Vercel serverless backend in `api/ask.js`

## Setup

1. Upload all files to GitHub.
2. In Vercel, add environment variable:

   OPENAI_API_KEY=your_real_key

3. Redeploy.
4. Test:
   - homepage question box
   - answer page preview
   - PayPal unlock

## Notes

- This uses a Vercel-only setup.
- No Python backend is needed.
- LawScout provides general legal information only.
