import Image from 'next/image';

export default function HomePage() {
  return (
    <main className="shell center-page">
      <section className="home-card">
        <Image
          className="app-icon"
          src="/ramap-app-icon.png"
          width={112}
          height={112}
          priority
          alt="라맵 앱 아이콘"
        />
        <p className="eyebrow">라맵</p>
        <h1>라오타가 만든 대한민국 라멘 지도</h1>
        <p className="lead">앱이 설치되어 있다면 바로 열 수 있어요.</p>
        <p className="lead">
          열리지 않으면 아래 스토어에서 설치 후 다시 시도해 주세요.
        </p>
      </section>
    </main>
  );
}
