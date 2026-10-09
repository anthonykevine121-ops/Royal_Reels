# Google SEO setup

This site is deployed as a static HTML site on Vercel at
`https://royalreels-pearl.vercel.app/`. Its canonical origin, sitemap, and
structured-data URLs currently use that Vercel domain.

## Included

- Page-specific titles, descriptions, canonicals, robots directives, Open Graph,
  and X/Twitter card metadata on the HTML pages.
- `ProfessionalService` and `WebSite` JSON-LD on the homepage. Keep structured
  data accurate and consistent with visible site content; do not add unverified
  street addresses, opening hours, or ratings.
- Root `robots.txt` and `sitemap.xml`. The sitemap lists the indexable homepage,
  about, gallery, and rate-card pages. The booking form is intentionally
  `noindex, follow` and is not in the sitemap.
- The existing Google Search Console verification meta tag on the homepage is
  retained.

## Submit the site to Google

1. Deploy these files to the production Vercel deployment and confirm that the
   production domain serves the updated HTML, `/robots.txt`, and `/sitemap.xml`
   over HTTPS. Preview deployments are not the canonical site.
2. In [Google Search Console](https://search.google.com/search-console/), add
   `https://royalreels-pearl.vercel.app/` as a **URL-prefix property**. Verify
   ownership using the existing homepage HTML meta tag if Google accepts it;
   otherwise use the verification method Search Console provides and publish
   its supplied token/file. Do not remove the existing tag unless replacing it
   with the token for the verified property.
3. In Search Console, open **Sitemaps**, enter `sitemap.xml`, and submit it.
   Check the reported status and resolve any fetch or URL errors.
4. Use **URL Inspection** on the homepage and the important service pages:
   `/`, `/gallery.html`, `/rate-card.html`, and `/about.html`. Run **Test Live
   URL** first, then choose **Request Indexing** for each page that is available
   and eligible for indexing.
5. Recheck the Page Indexing and Sitemaps reports over the following days.
   Crawling and indexing are controlled by Google and are not guaranteed by
   sitemap submission or an indexing request.

If the production domain changes, update the canonical URLs, Open Graph URLs,
JSON-LD identifiers and URLs, `robots.txt` Sitemap URL, and every `<loc>` in
`sitemap.xml` to the new HTTPS origin. Then verify the new property in Search
Console and submit its sitemap. Keep the old domain available with permanent
redirects to the corresponding new URLs where possible.
