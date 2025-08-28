import { getBenefitsData } from '@/lib/benefitsAPI';
import BenefitsClient from './BenefitsClient';

export default async function BenefitsPage() {
  // Server Componentでデータ取得
  const { benefits, realBenefits } = await getBenefitsData();

  return (
    <BenefitsClient 
      benefits={benefits} 
      realBenefits={realBenefits} 
    />
  );
}