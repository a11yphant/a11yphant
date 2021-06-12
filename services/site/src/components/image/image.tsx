import { default as NextImage, ImageLoaderProps, ImageProps } from "next/image";

export function imageLoader({ src, width, quality }: ImageLoaderProps): string {
  const assetDomain = process.env.NEXT_PUBLIC_SITE_ASSET_BASE_URL;

  // copied from: https://github.com/vercel/next.js/blob/canary/packages/next/client/image.tsx#L709
  return `/_next/image?url=${encodeURIComponent(`${assetDomain}${src}`)}&w=${width}&q=${quality || 75}`;
}

const Image: React.FunctionComponent<ImageProps> = (props) => <NextImage loader={imageLoader} {...props} />;

export default Image;
