export class ShortenedLinkNotAvailable extends Error {
  constructor() {
    super('Shortened link does not exist');
  }
}
