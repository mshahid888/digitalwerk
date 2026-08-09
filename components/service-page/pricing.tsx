export type PricingContent = {
  price: string;
  period: string;
  secondaryPrice?: string;
  secondaryPeriod?: string;
  note?: string | string[];
};

export function ServicePricing({ pricing }: { pricing: PricingContent }) {
  const notes = pricing.note
    ? Array.isArray(pricing.note)
      ? pricing.note
      : [pricing.note]
    : [];

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex flex-wrap items-baseline justify-center gap-x-2 gap-y-1">
        <span className="text-2xl font-semibold text-primary-900 md:text-3xl">
          {pricing.price}
        </span>
        <span className="text-base text-slate-500">{pricing.period}</span>
        {pricing.secondaryPrice ? (
          <>
            <span className="text-base text-slate-400" aria-hidden="true">
              +
            </span>
            <span className="text-2xl font-semibold text-primary-900 md:text-3xl">
              {pricing.secondaryPrice}
            </span>
            {pricing.secondaryPeriod ? (
              <span className="text-base text-slate-500">
                {pricing.secondaryPeriod}
              </span>
            ) : null}
          </>
        ) : null}
      </div>
      {notes.map((line) => (
        <p key={line} className="max-w-md text-sm text-slate-500">
          {line}
        </p>
      ))}
    </div>
  );
}
