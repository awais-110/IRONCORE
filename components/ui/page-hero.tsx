export function PageHero({ index, eyebrow, title, body }: { index: string; eyebrow: string; title: string; body: string }) {
  return (
    <section className="border-b border-hairline pt-36 md:pt-44">
      <div className="site-container grid min-h-[52vh] grid-cols-1 content-end gap-8 pb-16 md:grid-cols-12 md:pb-24">
        <div className="md:col-span-2">
          <span className="font-mono text-xs text-accent">{index}</span>
        </div>
        <div className="md:col-span-8">
          <p className="eyebrow mb-5">{eyebrow}</p>
          <h1 className="hero-title max-w-5xl">{title}</h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-secondary">{body}</p>
        </div>
      </div>
    </section>
  );
}
