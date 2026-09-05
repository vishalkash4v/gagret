Go4Task logo assets

1) Header/Footer (no code change required if your code already uses /go4task-logo.png):
   - Replace public/go4task-logo.png with the supplied go4task-logo.png.
   - It is the original 2048x682 transparent logo, optimized as PNG.

2) Optional HD master:
   - public/go4task-logo-hd.png
   - If you change your React code to use this file, use the same existing CSS sizing.
   - Do NOT enlarge the logo with CSS beyond its intended display size.

3) Favicon:
   - Replace public/favicon.ico with supplied favicon.ico.
   - favicon.png is also supplied at 512x512.
   - apple-touch-icon.png, android-chrome-192x192.png and android-chrome-512x512.png are supplied for mobile/home-screen use.

4) Root HTML:
   Make sure src/routes/__root.tsx references:
     { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
     { rel: "shortcut icon", href: "/favicon.ico", type: "image/x-icon" },
     { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },

The main logo is already transparent, so it should work on both light and colored backgrounds.
