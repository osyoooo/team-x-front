import { getGrowthData } from '@/lib/growthExternalAPI';
import GrowthClient from './GrowthClient';

export default async function GrowthPage() {
  // Server Componentでデータ取得
  const { growth, realGrowth } = await getGrowthData();

  return (
    <GrowthClient 
      growth={growth} 
      realGrowth={realGrowth} 
    />
  );
}