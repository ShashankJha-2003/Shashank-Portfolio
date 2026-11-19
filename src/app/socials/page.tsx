import type { Metadata } from 'next';
import SocialsPageClient from '../../components/museum/SocialsPageClient';

export const metadata: Metadata = {
  title: 'Social Links — Shashank Jha | The Digital Museum',
  description:
    'Connect with Shashank Jha across Instagram, Facebook, Pinterest, GitHub, and LinkedIn in the dedicated Social Archive wing of The Digital Museum.',
  openGraph: {
    title: 'Social Links — Shashank Jha | The Digital Museum',
    description:
      'Connect with Shashank Jha across Instagram, Facebook, Pinterest, GitHub, and LinkedIn.',
    type: 'website',
  },
};

export default function SocialsPage() {
  return <SocialsPageClient />;
}

