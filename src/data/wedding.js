// Wedding data for Rachmatulla & Devy Puspita
export const WEDDING = {
  groom: {
    name: 'Rachmatulla',
    nick: 'Rachmat',
    father: 'Moh. Nahir Sidik',
    mother: 'Tarmini',
  },
  bride: {
    name: 'Devy Puspita',
    nick: 'Devy',
    father: 'Margono',
    mother: 'Sudarmi',
  },
  events: [
    {
      key: 'resepsi',
      tag: '01 · RESEPSI',
      title: 'Resepsi Pernikahan',
      date: 'Minggu, 24 Mei 2026',
      isoDate: '2026-05-24T10:00:00+07:00',
      time: '10.00 WIB — selesai',
      venue: 'Kediaman Mempelai Wanita',
      address: 'Jl. Salak, Gondang, Tanjung, Kertosono, Nganjuk',
      mapsQuery: 'Jl. Salak, Gondang, Tanjung, Kertosono, Nganjuk',
      mapsLink: 'https://maps.app.goo.gl/QsUsvAsUt97PFSbw5',
    },
    {
      key: 'ngunduh',
      tag: '02 · NGUNDUH MANTU',
      title: 'Ngunduh Mantu',
      date: 'Sabtu, 30 Mei 2026',
      isoDate: '2026-05-30T10:00:00+07:00',
      time: '10.00 WIB — selesai',
      venue: 'Kediaman Mempelai Pria',
      address: 'Jl. Letjen Suprapto No. 195, Jatirejo, Nganjuk',
      mapsQuery: 'Jl. Letjen Suprapto No. 195, Jatirejo, Nganjuk',
      mapsLink: 'https://maps.app.goo.gl/USy8KwoN4v6QcoA39',
    },
  ],
  countdownTarget: '2026-05-24T10:00:00+07:00',
  monogram: 'R & D',
  heroTitle: 'Rachmatulla & Devy Puspita',
  heroDates: '24 Mei 2026 · 30 Mei 2026',
};

export const ASSETS = {
  heroVideo: process.env.PUBLIC_URL + '/assets/hero-video.mp4',
  coupleBg: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1920&q=80',
  silhouette: 'https://images.unsplash.com/photo-1591969852023-190295e484bd?auto=format&fit=crop&w=1600&q=80',
  rose: 'https://images.unsplash.com/photo-1761594078262-f06e7791b0be?auto=format&fit=crop&w=800&q=80',
  whiteRose: 'https://images.unsplash.com/photo-1761249841897-1f2bd37c4184?auto=format&fit=crop&w=800&q=80',
  venue: 'https://images.unsplash.com/photo-1510076857177-7470076d4098?auto=format&fit=crop&w=1600&q=80',
  slide1: process.env.PUBLIC_URL + '/assets/slide1.webp',
  slide2: process.env.PUBLIC_URL + '/assets/slide2.webp',
  slide3: process.env.PUBLIC_URL + '/assets/slide3.webp',
};
