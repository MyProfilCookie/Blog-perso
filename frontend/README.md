# Next.js & NextUI Template

This is a template for creating applications using Next.js 14 (app directory) and NextUI (v2).

[Try it on CodeSandbox](https://githubbox.com/nextui-org/next-app-template)

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Use the template with create-next-app

To create a new project based on this template using `create-next-app`, run the following command:

```bash
npx create-next-app -e https://github.com/nextui-org/next-app-template
```

### Install dependencies

You can use one of them `npm`, `yarn`, `pnpm`, `bun`, Example using `npm`:

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

### Production build & Safari compatibility

This project runs a post-build Babel transform to strip optional chaining,
nullish coalescing, and related modern syntax from the generated bundles. This
keeps the output compatible with older Safari versions. The step is triggered
automatically after each production build:

```bash
npm run build
```

If you inspect the files inside `.next/`, you should no longer find `?.`, `??`,
or `??=` in the compiled JavaScript. The logic lives in
`scripts/postbuild-transform.js` and depends on the Babel CLI listed in
`devDependencies`.

## Project Updates (AutiStudy)

- Home CTA clarified: adds subtitle under `Commencer gratuitement` indicating a 7‑day full trial without commitment.
- Alia explanation: concrete examples block added to show how the IA adapts activities (sensory sensitivities, interests like dinosaurs).
- Shop header: explanatory header clarifies the shop offers complementary one‑off products vs. platform subscription.
- Testimonials note: clarifies Benjamin is both founder and father to avoid confusion.
- Avatars update: home page now uses updated images for Marie and Thomas with cache‑busting query strings.

### Relevant source locations

- `app/page.tsx:247` CTA subtitle text
- `app/page.tsx:324` Alia examples block
- `app/page.tsx:183` and `app/page.tsx:190` avatars with `?v=`
- `app/shop/page.tsx:18` shop header
- `app/page.tsx:483` testimonials clarification

### Deployment

- Production deployments performed with `npx vercel --prod --yes`.

### Setup pnpm (optional)

If you are using `pnpm`, you need to add the following code to your `.npmrc` file:

```bash
public-hoist-pattern[]=*@nextui-org/*
```

After modifying the `.npmrc` file, you need to run `pnpm install` again to ensure that the dependencies are installed correctly.

## License

Licensed under the [MIT license](https://github.com/nextui-org/next-app-template/blob/main/LICENSE).
