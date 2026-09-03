import Link from "next/link";
export default function NotFound() { return <section className="not-found"><div><span>404</span><h1>찾으시는 글이 없습니다.</h1><p>주소가 바뀌었거나 아직 준비 중인 글일 수 있습니다.</p><Link href="/" className="primary-button dark-button">홈으로 돌아가기</Link></div></section>; }
