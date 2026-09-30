import { TopRow } from "@/components/home/top-row";
import { HomeHero } from "@/components/home/hero";
import { V2Index } from "@/components/v2/work-index";
import { V2About } from "@/components/v2/about";
import { V2Footer } from "@/components/v2/footer";
import { projects } from "@/lib/data";

/**
 * 메인.
 *
 * 규칙은 셋이다.
 *   - 들어오자마자 무엇을 만드는 사람인지, 무엇을 만들었는지가 보인다. 거쳐야 하는 연출이 없다.
 *   - 장식을 더하지 않는다. 타이포·여백·정렬로 끝낸다. 강조색은 하나.
 *   - 개성은 두 곳에만 — 만든 것들이 켜지는 모니터, 목록 위에서 떠오르는 제품 화면.
 */
export default function Home() {
  return (
    <div className="v2">
      <TopRow />
      <main>
        <HomeHero count={projects.length} />
        <V2Index />
        <V2About />
      </main>
      <V2Footer />
    </div>
  );
}
