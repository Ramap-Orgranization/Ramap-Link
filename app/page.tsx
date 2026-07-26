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
        <p className="eyebrow">RAMAP</p>
        <h1>라멘을 위한 지도</h1>
        <p className="lead">
          공유받은 매장 링크는 Android 또는 iPhone에서 라맵 앱으로 열 수 있어요.
        </p>
      </section>
    </main>
  );
}
