export class DuplicateShortenedLink extends Error {
  constructor() {
    super('Shortened link already exists');
  }
}
