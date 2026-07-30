import { useEffect } from 'react';

export type RouteMeta = {
  title: string;
  description: string;
  canonical: string;
  index: boolean;
  image?: string;
};

const upsert = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (!element) {
    element = document.createElement(attributes.rel ? 'link' : 'meta');
    document.head.appendChild(element);
  }
  Object.entries(attributes).forEach(([name, value]) => element!.setAttribute(name, value));
};

/**
 * Client-side head synchronisation.
 * Essential for dynamic updates on client transitions, paired with build-time pre-rendering.
 */
export function RouteHead({ meta }: { meta: RouteMeta }) {
  useEffect(() => {
    document.title = meta.title;
    upsert('meta[name="description"]', { name: 'description', content: meta.description });
    upsert('meta[name="robots"]', {
      name: 'robots',
      content: meta.index ? 'index,follow' : 'noindex,nofollow',
    });
    upsert('link[rel="canonical"]', { rel: 'canonical', href: meta.canonical });
    upsert('meta[property="og:title"]', { property: 'og:title', content: meta.title });
    upsert('meta[property="og:description"]', {
      property: 'og:description',
      content: meta.description,
    });
    upsert('meta[property="og:url"]', { property: 'og:url', content: meta.canonical });
    upsert('meta[property="og:image"]', {
      property: 'og:image',
      content: meta.image ?? 'https://www.linacre.site/og.png',
    });
    upsert('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsert('meta[name="twitter:title"]', { name: 'twitter:title', content: meta.title });
    upsert('meta[name="twitter:description"]', {
      name: 'twitter:description',
      content: meta.description,
    });
  }, [meta]);
  return null;
}
