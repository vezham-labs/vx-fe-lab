import { CustomTabs } from '../../../tabs'

const ContentSocialSettings = () => {
  const tabs = [
    {
      id: 'discord',
      label: 'Discord',
      content: <p>View your project overview and recent activity.</p>
    },
    {
      id: 'games',
      label: 'Connected Games',
      content: <p>Track your metrics and analyze performance data.</p>
    }
  ]

  return (
    <div>
      <CustomTabs tabs={tabs} />
    </div>
  )
}

export { ContentSocialSettings }
