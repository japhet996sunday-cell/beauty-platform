export function initInfiniteScroll({ sentinel, onLoadMore, rootMargin = "400px" }) {
  let isLoading = false;

  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      if (entry.isIntersecting && !isLoading) {
        isLoading = true;
        Promise.resolve(onLoadMore()).finally(() => {
          isLoading = false;
        });
      }
    },
    { rootMargin }
  );

  observer.observe(sentinel);
  return observer;
}

