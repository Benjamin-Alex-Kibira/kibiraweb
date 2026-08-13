# K I B I R A

Lightweight static creative-studio website for Gevurah Pictures and The Rich Art Guy.

The gallery placeholders load remote image URLs from `images.json`, then rotate automatically in the browser. GitHub Actions refreshes that feed every six hours by reading the public preview pages for [Gevurah Pictures](https://t.me/gevurahpictures) and [eatAfrica](https://t.me/eatAfrica).

The site does not store image files in this repository. If Telegram changes its public preview markup or a channel is private, the feed stays on its last successful update.
