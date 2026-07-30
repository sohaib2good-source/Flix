import { useEffect } from 'react';

interface SeoMetadata {
  title: string;
  description: string;
  schema?: Record<string, any>;
  url?: string;
  image?: string;
}

export function useSeoMetadata({ title, description, schema, url, image }: SeoMetadata) {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description);

    // Update Open Graph tags
    const updateOgTag = (property: string, content: string) => {
      let tag = document.querySelector(`meta[property="${property}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute('property', property);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    updateOgTag('og:title', title);
    updateOgTag('og:description', description);
    if (url) updateOgTag('og:url', url);
    if (image) updateOgTag('og:image', image);

    // Update schema markup
    let script = document.querySelector('script[type="application/ld+json"]');
    if (schema) {
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
    } else if (script) {
      script.remove();
    }

    // Cleanup function
    return () => {
      if (script && schema) {
        script.remove();
      }
    };
  }, [title, description, schema, url, image]);
}
