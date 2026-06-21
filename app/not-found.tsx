import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <section className="site-container grid min-h-[80vh] place-items-center pt-24 text-center"><div><p className="font-mono text-sm text-accent">404 / MISLOADED</p><h1 className="hero-title mt-5">Wrong rack.</h1><p className="mx-auto mt-5 max-w-md text-secondary">That page is not on the floor. Head back and choose another station.</p><Button href="/" className="mt-8">Return home</Button></div></section>;
}
