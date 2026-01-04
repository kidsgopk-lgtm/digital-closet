# 🔄 Dev Server Restart Guide

## Quick Restart

Run this command in your terminal:

```bash
bun run restart
```

Or manually run the script:

```bash
./restart-dev.sh
```

## What the Restart Script Does

1. **Stops the dev server** - Safely terminates any running `bun run dev` process
2. **Clears caches** - Removes `.next` build directory and `node_modules/.cache`
3. **Restarts the server** - Starts fresh dev server at http://localhost:3000

## Why Restart is Needed Sometimes

When you make significant changes or when Next.js build cache gets corrupted:
- Old import paths stay in cache
- Missing vendor chunk errors appear
- File changes aren't detected properly

A clean restart resolves all these issues.

## Your Files are Correct ✅

Both `clothing-card.tsx` and `upload-modal.tsx` have been fixed:

```typescript
// clothing-card.tsx - Line 17
import { toast } from '@/hooks/use-toast';  // ✅ Correct

// upload-modal.tsx - Line 11
import { toast } from '@/hooks/use-toast';  // ✅ Correct
```

After restart, your **Digital Closet** app will work perfectly!

---

## Available Commands

- `bun run dev` - Start dev server
- `bun run restart` - Restart dev server (clears cache)
- `bun run lint` - Run ESLint
- `bun run build` - Build for production

---

**Note:** The restart script requires you to stop the current dev server manually (Ctrl+C) before running it.
