# Back-end and DevOps

## 🚀 Features and Rules

- [x] It must be possible to create a link
  - [x] It must not be possible to create a link with improperly formatted shortening
  - [x] It must not be possible to create a link with an already existing shortening
- [x] It must be possible to delete a link
- [x] It must be possible to retrieve the original URL through the shortening
- [x] It must be possible to list all registered URLs
- [x] It must be possible to increment the number of accesses to a link
- [ ] It must be possible to download a CSV with the report of the created links
  - [ ] It must be possible to access the CSV via a CDN (Amazon S3, Cloudflare R2, etc.)
  - [ ] A random and unique name must be generated for the file
  - [ ] It must be possible to list the URLs in a performant way
  - [ ] The CSV must include fields such as original URL, shortened URL, access count, and creation date
