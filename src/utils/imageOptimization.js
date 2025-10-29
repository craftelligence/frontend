// Image optimization utilities
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

export const preloadImages = (imageSources) => {
  return Promise.all(imageSources.map(preloadImage));
};

// Lazy loading hook
export const useLazyLoading = (threshold = 0.1) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const ref = React.useRef();

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasLoaded) {
          setIsIntersecting(true);
          setHasLoaded(true);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, hasLoaded]);

  return [ref, isIntersecting];
};

// Image optimization component
export const OptimizedImage = ({ src, alt, className, ...props }) => {
  const [ref, isIntersecting] = useLazyLoading();
  const [imageLoaded, setImageLoaded] = React.useState(false);

  React.useEffect(() => {
    if (isIntersecting) {
      const img = new Image();
      img.onload = () => setImageLoaded(true);
      img.src = src;
    }
  }, [isIntersecting, src]);

  return (
    <div ref={ref} className={className} {...props}>
      {isIntersecting && (
        <img
          src={src}
          alt={alt}
          style={{
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease'
          }}
          loading="lazy"
        />
      )}
    </div>
  );
};
