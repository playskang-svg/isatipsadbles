import type { MovingService } from "@/lib/services";

export function ServiceCta({ service }: { service: MovingService }) {
  return (
    <aside className="service-cta" aria-label={service.title}>
      <div>
        <p className="service-kicker"><span>AD</span>{service.eyebrow}</p>
        <h2>{service.title}</h2>
        <p>{service.description}</p>
        <small className="service-disclosure">제휴 링크를 통해 상담하거나 서비스를 이용하면 사이트 운영에 도움이 될 수 있습니다.</small>
      </div>
      <a href={service.url} target="_blank" rel="sponsored noopener noreferrer">
        {service.buttonLabel} <span aria-hidden="true">↗</span>
      </a>
    </aside>
  );
}
