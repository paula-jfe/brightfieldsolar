import type { CityData } from "@/data/types";
import { Container } from "@/components/ui/Container";

/**
 * Three steps, per the brief. Step 2 pulls the permit time from the city
 * data (avgPermitDays), so the full timeline reads in the same order as the
 * FAQ answer: permit -> one-day install -> utility interconnection.
 */
export function HowItWorks({ city }: { city: CityData }) {
  const steps = [
    {
      title: "Get your estimate",
      description: "Use the simulator above to see your panel count, investment, and monthly savings in real time.",
    },
    {
      title: "Site & solar plan",
      description: `A local crew checks your roof and finalizes a plan sized to your usage. We file the city permit, which averages ${city.avgPermitDays} days in ${city.city}.`,
    },
    {
      title: "Installation",
      description:
        "Most systems go up in a single day. We handle the utility interconnection, which adds a week or two.",
    },
  ];

  return (
    <section id="how-it-works" className="bg-bg-light py-14 md:py-20 lg:py-24">
      <Container>
        <h2 className="font-display text-left text-[32px] font-extrabold leading-[1.15] tracking-tight md:text-4xl lg:text-center">
          How it works
        </h2>
        <ol className="mt-8 grid gap-6 md:mt-10 lg:mt-12 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-bg-card p-7 ring-1 ring-border-light"
            >
              <div className="flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-bg-dark font-semibold text-text-on-dark">
                  {index + 1}
                </span>
                <h3 className="font-display text-2xl font-extrabold leading-[30px]">{step.title}</h3>
              </div>
              <p className="leading-6 text-text-on-light-muted">{step.description}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
