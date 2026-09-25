import { Container } from "@/components/ui/Container";

const steps = [
  {
    title: "Get your estimate",
    description: "See your estimated savings based on your home and electricity use.",
  },
  {
    title: "Site & Solar Plan",
    description: "Our team checks your property and designs your system.",
  },
  {
    title: "Installation",
    description: "We handle permits, installation, and getting your system connected.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-bg-light-muted py-16 md:py-24">
      <Container>
        <h2 className="text-center text-5xl font-extrabold tracking-tight">How it works</h2>
        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-3xl bg-bg-card p-7 ring-1 ring-border-light">
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg-dark text-sm font-bold text-text-on-dark">
                  {index + 1}
                </span>
                <h3 className="text-2xl font-extrabold">{step.title}</h3>
              </div>
              <p className="mt-4 text-text-on-light-muted">{step.description}</p>
            </li>
          ))}
        </ol>
        <p className="mt-4 text-center text-4xl font-extrabold text-text-accent-on-light">Going solar is simple!</p>
      </Container>
    </section>
  );
}
