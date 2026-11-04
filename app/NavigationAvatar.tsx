const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function NavigationAvatar({ alt = "", size = 34 }: { alt?: string; size?: number }) {
  // A pre-sized static asset needs no runtime optimizer or exporter-generated srcset.
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`${base}/images/rui-wang-avatar-192.webp`} alt={alt} width={size} height={size} loading="eager" fetchPriority="high" decoding="async" />;
}
