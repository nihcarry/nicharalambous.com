/**
 * Decorative picture that keeps the real file off the img src.
 *
 * React 19 preloads every server-rendered img src, and the first ten of those
 * preloads are high priority. The homepage was doing that for portraits that
 * are hidden on small screens, so a mobile lab run fetched them before the
 * hero could paint.
 *
 * The file the browser should fetch lives on source. The img src is a
 * one-pixel gif, which React does not preload. A media query on source means
 * a phone never requests the desktop file.
 */

const TRANSPARENT_PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";

export interface DecorativeSource {
  type?: string;
  srcSet: string;
  sizes?: string;
  media?: string;
}

interface DecorativePictureProps {
  sources: DecorativeSource[];
  width: number;
  height: number;
  className?: string;
  imgClassName?: string;
  loading?: "lazy" | "eager";
}

export function DecorativePicture({
  sources,
  width,
  height,
  className,
  imgClassName,
  loading,
}: DecorativePictureProps) {
  return (
    <picture className={className}>
      {sources.map((source) => (
        <source
          key={`${source.type ?? "any"}|${source.media ?? ""}|${source.srcSet}`}
          type={source.type}
          srcSet={source.srcSet}
          sizes={source.sizes}
          media={source.media}
        />
      ))}
      {/* Real URL is on source, so this img must not point at the file. */}
      <img
        src={TRANSPARENT_PIXEL}
        alt=""
        width={width}
        height={height}
        loading={loading}
        decoding="async"
        className={imgClassName}
      />
    </picture>
  );
}
