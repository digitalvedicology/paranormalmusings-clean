import Hero from '@/components/hero/Hero'
import About from '@/components/sections/About'
import CardBand from '@/components/sections/CardBand'
import ExploreTopics from '@/components/sections/ExploreTopics'
import FeatureBand from '@/components/sections/FeatureBand'
import FourWaysIn from '@/components/sections/FourWaysIn'
import Highlights from '@/components/sections/Highlights'
import Investigation from '@/components/sections/Investigation'
import LatestPosts from '@/components/sections/LatestPosts'
import WriteToUs from '@/components/sections/WriteToUs'
import Spotlight from '@/components/sections/Spotlight'
import { getContent } from '@/lib/content'

export default async function Home() {
  const content = await getContent()

  return (
    <>
      <Hero author={content.site.author} />
      <Highlights />
      {/* Which section leads the page and which takes the card band are both
          chosen in the admin, so the order here is data rather than markup. */}
      <FeatureBand category={content.home.featureCategory} />
      <ExploreTopics />
      <Spotlight />
      <CardBand category={content.home.cardBandCategory} />
      <Investigation />
      <FourWaysIn />
      <About />
      <LatestPosts />
      <WriteToUs />
    </>
  )
}
