import { affiliateRel, affiliateTarget } from "@/lib/affiliate";
import { coupangUrl } from "@/lib/coupang-links";

export function MaterialPicks({ items }: { items: { q: string; why: string }[] }) {
  return (
    <div className="material-picks">
      <strong>준비물</strong>
      <ul>
        {items.map((item) => {
          const url = coupangUrl(item.q);
          return (
            <li key={item.q}>
              <span className="material-name">{item.q}</span>
              <span className="material-why">{item.why}</span>
              {url && <a href={url} target={affiliateTarget} rel={affiliateRel}>쿠팡에서 가격 보기 <span aria-hidden="true">↗</span></a>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
