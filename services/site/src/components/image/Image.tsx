import getConfig from "next/config";
import { default as NextImage, ImageLoaderProps, ImageProps } from "next/image";

export function imageLoader({ src, width, quality }: Omit<ImageLoaderProps, "config">): string {
  const { publicRuntimeConfig } = getConfig();

  const assetDomain = publicRuntimeConfig.assetBaseUrl;
  const prefixedSource = assetDomain ? assetDomain + src : src;

  // copied from: https://github.com/vercel/next.js/blob/canary/packages/next/client/image.tsx#L709
  return `/_next/image?url=${encodeURIComponent(prefixedSource)}&w=${width}&q=${quality || 75}`;
}

const Image: React.FunctionComponent<ImageProps> = (props) => <NextImage loader={imageLoader} {...props} />;

export default Image;
