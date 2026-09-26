import { Container } from "@/legacy/phoenix-az2/components/ui/Container";

const steps = [
  {
    title: "Get your estimate",
    description: "Use the simulator above to see your panel count, investment, and monthly savings in real time.",
  },
  {
    title: "Site & solar plan",
    description: "A local crew checks your property and roof, and finalizes a plan sized to your usage.",
  },
  {
    title: "Installation",
    description: "Most systems go up in a single day. We handle permitting and utility interconnection.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-bg-light py-16 md:py-24">
      <Container>
        <h2 className="text-center text-3xl font-extrabold tracking-tight">How it works</h2>
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step.title} className="rounded-2xl bg-bg-card p-6 shadow-sm ring-1 ring-border-light">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-dark text-sm font-bold text-text-on-dark">
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-bold">{step.title}</h3>
              <p className="mt-2 text-sm text-text-on-light-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
