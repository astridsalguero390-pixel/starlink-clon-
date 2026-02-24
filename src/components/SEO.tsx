import { useEffect } from "react";

interface SEOProps {
    title: string;
    description: string;
    canonical?: string;
    ogImage?: string;
    noIndex?: boolean;
}

const BASE_URL = "https://starlink.com.hn"; // change to production domain

const SEO = ({
    title,
    description,
    canonical,
    ogImage = "/apple-touch-icon.png",
    noIndex = false,
}: SEOProps) => {
    useEffect(() => {
        // Title
        document.title = title;

        const setMeta = (name: string, content: string, attr = "name") => {
            let el = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null;
            if (!el) {
                el = document.createElement("meta");
                el.setAttribute(attr, name);
                document.head.appendChild(el);
            }
            el.setAttribute("content", content);
        };

        const setLink = (rel: string, href: string) => {
            let el = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
            if (!el) {
                el = document.createElement("link");
                el.setAttribute("rel", rel);
                document.head.appendChild(el);
            }
            el.setAttribute("href", href);
        };

        // Standard
        setMeta("description", description);
        setMeta("robots", noIndex ? "noindex,nofollow" : "index,follow");

        // Canonical
        setLink("canonical", canonical ? `${BASE_URL}${canonical}` : `${BASE_URL}${window.location.pathname}`);

        // Open Graph
        setMeta("og:title", title, "property");
        setMeta("og:description", description, "property");
        setMeta("og:type", "website", "property");
        setMeta("og:url", `${BASE_URL}${window.location.pathname}`, "property");
        setMeta("og:image", `${BASE_URL}${ogImage}`, "property");
        setMeta("og:site_name", "Starlink Honduras", "property");
        setMeta("og:locale", "es_HN", "property");

        // Twitter
        setMeta("twitter:card", "summary_large_image");
        setMeta("twitter:title", title);
        setMeta("twitter:description", description);
        setMeta("twitter:image", `${BASE_URL}${ogImage}`);
    }, [title, description, canonical, ogImage, noIndex]);

    return null;
};

export default SEO;
