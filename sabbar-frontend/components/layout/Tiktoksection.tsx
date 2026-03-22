'use client';

import Link from 'next/link';

export default function TikTokSection() {
  const tiktokVideos = [
    {
      id: 'tiktok_1',
      username: '@SabbarImmobilier',
      title: 'Conseil immobilier #1'
    },
    {
      id: 'tiktok_2',
      username: '@SabbarImmobilier',
      title: 'Success story #1'
    },
    {
      id: 'tiktok_3',
      username: '@SabbarImmobilier',
      title: 'Visite propriété'
    },
    {
      id: 'tiktok_4',
      username: '@SabbarImmobilier',
      title: 'Conseils vente'
    }
  ];

  return (
    <section className="py-24 bg-fond-50 border-t border-sabbar-700/20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-sabbar-900 mb-4">
            Rejoignez-nous sur TikTok
          </h2>
          <p className="text-xl text-sabbar-700 max-w-2xl mx-auto">
            Découvrez nos conseils immobiliers et success stories
          </p>
        </div>

        {/* Grid vidéos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {tiktokVideos.map((video) => (
            <div
              key={video.id}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-sabbar-200"
            >
              {/* Placeholder for TikTok embed */}
              <div className="aspect-video bg-gradient-to-br from-sabbar-100 to-sabbar-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2">🎬</div>
                  <p className="text-sm text-sabbar-700 font-semibold">{video.title}</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-sm text-sabbar-600">{video.username}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="https://www.tiktok.com/@SabbarImmobilier"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-turquoise-600 to-turquoise-500 hover:from-turquoise-500 hover:to-turquoise-400 text-white font-bold rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            🎬 S'abonner sur TikTok
          </Link>
        </div>
      </div>
    </section>
  );
}