import { type GameContent, contentStatusLabel } from '../content';
export function canPlay(game: GameContent) {
  return (
    game.status === 'Live' &&
    !!game.playUrl &&
    ['functional', 'device-install'].includes(game.verification?.method || '')
  );
}
export function localGame(game: GameContent) {
  return canPlay(game) && /^(?:\/games\/[a-z0-9-]+\.html|\/published\/games\/[a-z0-9-]+\/build\/index\.html)$/.test(game.playUrl || '');
}
export function gameAction(game: GameContent) {
  if (canPlay(game))
    return {
      label: 'Play Now',
      href: localGame(game) ? `/games/${game.slug}/play` : game.playUrl!,
    };
  if (game.status === 'Released' && game.downloadUrl)
    return { label: 'Download', href: game.downloadUrl };
  return { label: 'View Development', href: `/games/${game.slug}` };
}
export function filterGames(
  games: GameContent[],
  query: string,
  genre: string,
  platform: string,
  status: string,
) {
  return games.filter(
    game =>
      (genre === 'All' || game.genre?.includes(genre)) &&
      (platform === 'All' || game.platforms?.includes(platform)) &&
      (status === 'All' || contentStatusLabel(game) === status) &&
      `${game.name} ${game.shortDescription} ${game.tags?.join(' ')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  );
}
