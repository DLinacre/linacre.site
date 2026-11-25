import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import GameShowcase from '../GameShowcase';
import { games } from '../../content';
const game = games.find(record => record.id === 'slime-factory-tycoon')!;

describe('GameShowcase canonical content', () => {
  it('renders actual identity, status and honest media/launch labels', () => {
    render(<GameShowcase />);
    expect(screen.getByRole('heading', { name: game.name })).toBeInTheDocument();
    expect(screen.getByText('In Development')).toBeInTheDocument();
    expect(screen.getByText('No screenshots available')).toBeInTheDocument();
    expect(screen.getByText('Not yet published')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.queryByRole('link', { name: /Play/ })).not.toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(
      /[\d,.]+\s*(players|visits|downloads|installs)\b/i,
    );
  });
  it('links to the actual Studio artifact and source', () => {
    render(<GameShowcase />);
    expect(screen.getByRole('link', { name: /Download Roblox Studio template/ })).toHaveAttribute(
      'href',
      game.downloadUrl,
    );
    expect(screen.getByRole('link', { name: 'Source' })).toHaveAttribute(
      'href',
      game.sourceRepository,
    );
  });
  it('retains accessible tab keyboard navigation and structured development details', async () => {
    const user = userEvent.setup();
    render(<GameShowcase />);
    const tabs = within(screen.getByRole('tablist')).getAllByRole('tab');
    expect(tabs).toHaveLength(4);
    tabs[0].focus();
    await user.keyboard('{ArrowRight}');
    expect(tabs[1]).toHaveAttribute('aria-selected', 'true');
    expect(tabs.filter(tab => tab.getAttribute('tabindex') === '0')).toHaveLength(1);
    expect(screen.getByRole('tabpanel')).toHaveAttribute('aria-labelledby', tabs[1].id);
    await user.keyboard('{End}');
    expect(tabs[3]).toHaveFocus();
    await user.keyboard('{Home}');
    expect(tabs[0]).toHaveFocus();
  });
});
