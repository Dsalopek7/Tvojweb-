import type { Metadata } from 'next';
import Wizard from '@/components/discovery/Wizard';

export const metadata: Metadata = {
  title: 'DS7 Discovery Engine — Otkrij svoj idealan web',
  description:
    'Odgovori na kratka pitanja i saznaj kakav web odgovara tvojoj djelatnosti. Brzo, jednostavno, bez tehničkog znanja.',
};

export default function DiscoveryPage() {
  return <Wizard />;
}
